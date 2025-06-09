
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['handlebars'], // Keep this for Handlebars compatibility
  typescript: {
    // Set to false to fail build on TypeScript errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to false to fail build on ESLint errors
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // allowedDevOrigins is not a standard Next.js experimental option.
    // If this was for a specific purpose like Firebase emulators, it might need a different setup.
    // For now, keeping it as per existing, but be aware it causes a warning.
    // allowedDevOrigins: [
    //   'https://6000-firebase-studio-1749459475784.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev',
    // ],
  },
  webpack: (config, { isServer }) => {
    // For client-side bundles, we want to ensure Handlebars doesn't cause issues.
    // Genkit flows run on the server, so Handlebars is only needed there.
    if (!isServer) {
      // Provide a mock/empty module for handlebars on the client.
      // This prevents Webpack from trying to bundle the actual Handlebars library,
      // which contains Node.js specific code like `require.extensions`.
      config.resolve.alias = {
        ...config.resolve.alias,
        handlebars: false,
      };
    }
    return config;
  },
};

export default nextConfig;
