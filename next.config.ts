import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app has no landing page yet: "/" goes straight to the Command Deck.
  // Temporary (307) so we can add a real landing page later without browsers caching this.
  async redirects() {
    return [{ source: "/", destination: "/dashboard", permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
