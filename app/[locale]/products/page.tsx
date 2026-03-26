import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';
import { getProducts, getCategoryTree } from '@/lib/sanity/queries';
import { urlForImage } from '@/lib/sanity/client';
import Breadcrumb from '@/components/ui/breadcrumb';

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

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

// ISR 配置：每 1 小时重新验证
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  const title = `${messages.navigation.products} | bojet`;
  const description = messages.metadata?.description;
  
  // 为每种语言生成 alternate 链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}/products`;
  }
  
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/products`,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/products`,
      siteName: locale === 'zh' ? '博杰卫浴' : 'bojet',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  const messages = getMessages(locale);
  const t = (key: string) => getNestedValue(messages, key);

  // 从 Sanity 获取真实数据
  const [products, categoryTree] = await Promise.all([
    getProducts(categorySlug),
    getCategoryTree(),
  ]);

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* 面包屑导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('navigation.home'), href: `/${locale}` },
            { label: t('navigation.products') },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`flex flex-col lg:flex-row gap-8 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
          {/* Sidebar - Categories Tree */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('products.categoriesTitle')}
              </h2>
              <nav className="space-y-1">
                {/* 全部产品 */}
                <Link
                  href={getLocalizedHref('/products')}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !categorySlug
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
                  }`}
                >
                  {t('products.allProducts')}
                  <span className="ml-2 text-xs opacity-70">({products.length})</span>
                </Link>

                {/* 顶级分类树 */}
                {categoryTree.map((topCat: any) => {
                  const topName = topCat.name?.[locale] || topCat.name?.en || topCat.name?.zh;
                  const hasChildren = topCat.children && topCat.children.length > 0;
                  const isTopActive = categorySlug === topCat.slug?.current;

                  return (
                    <div key={topCat._id}>
                      {/* 顶级分类行 */}
                      <Link
                        href={getLocalizedHref(`/products?category=${topCat.slug?.current}`)}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isTopActive
                            ? 'bg-blue-900 text-white'
                            : 'text-gray-800 hover:bg-gray-50 hover:text-blue-900'
                        }`}
                      >
                        <span>{topName}</span>
                        {hasChildren && (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </Link>

                      {/* 子分类 */}
                      {hasChildren && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                          {topCat.children.map((child: any) => {
                            const childName = child.name?.[locale] || child.name?.en || child.name?.zh;
                            const isChildActive = categorySlug === child.slug?.current;
                            return (
                              <Link
                                key={child._id}
                                href={getLocalizedHref(`/products?category=${child.slug?.current}`)}
                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-blue-100 text-blue-900 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-900'
                                }`}
                              >
                                {childName}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  {products.length} {locale === 'zh' ? '个产品' : locale === 'ar' ? 'منتج' : 'products'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product: any) => {
                    const productName = product.name?.[locale] || product.name?.en || product.name?.zh || '';
                    const categoryName = product.category?.name?.[locale] || product.category?.name?.en || product.category?.name?.zh || '';
                    const description = product.shortDescription?.[locale] || product.shortDescription?.en || product.shortDescription?.zh || '';
                    const imageUrl = product.mainImage ? urlForImage(product.mainImage) : null;

                    return (
                      <article
                        key={product._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              className="object-contain p-4"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                              <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-2 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-400">{product.model}</span>
                              </div>
                            </div>
                          )}
                          {product.status === 'new' && (
                            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {t('common.new')}
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-5 flex flex-col flex-1">
                          {categoryName && (
                            <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                              {categoryName}
                            </div>
                          )}
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                            {productName}
                          </h3>
                          {product.model && (
                            <p className="text-xs text-gray-400 mb-2 font-mono">{product.model}</p>
                          )}
                          {description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                              {description}
                            </p>
                          )}

                          {/* CTA Button */}
                          <Link
                            href={getLocalizedHref(`/products/${product.slug?.current}`)}
                            className="block w-full text-center bg-blue-900 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mt-auto"
                          >
                            {t('products.viewDetails')} →
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
