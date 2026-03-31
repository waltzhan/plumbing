import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n/config';
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from '@/lib/sanity/queries';
import { urlForImage } from '@/lib/sanity/client';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/utils/structured-data';
import ProductImageGallery from './ProductImageGallery';

// 加载翻译文件
function getMessages(locale: string) {
  const messagesMap: Record<string, any> = {
    en: require('@/messages/en.json'),
    zh: require('@/messages/zh.json'),
    id: require('@/messages/id.json'),
    th: require('@/messages/th.json'),
    vi: require('@/messages/vi.json'),
    ar: require('@/messages/ar.json'),
  };
  return messagesMap[locale] || messagesMap.en;
}

// ISR 配置：每 1 小时重新验证
export const revalidate = 3600;

// 生成静态参数 - 从 Sanity 动态获取所有产品 slug
export async function generateStaticParams() {
  // 暂时只生成一个产品的静态页面用于测试
  // 如果这能工作，说明问题是数据相关的
  return [
    { locale: 'en', slug: 'toto-lb-two-handle-widespread-1-2-gpm-bathroom-sink-faucet-polished-chrome-tls01201u-cp' },
    { locale: 'zh', slug: 'toto-lb-two-handle-widespread-1-2-gpm-bathroom-sink-faucet-polished-chrome-tls01201u-cp' },
  ];
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://globalplumb.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | bojet' };
  }

  const name = product.name?.[locale] || product.name?.en || product.name?.zh || '';
  const description =
    product.seo?.metaDescription?.[locale] ||
    product.shortDescription?.[locale] ||
    product.shortDescription?.en ||
    '';
  const title = product.seo?.metaTitle?.[locale] || `${name} | bojet`;
  let imageUrl = `${baseUrl}/og-image.jpg`;
  try {
    if (product.mainImage) {
      imageUrl = urlForImage(product.mainImage);
    }
  } catch (error) {
    console.error('Error generating image URL in metadata:', error);
  }

  // 为每种语言生成 alternate 链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}/products/${slug}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/products/${slug}`,
      languages: alternateLanguages,
    },
    // Open Graph - 社交媒体优化
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/products/${slug}`,
      siteName: locale === 'zh' ? '博杰卫浴' : 'bojet',
      locale: locale,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    // 关键词（用于 SEO）
    keywords: [
      name,
      product.model,
      'LED',
      product.category?.title?.[locale] || 'LED',
      locale === 'zh' ? '博杰卫浴' : 'bojet',
      'manufacturer',
      'wholesale',
    ].filter(Boolean),
    // 机器人指令
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = getMessages(locale);
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) value = value?.[k];
    return value || key;
  };

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // 清理 HTML：去除爬虫遗留的无用内容
  function cleanHtml(html: string): string {
    if (!html) return '';
    return html
      // 移除所有 <img> 标签（官网装饰图标，在我们网站无效）
      .replace(/<img[^>]*>/gi, '')
      // 移除所有 <a href="javascript:..."> 脚本链接
      .replace(/<a[^>]*href="javascript:[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
      // 移除所有 <a> 标签但保留内容
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
      // 移除爬虫带入的页面导航区块（else_prve_next 及其后内容）
      .replace(/<div[^>]*class="[^"]*else_prve_next[^"]*"[\s\S]*/gi, '')
      // 移除爬虫带入的 detail_contact 区块
      .replace(/<div[^>]*class="[^"]*detail_contact[^"]*"[\s\S]*/gi, '')
      // 移除开头的孤立闭合标签（如 "</p>"）
      .replace(/^\s*<\/[^>]+>\s*/, '')
      // 清理多余的空白行
      .replace(/(<br\s*\/?>\s*){3,}/gi, '<br/><br/>')
      .trim();
  }

  // 判断字符串是否含 HTML 标签
  function isHtml(str: string): boolean {
    return /<[a-z][\s\S]*>/i.test(str);
  }

  const productName = product.name?.[locale] || product.name?.en || product.name?.zh || '';
  const categoryName =
    product.category?.title?.[locale] ||
    product.category?.title?.en ||
    product.category?.title?.zh ||
    '';
  const rawDescription =
    product.description?.[locale] ||
    product.description?.en ||
    product.description?.zh ||
    product.shortDescription?.[locale] ||
    product.shortDescription?.en ||
    '';
  const description = rawDescription ? cleanHtml(rawDescription) : '';
  const descriptionIsHtml = isHtml(description);
  // 产品特性数据暂时禁用，因为 Sanity 中的数据不正确
  // const features: string[] =
  //   product.features?.[locale] || product.features?.en || product.features?.zh || [];
  const features: string[] = [];
  const rawApplications = product.applications?.[locale] || product.applications?.en || product.applications?.zh || [];
  const applications: string[] = Array.isArray(rawApplications) ? rawApplications : [];

  let imageUrl = null;
  try {
    if (product.mainImage) {
      imageUrl = urlForImage(product.mainImage);
    }
  } catch (error) {
    console.error('Error generating main image URL:', error);
  }

  // 处理 gallery 图片
  const galleryImages: string[] = [];
  if (product.gallery && Array.isArray(product.gallery)) {
    for (const img of product.gallery) {
      try {
        if (img) {
          const url = urlForImage(img);
          if (url) galleryImages.push(url);
        }
      } catch (error) {
        console.error('Error generating gallery image URL:', error);
      }
    }
  }

  // 结构化数据
  let productSchema: any = {};
  let breadcrumbSchema: any = {};
  try {
    productSchema = generateProductSchema(product, locale);
    breadcrumbSchema = generateBreadcrumbSchema(
      [
        { name: messages?.navigation?.home || 'Home', url: '/' },
        { name: messages?.navigation?.products || 'Products', url: '/products' },
        { name: productName, url: `/products/${slug}` },
      ],
      locale,
    );
  } catch (error) {
    console.error('Error generating schema:', error);
  }

  // 相关产品
  let relatedProducts: any[] = [];
  try {
    if (product.category?._id) {
      relatedProducts = await getRelatedProducts(product._id, product.category._id, 4);
    }
  } catch (error) {
    console.error('Error fetching related products:', error);
    relatedProducts = [];
  }

  const isRtl = locale === 'ar';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className={`flex items-center space-x-2 text-sm text-gray-500 ${isRtl ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Link href={getLocalizedHref('/')} className="hover:text-blue-900">{messages?.navigation?.home || 'Home'}</Link>
              <span>/</span>
              <Link href={getLocalizedHref('/products')} className="hover:text-blue-900">{messages?.navigation?.products || 'Products'}</Link>
              <span>/</span>
              {categoryName && (
                <>
                  <Link href={getLocalizedHref(`/products?category=${product.category?.slug?.current}`)} className="hover:text-blue-900">{categoryName}</Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-900 truncate max-w-[200px]">{productName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Main Product Block */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 ${isRtl ? 'direction-rtl' : ''}`}>
            {/* Product Image Gallery */}
            <ProductImageGallery
              mainImageUrl={imageUrl}
              galleryImages={galleryImages}
              productName={productName}
              productModel={product.model}
            />

            {/* Product Info */}
            <div className={isRtl ? 'text-right' : ''}>
              {categoryName && (
                <Link
                  href={getLocalizedHref(`/products?category=${product.category?.slug?.current}`)}
                  className="inline-block text-sm text-blue-600 font-medium mb-3 hover:underline uppercase tracking-wide"
                >
                  {categoryName}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {productName}
              </h1>
              {product.model && (
                <p className="text-gray-400 text-sm font-mono mb-4">{t('products.model') || 'Model'}: {product.model}</p>
              )}
              {product.status === 'new' && (
                <span className="inline-block bg-green-500 text-white text-sm font-bold px-3 py-1 rounded mb-4">
                  {t('common.new')}
                </span>
              )}
              {description && (
                descriptionIsHtml ? (
                  <div
                    className="text-gray-700 text-base leading-relaxed mb-8 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className="text-gray-700 text-base leading-relaxed mb-8">
                    {description}
                  </p>
                )
              )}

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                <Link
                  href={getLocalizedHref('/contact')}
                  className="flex-1 bg-blue-900 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  {messages?.navigation?.inquiry || 'Inquiry'}
                </Link>
              </div>
            </div>
          </div>

          {/* Features & Applications - 暂时注释掉产品特性版块 */}
          {applications.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* 
              TODO: 产品特性版块暂时隐藏，等待更好的内容匹配后再启用
              {features.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">{t('products.features')}</h2>
                  <ul className="space-y-3">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              */}

              {applications.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">{t('products.applications')}</h2>
                  <ul className="space-y-3">
                    {applications.map((app: string, index: number) => (
                      <li key={index} className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('products.specifications')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications)
                      .filter(([key, value]) => value && key !== '_type')
                      .map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className={`py-3 px-5 font-medium text-gray-700 w-1/3 ${isRtl ? 'text-right' : ''}`}>
                            {key === 'material' ? '材质' :
                             key === 'finish' ? '表面处理' :
                             key === 'color' ? '颜色' :
                             key === 'size' ? '尺寸' :
                             key === 'weight' ? '重量' :
                             key === 'installation' ? '安装方式' :
                             key === 'certification' ? '认证' : key}
                          </td>
                          <td className={`py-3 px-5 text-gray-900 ${isRtl ? 'text-right' : ''}`}>
                            {value as string}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t('products.relatedProducts') || (locale === 'zh' ? '相关产品' : locale === 'ar' ? 'منتجات ذات صلة' : 'Related Products')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p: any) => {
                  const rName = p.name?.[locale] || p.name?.en || p.name?.zh || '';
                  let rImg = null;
                  try {
                    if (p.mainImage) {
                      rImg = urlForImage(p.mainImage);
                    }
                  } catch (error) {
                    console.error('Error generating image URL for related product:', error);
                  }
                  return (
                    <Link
                      key={p._id}
                      href={getLocalizedHref(`/products/${p.slug?.current}`)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
                    >
                      <div className="relative h-24 mb-3 bg-gray-50 rounded">
                        {rImg ? (
                          <Image src={rImg} alt={rName} fill className="object-contain p-2" sizes="200px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{rName}</p>
                      {p.model && <p className="text-xs text-gray-400 mt-1 font-mono">{p.model}</p>}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className={isRtl ? 'text-right' : ''}>
            <Link href={getLocalizedHref('/products')} className="text-blue-900 hover:underline text-sm">
              ← {t('products.backToProducts') || 'Back to Products'}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
