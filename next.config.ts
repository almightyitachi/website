import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 requires every next/image `quality` value to be allow-listed.
  // The Wordmark renders the logo at quality 100 for crisp retina display.
  images: {
    qualities: [75, 100],
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
