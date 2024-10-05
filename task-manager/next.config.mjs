/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    async headers() {
      return [
        {
          // Apply these headers to all routes
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://static.cloudflareinsights.com; object-src 'none';",
            },
          ],
        },
      ];
    },
  };
  