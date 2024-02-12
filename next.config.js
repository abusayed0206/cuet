/** @type {import('next').NextConfig} */

const nextConfig = {};
module.exports = nextConfig;
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      "discord.c99.nl",
      "raw.githubusercontent.com",
      "trakt-widgets.vercel.app",
    ],
  },
};
