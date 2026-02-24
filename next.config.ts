import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // disables Next.js image optimization
    remotePatterns: [
      {
        hostname: "**"
      }

    ]

  },
  /* config options here */
};

export default nextConfig;
