/** @type {import('next').NextConfig} */
// Build timestamp: 2025-03-18 - Force rebuild for SMTP update
const nextConfig = {
  images: {
    // 性能优化：支持现代图片格式，提升 Core Web Vitals LCP 指标
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 性能优化：启用图片懒加载缓存（缓存期30天）
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // 注意：根路径 / 的语言检测重定向在 app/page.tsx 中实现
  // 不要在这里添加重定向规则，否则会覆盖动态语言检测

  // 性能优化：启用 gzip 压缩
  compress: true,

  // SEO优化：隐藏 X-Powered-By 响应头
  poweredByHeader: false,

  // 性能优化：实验性特性
  experimental: {
    // 优化 Server Components 打包
    optimizePackageImports: ['lucide-react', '@sanity/client'],
  },

  // 性能优化：HTTP 响应头
  async headers() {
    return [
      {
        // 静态资源长期缓存
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // 字体文件缓存
        source: '/:path*.woff2',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // 页面安全响应头
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
