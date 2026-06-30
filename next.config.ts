import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["logo.clearbit.com", "ui-avatars.com"],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
