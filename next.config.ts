import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  eslint: {
    // eslint-config-next requires eslint 7/8/9; the project has eslint 10.
    // The lint script is still available manually; skip during Vercel builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
