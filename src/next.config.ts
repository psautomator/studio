
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
    if (!isServer) {
      // This alias prevents Handlebars (a Genkit dependency) from being bundled client-side,
      // where its Node.js-specific features (like require.extensions) can cause errors.
      // Genkit uses Handlebars for server-side prompt templating, so it's not needed on the client.
      config.resolve.alias = {
        ...config.resolve.alias, // Preserve existing aliases
        handlebars: false,
      };
    }
    return config;
  },
};

export default nextConfig;
