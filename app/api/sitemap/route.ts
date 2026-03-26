import { NextResponse } from 'next/server';
import { locales } from '@/lib/i18n/config';
import { getAllProductSlugs, getCategories } from '@/lib/sanity/queries';

// 标记为动态路由，避免构建时获取数据
export const dynamic = 'force-dynamic';

// 静态页面路径及优先级配置
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: '/about', priority: 0.9, changefreq: 'weekly' },
  { path: '/products', priority: 0.9, changefreq: 'daily' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
];

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';
  
  let productSlugs: Array<{ slug: string }> = [];
  let categories: Array<{ slug?: { current?: string } }> = [];
  
  // 尝试从 Sanity 获取动态数据，失败则使用空数组
  try {
    [productSlugs, categories] = await Promise.all([
      getAllProductSlugs(),
      getCategories(),
    ]);
  } catch (error) {
    console.error('Failed to fetch data for sitemap:', error);
    // 使用空数组继续生成基础 sitemap
  }
  
  const urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
    images?: Array<{ loc: string; caption: string }>;
  }> = [];
  
  for (const locale of locales) {
    // 静态页面
    for (const page of staticPages) {
      urls.push({
        loc: `${baseUrl}/${locale}${page.path}`,
        lastmod: new Date().toISOString(),
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }
    
    // 分类页面
    for (const category of categories) {
      const slug = category.slug?.current;
      if (slug) {
        urls.push({
          loc: `${baseUrl}/${locale}/products?category=${slug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.7,
        });
      }
    }
    
    // 产品详情页
    for (const product of productSlugs) {
      urls.push({
        loc: `${baseUrl}/${locale}/products/${product.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
    }
  }
  
  // 生成增强版 XML Sitemap（包含图片）
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.images ? url.images.map(img => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('\n') : ''}
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
