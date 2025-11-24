/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export', // Removed: Static export doesn't support API Routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
