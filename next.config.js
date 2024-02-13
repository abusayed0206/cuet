/** @type {import('next').NextConfig} */

const nextConfig = {};
module.exports = nextConfig;
module.exports = {
  images: {
    domains: ["discord.c99.nl", "raw.githubusercontent.com"],
  },

  async rewrites() {
    return [
      {
        source: "/.well-known/webfinger",
        destination: "/api/.well-known/webfinger",
      },
    ];
  },
};
