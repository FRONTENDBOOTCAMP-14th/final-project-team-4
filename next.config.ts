import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t1.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "fdzlnftvhekjhabnugrl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "phinf.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pstatic.net",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
