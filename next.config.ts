import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML/CSS/JS site to `out/`
  output: "export",
  // each page is written as <name>/index.html, which any static host serves at /<name>/
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
