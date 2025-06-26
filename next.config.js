const { withContentlayer } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 외부 이미지 도메인 허용
  images: {
    unoptimized: true, // GitHub assets에 대해 최적화 비활성화
    domains: [
      // GitHub 이미지 도메인들
      "github.com",
      "user-images.githubusercontent.com",
      "camo.githubusercontent.com",
      "raw.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/user-attachments/assets/**",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "camo.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // GitHub assets 로딩을 위한 헤더 설정
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
    ];
  },

  // MDX HMR을 위한 설정
  experimental: {
    // Contentlayer가 변경사항을 빠르게 감지하도록 설정
    serverComponentsExternalPackages: ["contentlayer2"],
  },
  // 개발 모드에서 빠른 새로고침 활성화
  reactStrictMode: true,
  // 파일 시스템 변경을 더 빠르게 감지
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // MDX 파일 변경을 더 빠르게 감지하도록 설정
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // 1초마다 폴링
        aggregateTimeout: 300, // 300ms 디바운스
      };
    }
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
