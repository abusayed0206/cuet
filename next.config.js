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
if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

module.exports = nextConfig;
