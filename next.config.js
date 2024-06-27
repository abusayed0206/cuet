/** @type {import('next').NextConfig} */

const nextConfig = {};
module.exports = nextConfig;
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trakt-widgets.vercel.app",
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
};
