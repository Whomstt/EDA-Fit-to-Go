import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: '/CS4227-Fit-to-Go',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://spring-app:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
