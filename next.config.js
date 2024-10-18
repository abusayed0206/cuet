/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing environment variables
  env: {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
  },

  // Rewrites for handling Open Graph image requests
  async rewrites() {
    return [
      {
        // Rewrite for PNG requests
        source: '/api/og/:studentId.png',
        destination: '/api/og/:studentId/png', // Your API route for generating PNG
      },
      {
        // Rewrite for SVG requests
        source: '/api/og/:studentId.svg',
        destination: '/api/og/:studentId/svg', // Your API route for generating SVG
      },
    ];
  },
};

module.exports = nextConfig;
