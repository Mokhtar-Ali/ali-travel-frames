import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "pub-ec6b76c0eef842d1bd7d65492c044988.r2.dev",
        pathname: "/Ali%20Travel%20Frames/Me-in-Colombia.jpg",
      },
    ],
  },
};

export default nextConfig;
