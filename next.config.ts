import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 requires every next/image `quality` value to be allow-listed.
  // The Wordmark renders the logo at quality 100 for crisp retina display.
  images: {
    qualities: [75, 100],
    // Decorative candidate/student avatars on the marketing graphics are pulled
    // from randomuser.me (stable, predictable portrait URLs).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
    ],
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
