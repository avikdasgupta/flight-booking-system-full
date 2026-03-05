/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone output is used only for Docker; Vercel builds without it
  ...(process.env.BUILD_STANDALONE === '1' && { output: 'standalone' }),
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
