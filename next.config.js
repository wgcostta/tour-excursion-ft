/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com', // Google Images
      'lh4.googleusercontent.com', // Google Images
      'lh5.googleusercontent.com', // Google Images
      'lh6.googleusercontent.com', // Google Images
    ],
  },
  // Desabilita otimizações que dependem do critters
  experimental: {
    optimizeCss: false,
    esmExternals: false,
  },
  // Configuração para evitar problemas com módulos
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Ignora módulos problemáticos no lado cliente
    config.externals = config.externals || [];
    config.externals.push('critters');
    
    return config;
  },
  // Desabilita otimizações CSS inline que causam problemas
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig