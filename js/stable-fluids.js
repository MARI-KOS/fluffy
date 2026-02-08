import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

const container = document.getElementById("canvas-container");
if (!container) {
  throw new Error("canvas-container not found");
}

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer.setClearColor(0xffffff, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const quadGeom = new THREE.PlaneGeometry(2, 2);
const quadVert = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
}
`;

const resolution = new THREE.Vector2();

function getRTConfig() {
  const isWebGL2 = renderer.capabilities.isWebGL2;
  const hasHalf = isWebGL2 || !!renderer.extensions.get("OES_texture_half_float");
  const hasFloat = isWebGL2 || !!renderer.extensions.get("OES_texture_float");
  const type = hasFloat ? THREE.FloatType : hasHalf ? THREE.HalfFloatType : THREE.UnsignedByteType;

  const needLinearExt =
    type === THREE.FloatType
      ? "OES_texture_float_linear"
      : type === THREE.HalfFloatType
        ? "OES_texture_half_float_linear"
        : null;
  const hasLinear = isWebGL2 || !needLinearExt || !!renderer.extensions.get(needLinearExt);
  const filter = hasLinear ? THREE.LinearFilter : THREE.NearestFilter;

  return { type, filter };
}

class FBO {
  constructor() {
    const { type, filter } = getRTConfig();
    const pixelRatio = renderer.getPixelRatio();
    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);
    this.read = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type,
      minFilter: filter,
      magFilter: filter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.write = this.read.clone();
  }

  swap() {
    const t = this.read;
    this.read = this.write;
    this.write = t;
  }

  resize() {
    const pixelRatio = renderer.getPixelRatio();
    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);
    this.read.setSize(width, height);
    this.write.setSize(width, height);
  }
}

function updateResolution() {
  const pixelRatio = renderer.getPixelRatio();
  resolution.set(
    Math.floor(window.innerWidth * pixelRatio),
    Math.floor(window.innerHeight * pixelRatio),
  );
}
updateResolution();

const velocityFBO = new FBO();
const divergenceFBO = new FBO();
const pressureFBO = new FBO();
const dyeFBO = new FBO();

const mousePos = new THREE.Vector2(0, 0);
const prevMousePos = new THREE.Vector2(0, 0);
const mouseDir = new THREE.Vector2(0, 0);
let moving = 0;

function updateMouse(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const pixelRatio = renderer.getPixelRatio();
  const x = (e.clientX - rect.left) * pixelRatio;
  const y = (rect.height - (e.clientY - rect.top)) * pixelRatio;
  prevMousePos.copy(mousePos);
  mousePos.set(x, y);
  mouseDir.subVectors(mousePos, prevMousePos);
  if (mouseDir.lengthSq() > 0.0001) {
    mouseDir.normalize();
    moving = 1.0;
  }
}

window.addEventListener("mousemove", updateMouse, { passive: true });
window.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches?.[0];
    if (t) updateMouse(t);
  },
  { passive: true },
);

function makeQuad(fragmentShader, uniforms = {}) {
  return new THREE.Mesh(
    quadGeom,
    new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: quadVert,
      fragmentShader,
    }),
  );
}

const advectVelocityQuad = makeQuad(
  `
precision highp float;
uniform sampler2D u_velocityTexture;
uniform float u_deltaTime;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv;
  vec2 vel = texture2D(u_velocityTexture, uv).xy;
  gl_FragColor = texture2D(u_velocityTexture, uv - vel * u_deltaTime);
}
`,
  {
    u_velocityTexture: { value: null },
    u_deltaTime: { value: 0 },
  },
);
const advectVelocityScene = new THREE.Scene();
advectVelocityScene.add(advectVelocityQuad);

const addForceQuad = makeQuad(
  `
