import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { getArticleBySlug, getRelatedArticles, getAllArticleSlugs } from '@/lib/sanity/articles';
import { urlForImage } from '@/lib/sanity/client';
import { locales } from '@/lib/i18n/config';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/utils/structured-data';
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

// ⚠️ 模板默认使用动态渲染，避免构建时需要 Sanity API Token
// 如需静态生成，取消注释下方代码并配置 SANITY_API_TOKEN
// export async function generateStaticParams() {
//   const slugs = await getAllArticleSlugs();
//   const params: { locale: string; slug: string }[] = [];
//   
//   for (const locale of locales) {
//     for (const article of slugs) {
//       params.push({
//         locale,
//         slug: article.slug.current,
//       });
//     }
//   }
//   
//   return params;
// }

// 使用动态渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  
  const title = article.seo?.metaTitle?.[locale] || article.title?.[locale] || article.title?.zh;
  const description = article.seo?.metaDescription?.[locale] || article.excerpt?.[locale] || article.excerpt?.zh;
  const imageUrl = article.coverImage ? urlForImage(article.coverImage) : null;
  
  return {
    title: `${title} | GOPRO LED`,
    description: description || '',
    keywords: article.seo?.keywords || article.tags,
    alternates: {
      canonical: `/${locale}/news/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/news/${slug}`])
      ),
    },
    openGraph: {
      title: title || '',
      description: description || '',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || '',
      description: description || '',
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const messages = getMessages(locale);
  
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
  
  const article = await getArticleBySlug(slug, locale);
  
  if (!article) {
    notFound();
  }
  
  const title = article.title?.[locale] || article.title?.zh || article.title?.en;
  const content = article.content?.[locale] || article.content?.zh || article.content?.en;
  const categoryTitle = article.category?.title?.[locale] || article.category?.title?.zh;
  const imageUrl = article.coverImage ? urlForImage(article.coverImage) : null;
  
  // 获取相关文章
  const relatedArticles = article.category?._id
    ? await getRelatedArticles(article._id, article.category._id, 3, locale)
    : [];
  
  // 生成结构化数据
  const articleSchema = generateArticleSchema(article, locale);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: messages.navigation.home, url: '/' },
      { name: (messages as any).navigation.news || 'News', url: '/news' },
      { name: title, url: `/news/${slug}` },
    ],
    locale
  );
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className={`min-h-screen bg-gray-50 ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Breadcrumb */}
        <nav className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ol className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
              <li>
                <Link href={`/${locale}`} className="text-gray-500 hover:text-blue-600">
                  {messages.navigation.home}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href={`/${locale}/news`} className="text-gray-500 hover:text-blue-600">
                  {(messages as any).navigation.news || 'News'}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{title}</li>
            </ol>
          </div>
        </nav>
        
        {/* Article Header */}
        <header className="bg-white pt-8 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Link
                href={`/${locale}/news?category=${article.category?.slug?.current}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
              >
                {categoryTitle}
              </Link>
              {article.tags?.map((tag: string) => (
                <span key={tag} className="text-sm text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>
            
            <div className={`flex items-center gap-6 text-gray-600 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {article.author?.avatar ? (
                  <Image
                    src={urlForImage(article.author.avatar)}
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {article.author?.name?.[0] || 'G'}
                  </div>
                )}
                <span className="font-medium">{article.author?.name || 'GOPRO LED'}</span>
              </div>
              
              <span>·</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt, locale)}
              </time>
              
              {article.estimatedReadTime && (
                <>
                  <span>·</span>
                  <span>{Math.ceil(article.estimatedReadTime)} {t('news.minRead')}</span>
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* Cover Image */}
        {imageUrl && (
          <div className="bg-white pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Article Content */}
        <article className="bg-white py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
              {content ? (
                <PortableText
                  value={content}
                  components={{
                    types: {
                      image: ({ value }: { value: any }) => {
                        const imgUrl = urlForImage(value);
                        return (
                          <figure className="my-8">
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={imgUrl}
                                alt={value.alt || ''}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {value.caption && (
                              <figcaption className="text-center text-gray-500 mt-2 text-sm">
                                {value.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">{t('news.noContent')}</p>
              )}
            </div>
            
            {/* Source */}
            {article.source?.url && (
              <div className="mt-12 pt-8 border-t">
                <p className="text-sm text-gray-500">
                  {t('news.source')}: 
                  <a 
                    href={article.source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {article.source.name || article.source.url}
                  </a>

                </p>
              </div>
            )}
          </div>
        </article>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('news.relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related: any) => {
                  const relatedTitle = related.title?.[locale] || related.title?.zh || related.title?.en;
                  const relatedImageUrl = related.coverImage ? urlForImage(related.coverImage) : null;
                  
                  return (
                    <Link
                      key={related._id}
                      href={`/${locale}/news/${related.slug.current}`}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-32 bg-gray-200">
                        {relatedImageUrl ? (
                          <Image
                            src={relatedImageUrl}
                            alt={relatedTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                            <span className="text-blue-300 text-2xl">📰</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">
                          {relatedTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(related.publishedAt, locale)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
