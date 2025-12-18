import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd && { output: 'export', distDir: 'dist/web' }), // output: 'export' (static export)에서는 Next.js Image 최적화가 작동하지 않습니다. 이미지 최적화를 비활성화
  allowedDevOrigins: ['192.168.0.43', 'localhost'],
  images: {
    unoptimized: isProd, // static export에서는 이미지 최적화 비활성화
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mngcrknlgmjlnjhgvzjb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'mngcrknlgmjlnjhgvzjb.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
