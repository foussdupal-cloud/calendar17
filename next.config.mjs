/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore les erreurs TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;