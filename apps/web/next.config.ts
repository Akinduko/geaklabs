import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@geaklabs/ui", "@geaklabs/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["@geaklabs/ui"],
  },
  // The social-card renderer reads the bundled serif from disk; make sure it ships with the functions.
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/**/*"],
  },
};

export default nextConfig;
