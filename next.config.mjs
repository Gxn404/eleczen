/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "10.34.196.93:3000"],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
