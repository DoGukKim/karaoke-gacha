import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://192.168.0.43:5173",
    "http://localhost:5173",
    "http://192.168.0.43:8081",
    "http://localhost:8081",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mngcrknlgmjlnjhgvzjb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mngcrknlgmjlnjhgvzjb.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
