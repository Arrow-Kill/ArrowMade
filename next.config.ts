/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable Fast Refresh
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // Optimize development experience
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform if you're using styled-components
    styledComponents: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;