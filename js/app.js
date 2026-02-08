// UI interactions: loading, scroll animations, slider, contact

// --- Loading Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingBar = document.getElementById("loading-bar");
  const pageContainer = document.querySelector(".page-container");
  const body = document.body;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      loadingBar.style.width = "100%";

      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        pageContainer.classList.add("visible");
        body.classList.add("loaded");
        setTimeout(() => (loadingScreen.style.display = "none"), 1500);
      }, 600);
    } else {
      loadingBar.style.width = progress + "%";
    }
  }, 20);
});

// --- Scroll Animation ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".scroll-anim").forEach((el) => observer.observe(el));

// --- Slider Logic ---
const sliderWrapper = document.getElementById("sliderWrapper");
let isAnimating = false;

function updateClasses() {
  Array.from(sliderWrapper.children).forEach((slide, index) => {
    if (index === 0) slide.classList.add("active");
    else slide.classList.remove("active");
  });
}

function moveNext() {
  if (isAnimating) return;
  isAnimating = true;

  sliderWrapper.style.transition = "transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
  sliderWrapper.style.transform = "translateX(-100%)";

  setTimeout(() => {
    sliderWrapper.style.transition = "none";
    sliderWrapper.appendChild(sliderWrapper.firstElementChild);
    sliderWrapper.style.transform = "translateX(0)";
    updateClasses();
    isAnimating = false;
  }, 800);
}

function movePrev() {
  if (isAnimating) return;
  isAnimating = true;

  sliderWrapper.style.transition = "none";
  sliderWrapper.prepend(sliderWrapper.lastElementChild);
  sliderWrapper.style.transform = "translateX(-100%)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sliderWrapper.style.transition = "transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
      sliderWrapper.style.transform = "translateX(0)";
    });
  });

  setTimeout(() => {
    updateClasses();
    isAnimating = false;
  }, 800);
}

// Swipe / Drag
let startX = 0;
let startY = 0;
let pointerDown = false;

function onDown(e) {
  if (isAnimating) return;
  pointerDown = true;
  startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
  startY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
}

function onUp(e) {
  if (!pointerDown) return;
  pointerDown = false;
  const endX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX) ?? startX;
  const endY = e.clientY ?? (e.changedTouches && e.changedTouches[0]?.clientY) ?? startY;
  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < 45) return;
  if (Math.abs(dx) < Math.abs(dy)) return; // vertical scroll intent

  if (dx < 0) moveNext();
  else movePrev();
}

sliderWrapper.addEventListener("pointerdown", onDown, { passive: true });
window.addEventListener("pointerup", onUp, { passive: true });
sliderWrapper.addEventListener("touchstart", onDown, { passive: true });
window.addEventListener("touchend", onUp, { passive: true });

setInterval(moveNext, 5000);

// --- Contact Form Logic (GAS Integration) ---
const contactForm = document.getElementById("myContactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyejU2HI-uJ0RX4Z091VWjFhVOI7pmPqpXoWIUY10v1iDJlsHpNvEP8-uR1vNJ1QC84/exec";

  const formData = new FormData(contactForm);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));

  const btn = contactForm.querySelector("button");
  const originalText = btn.innerText;
  btn.innerText = "Sending...";
  btn.disabled = true;

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(() => {
      alert("メッセージを送信しました！");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("Error!", error.message);
      alert("送信に失敗しました。");
    })
    .finally(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    });
});