precision highp float;
uniform sampler2D u_velocityTexture;
uniform vec2 u_mouseCoord;
uniform vec2 u_mouseDir;
uniform float u_forceRadius;
uniform float u_addForce;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv;
  vec2 velocity = texture2D(u_velocityTexture, uv).xy;
  float influence = smoothstep(u_forceRadius, 0.0, length(u_mouseCoord - gl_FragCoord.xy));
  vec2 force = influence * u_mouseDir * u_addForce;
  gl_FragColor = vec4(velocity + force, 0.0, 0.0);
}
`,
  {
    u_velocityTexture: { value: null },
    u_mouseCoord: { value: mousePos },
    u_mouseDir: { value: mouseDir },
    u_forceRadius: { value: 70 },
    u_addForce: { value: 0 },
  },
);
const addForceScene = new THREE.Scene();
addForceScene.add(addForceQuad);

const divergenceQuad = makeQuad(
  `
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_velocityTexture;
varying vec2 v_uv;
vec2 xOffset;
vec2 yOffset;
void main() {
  xOffset = vec2(1.0 / u_resolution.x, 0.0);
  yOffset = vec2(0.0, 1.0 / u_resolution.y);
  vec2 uv = v_uv;
  float vr = texture2D(u_velocityTexture, uv + xOffset).x;
  float vl = texture2D(u_velocityTexture, uv - xOffset).x;
  float vb = texture2D(u_velocityTexture, uv - yOffset).y;
  float vt = texture2D(u_velocityTexture, uv + yOffset).y;
  float div = ((vr - vl) + (vt - vb)) * 0.5;
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`,
  {
    u_resolution: { value: resolution },
    u_velocityTexture: { value: null },
  },
);
const divergenceScene = new THREE.Scene();
divergenceScene.add(divergenceQuad);

const pressureQuad = makeQuad(
  `
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_divergenceTexture;
uniform sampler2D u_pressureTexture;
varying vec2 v_uv;
vec2 xOffset;
vec2 yOffset;
void main() {
  xOffset = vec2(1.0 / u_resolution.x, 0.0);
  yOffset = vec2(0.0, 1.0 / u_resolution.y);
  vec2 uv = v_uv;
  float pT = texture2D(u_pressureTexture, uv + yOffset).r;
  float pB = texture2D(u_pressureTexture, uv - yOffset).r;
  float pR = texture2D(u_pressureTexture, uv + xOffset).r;
  float pL = texture2D(u_pressureTexture, uv - xOffset).r;
  float div = texture2D(u_divergenceTexture, uv).r;
  float p = (pL + pR + pT + pB - div) * 0.25;
  gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
}
`,
  {
    u_resolution: { value: resolution },
    u_divergenceTexture: { value: null },
    u_pressureTexture: { value: null },
  },
);
const pressureScene = new THREE.Scene();
pressureScene.add(pressureQuad);

const subtractPressureQuad = makeQuad(
  `
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_pressureTexture;
uniform sampler2D u_velocityTexture;
varying vec2 v_uv;
vec2 xOffset;
vec2 yOffset;
void main() {
  xOffset = vec2(1.0 / u_resolution.x, 0.0);
  yOffset = vec2(0.0, 1.0 / u_resolution.y);
  vec2 uv = v_uv;
  float pT = texture2D(u_pressureTexture, uv + yOffset).r;
  float pB = texture2D(u_pressureTexture, uv - yOffset).r;
  float pR = texture2D(u_pressureTexture, uv + xOffset).r;
  float pL = texture2D(u_pressureTexture, uv - xOffset).r;
  vec2 grad = vec2(pR - pL, pT - pB) * 0.5;
  vec2 vel = texture2D(u_velocityTexture, uv).xy * 0.99;
  gl_FragColor = vec4(vel - grad, 0.0, 1.0);
}
`,
  {
    u_resolution: { value: resolution },
    u_pressureTexture: { value: null },
    u_velocityTexture: { value: null },
  },
);
const subtractPressureScene = new THREE.Scene();
subtractPressureScene.add(subtractPressureQuad);

const advectDyeQuad = makeQuad(
  `
precision highp float;
uniform sampler2D u_velocityTexture;
uniform sampler2D u_dyeTexture;
uniform float u_deltaTime;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv;
  vec2 vel = texture2D(u_velocityTexture, uv).xy;
  vec4 col = texture2D(u_dyeTexture, uv - vel * u_deltaTime * 1.2);
  gl_FragColor = vec4(col.rgb, 1.0);
}
`,
  {
    u_velocityTexture: { value: null },
    u_dyeTexture: { value: null },
    u_deltaTime: { value: 0 },
  },
);
const advectDyeScene = new THREE.Scene();
advectDyeScene.add(advectDyeQuad);

const addDyeQuad = makeQuad(
  `
precision highp float;
uniform sampler2D u_dyeTexture;
uniform vec2 u_mouseCoord;
uniform float u_forceRadius;
uniform float u_addDye;
uniform float u_time;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv;
  vec3 base = texture2D(u_dyeTexture, uv).rgb;

  // Pastel palette
  vec3 pink = vec3(1.0, 0.75, 0.85);
  vec3 blue = vec3(0.7, 0.95, 1.0);
  vec3 gold = vec3(1.0, 0.95, 0.7);
  vec3 dyn = mix(pink, blue, sin(u_time * 0.7 + uv.x * 2.5) * 0.5 + 0.5);
  dyn = mix(dyn, gold, cos(u_time * 0.5 + uv.y * 3.0) * 0.5 + 0.5);
  dyn = max(dyn, vec3(0.85));

  float influence = smoothstep(u_forceRadius, 0.0, length(u_mouseCoord - gl_FragCoord.xy));
  vec3 outCol = mix(base, dyn, influence * u_addDye * 0.7);
  gl_FragColor = vec4(outCol, 1.0);
}
`,
  {
    u_dyeTexture: { value: null },
    u_mouseCoord: { value: mousePos },
    u_forceRadius: { value: 120 },
    u_addDye: { value: 0 },
    u_time: { value: 0 },
  },
);
const addDyeScene = new THREE.Scene();
addDyeScene.add(addDyeQuad);

const finalQuad = makeQuad(
  `
precision highp float;
uniform sampler2D u_dyeTexture;
varying vec2 v_uv;
void main() {
  vec3 color = clamp(texture2D(u_dyeTexture, v_uv).rgb, 0.0, 1.0);
  float w = length(color);
  vec3 finalCol = mix(vec3(1.0), color, smoothstep(0.02, 0.35, w));
  gl_FragColor = vec4(finalCol, 1.0);
}
`,
  {
    u_dyeTexture: { value: null },
  },
);
scene.add(finalQuad);

function clearDyeToWhite() {
  const clearQuad = makeQuad(
    `
precision highp float;
void main() {
  gl_FragColor = vec4(1.0);
}
`,
    {},
  );
  const clearScene = new THREE.Scene();
  clearScene.add(clearQuad);
  renderer.setRenderTarget(dyeFBO.write);
  renderer.render(clearScene, camera);
  renderer.setRenderTarget(null);
  dyeFBO.swap();
}
clearDyeToWhite();

function resize() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateResolution();
  velocityFBO.resize();
  divergenceFBO.resize();
  pressureFBO.resize();
  dyeFBO.resize();
  clearDyeToWhite();
}
window.addEventListener("resize", resize);

const clock = new THREE.Clock();
const PRESSURE_ITERS = 8;

function step() {
  const delta = clock.getDelta();
  moving *= 0.94;

  advectVelocityQuad.material.uniforms.u_velocityTexture.value = velocityFBO.read.texture;
  advectVelocityQuad.material.uniforms.u_deltaTime.value = delta;
  renderer.setRenderTarget(velocityFBO.write);
  renderer.render(advectVelocityScene, camera);
  renderer.setRenderTarget(null);
  velocityFBO.swap();

  addForceQuad.material.uniforms.u_velocityTexture.value = velocityFBO.read.texture;
  addForceQuad.material.uniforms.u_addForce.value = moving;
  renderer.setRenderTarget(velocityFBO.write);
  renderer.render(addForceScene, camera);
  renderer.setRenderTarget(null);
  velocityFBO.swap();

  divergenceQuad.material.uniforms.u_velocityTexture.value = velocityFBO.read.texture;
  renderer.setRenderTarget(divergenceFBO.write);
  renderer.render(divergenceScene, camera);
  renderer.setRenderTarget(null);
  divergenceFBO.swap();

  for (let i = 0; i < PRESSURE_ITERS; i++) {
    pressureQuad.material.uniforms.u_divergenceTexture.value = divergenceFBO.read.texture;
    pressureQuad.material.uniforms.u_pressureTexture.value = pressureFBO.read.texture;
    renderer.setRenderTarget(pressureFBO.write);
    renderer.render(pressureScene, camera);
    renderer.setRenderTarget(null);
    pressureFBO.swap();
  }

  subtractPressureQuad.material.uniforms.u_velocityTexture.value = velocityFBO.read.texture;
  subtractPressureQuad.material.uniforms.u_pressureTexture.value = pressureFBO.read.texture;
  renderer.setRenderTarget(velocityFBO.write);
  renderer.render(subtractPressureScene, camera);
  renderer.setRenderTarget(null);
  velocityFBO.swap();

  advectDyeQuad.material.uniforms.u_velocityTexture.value = velocityFBO.read.texture;
  advectDyeQuad.material.uniforms.u_dyeTexture.value = dyeFBO.read.texture;
  advectDyeQuad.material.uniforms.u_deltaTime.value = delta;
  renderer.setRenderTarget(dyeFBO.write);
  renderer.render(advectDyeScene, camera);
  renderer.setRenderTarget(null);
  dyeFBO.swap();

  addDyeQuad.material.uniforms.u_dyeTexture.value = dyeFBO.read.texture;
  addDyeQuad.material.uniforms.u_addDye.value = moving;
  addDyeQuad.material.uniforms.u_time.value += 0.02;
  renderer.setRenderTarget(dyeFBO.write);
  renderer.render(addDyeScene, camera);
  renderer.setRenderTarget(null);
  dyeFBO.swap();

  finalQuad.material.uniforms.u_dyeTexture.value = dyeFBO.read.texture;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  requestAnimationFrame(step);
}
step();
