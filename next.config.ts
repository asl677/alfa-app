import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'alfa-flame.vercel.app',
          },
        ],
        destination: 'https://alfa-app-flame.vercel.app/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'alfa-flame.app',
          },
        ],
        destination: 'https://alfa-app-flame.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
