import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles, getArticlesCount, getArticleCategories } from '@/lib/sanity/articles';
import { urlForImage } from '@/lib/sanity/client';
import { locales } from '@/lib/i18n/config';
import { Pagination } from '../../../components/ui/pagination';
import Breadcrumb from '@/components/ui/breadcrumb';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import idMessages from '@/messages/id.json';
import thMessages from '@/messages/th.json';
import viMessages from '@/messages/vi.json';
import arMessages from '@/messages/ar.json';

const messagesMap: Record<string, typeof enMessages> = {
  en: enMessages,
  zh: zhMessages,
  id: idMessages,
  th: thMessages,
  vi: viMessages,
  ar: arMessages,
};

function getMessages(locale: string) {
  return messagesMap[locale] || enMessages;
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const localeMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    id: 'id-ID',
    th: 'th-TH',
    vi: 'vi-VN',
    ar: 'ar-SA',
  };
  return date.toLocaleDateString(localeMap[locale] || 'en-US', options);
}

export const revalidate = 300;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale) as any;
  
  return {
    title: `${messages.news?.title || 'News Center'} | GOPRO LED`,
    description: messages.news?.description || 'Latest LED industry trends, technical articles and application cases',
    alternates: {
      canonical: `/${locale}/news`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/news`])
      ),
    },
  };
}

interface NewsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const messages = getMessages(locale) as any;
  
  if (!messages) {
    notFound();
  }
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  
  const isRtl = locale === 'ar';
  const currentPage = parseInt(searchParamsData.page || '1', 10);
  const categorySlug = searchParamsData.category;
  const pageSize = 9;
  const offset = (currentPage - 1) * pageSize;
  
  // 获取文章和分类
  const [articles, totalCount, categories] = await Promise.all([
    getArticles(locale, categorySlug, pageSize, offset),
    getArticlesCount(categorySlug),
    getArticleCategories(),
  ]);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // 获取当前分类名称
  const currentCategory = categorySlug 
    ? categories.find((c: any) => c.slug.current === categorySlug)
    : null;
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('news.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              {t('news.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 面包屑导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('navigation.home'), href: `/${locale}` },
            { label: t('navigation.news') },
          ]}
        />
      </div>

      {/* Category Filter */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Link
              href={`/${locale}/news`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categorySlug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('news.allCategories')}
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/${locale}/news?category=${category.slug.current}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === category.slug.current
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.title[locale] || category.title.zh || category.title.en}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentCategory && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCategory.title[locale] || currentCategory.title.zh}
              </h2>
              {currentCategory.description?.[locale] && (
                <p className="mt-2 text-gray-600">
                  {currentCategory.description[locale]}
                </p>
              )}
            </div>
          )}
          
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('news.noArticles')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any) => {
                  const title = article.title?.[locale] || article.title?.zh || article.title?.en;
                  const excerpt = article.excerpt?.[locale] || article.excerpt?.zh || article.excerpt?.en;
                  const categoryTitle = article.category?.title?.[locale] || article.category?.title?.zh;
                  const imageUrl = article.coverImage ? urlForImage(article.coverImage) : null;
                  
                  return (
                    <article
                      key={article._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/${locale}/news/${article.slug.current}`}>
                        <div className="relative h-48 bg-gray-200">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                              <span className="text-blue-300 text-4xl">📰</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                              {categoryTitle}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="p-6">
                        <div className={`flex items-center gap-4 text-sm text-gray-500 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <span>{formatDate(article.publishedAt, locale)}</span>
                          {article.estimatedReadTime && (
                            <span>· {Math.ceil(article.estimatedReadTime)} {t('news.minRead')}</span>
                          )}
                        </div>
                        
                        <Link href={`/${locale}/news/${article.slug.current}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                            {title}
                          </h3>
                        </Link>
                        
                        {excerpt && (
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {excerpt}
                          </p>
                        )}
                        
                        <Link
                          href={`/${locale}/news/${article.slug.current}`}
                          className={`inline-flex items-center text-blue-600 font-medium hover:text-blue-700 ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                          {t('news.readMore')}
                          <svg className={`w-4 h-4 ${isRtl ? 'mr-1 rotate-180' : 'ml-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/${locale}/news${categorySlug ? `?category=${categorySlug}&` : '?'}`}
                    isRtl={isRtl}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
