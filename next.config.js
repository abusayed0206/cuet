/** @type {import('next').NextConfig} */

const nextConfig = {
  // Add the rewrites for sitemap.xml and paginated sitemaps
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap-0.xml',  // Maps to the dynamic route for the sitemap index
      },
      {
        source: '/sitemap-:id.xml',
        destination: '/api/sitemap-:id.xml',  // Maps to the dynamic route for paginated sitemaps
      },
    ]
  },
};

// Export environment variables and merged configuration
module.exports = {
  ...nextConfig,
  env: {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
  },
};
