import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eiyfpqwedihxllmaktyk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
