import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // This can help with module resolution issues
    esmExternals: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    // Simplified webpack config
    config.optimization.splitChunks = {
      chunks: 'all',
    };
    
    return config;
  },
  // Transpile certain problematic packages
  transpilePackages: ['bcryptjs'],
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
};

export default nextConfig;