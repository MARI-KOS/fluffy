/** @type {import("next").NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;
