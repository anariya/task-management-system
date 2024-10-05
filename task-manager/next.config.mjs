/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    async headers() {
      return [
        {
          // Match all routes
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; object-src 'none';",
            },
          ],
        },
      ];
    },
  };