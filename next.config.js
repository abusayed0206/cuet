/** @type {import('next').NextConfig} */
const nextConfig = {
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
