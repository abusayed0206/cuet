/** @type {import('next').NextConfig} */
const nextConfig = {
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
