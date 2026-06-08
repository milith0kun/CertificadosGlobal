/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['72.60.114.137'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
