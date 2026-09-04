import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@geaklabs/ui", "@geaklabs/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
