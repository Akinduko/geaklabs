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
  // PostHog goes through this domain so ad blockers don't drop events (EU region).
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/pgst/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/pgst/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  // The social-card renderer reads the bundled serif from disk; make sure it ships with the functions.
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/**/*"],
  },
};

export default nextConfig;
