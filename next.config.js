/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
  },
  async rewrites() {
    return [
      {
        source: "/api/og/:studentId.png",
        destination: "/api/og/:studentId/png",
      },
      {
        source: "/api/og/:studentId.svg",
        destination: "/api/og/:studentId/svg",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.abusayed.dev",
      },
    ],
  },
};

module.exports = nextConfig;
