/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Change the output directory
  distDir: 'out',
  // Optional: Optimize images for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
