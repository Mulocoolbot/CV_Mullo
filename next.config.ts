import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS ? "/CV_Mullo" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  transpilePackages: ["three"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
