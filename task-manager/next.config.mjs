/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    async headers() {
      return [
        {
          // Apply headers to all routes
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://static.cloudflareinsights.com; frame-ancestors 'self' https://accounts.google.com; object-src 'none';",
            },
          ],
        },
      ];
    },
  };
  