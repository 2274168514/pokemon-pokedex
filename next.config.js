/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 默认支持 app directory，不需要 experimental 配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/**',
      },
      {
        protocol: 'https',
        hostname: 'img.pokemondb.net',
        port: '',
        pathname: '/artwork/**',
      },
    ],
    // 增加超时时间和优化配置
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7天缓存
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig