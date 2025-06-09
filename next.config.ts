
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['handlebars'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
};

export default nextConfig;
