import { Metadata } from 'next';
import { Locale, locales } from '@/lib/i18n/config';

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  const title = `${messages.about?.title || 'About Us'} | GOPRO LED`;
  const description = messages.metadata?.description;
  
  // 为每种语言生成 alternate 链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}/about`;
  }
  
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/about`,
      siteName: locale === 'zh' ? '光莆LED' : 'GOPRO LED',
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isRTL = locale === 'ar';
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const historyChapters = [
    { period: t('about.history.chapter1.period'), title: t('about.history.chapter1.title'), desc: t('about.history.chapter1.desc') },
    { period: t('about.history.chapter2.period'), title: t('about.history.chapter2.title'), desc: t('about.history.chapter2.desc') },
    { period: t('about.history.chapter3.period'), title: t('about.history.chapter3.title'), desc: t('about.history.chapter3.desc') },
    { period: t('about.history.chapter4.period'), title: t('about.history.chapter4.title'), desc: t('about.history.chapter4.desc') },
  ];

  const techStats = [
    { value: '300+', label: t('about.technology.rdTeam') },
    { value: '20%+', label: t('about.technology.rdRatio') },
    { value: '500+', label: t('about.technology.patents') },
    { value: '1800+', label: t('about.technology.certifications') },
  ];

  const globalStats = [
    { value: '50+', label: t('about.global.coverage') },
    { value: '25', label: t('about.global.branches') },
    { value: '8', label: t('about.global.rdBases') },
  ];

  const honors = [
    t('about.honors.national'),
    t('about.honors.highTech'),
    t('about.honors.specialized'),
    t('about.honors.top10'),
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-6">{t('about.subtitle')}</p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-8 py-4 mt-4">
            <p className="text-2xl md:text-3xl font-light tracking-wider">{t('about.hero.vision')}</p>
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-8 text-blue-100">
            <div>
              <p className="text-sm opacity-80">{locale === 'zh' ? '使命' : 'Mission'}</p>
              <p className="text-lg">{t('about.hero.mission')}</p>
            </div>
            <div className="hidden md:block w-px bg-blue-400/30"></div>
            <div>
              <p className="text-sm opacity-80">{locale === 'zh' ? '价值观' : 'Values'}</p>
              <p className="text-lg">{t('about.hero.values')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.history.title')}</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
            
            <div className="space-y-8">
              {historyChapters.map((chapter, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="w-full md:w-1/2 px-4">
                    <div className={`bg-white rounded-lg shadow-md p-6 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="inline-block bg-blue-900 text-white text-sm font-semibold px-3 py-1 rounded mb-2">
                        {chapter.period}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{chapter.title}</h3>
                      <p className="text-gray-600">{chapter.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-8 h-8 bg-blue-900 rounded-full items-center justify-center z-10 mx-4">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-full md:w-1/2 px-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.business.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                {locale === 'zh' ? '核心产品' : 'Core Products'}
              </h3>
              <p className="text-gray-700 text-lg">{t('about.business.products')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-green-900 mb-4">{t('about.business.fields')}</h3>
              <p className="text-gray-700">{t('about.business.fieldsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.technology.title')}</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {techStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Core Tech */}
          <div className="bg-blue-900 rounded-lg p-8 text-white">
            <h3 className="text-xl font-semibold mb-4 text-center">{t('about.technology.coreTech')}</h3>
            <p className="text-center text-blue-100 text-lg">{t('about.technology.techList')}</p>
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.global.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {globalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-blue-900">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-800">{t('about.global.production')}</p>
          </div>
        </div>
      </section>

      {/* Honors Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.honors.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {honors.map((honor, index) => (
              <div key={index} className="flex items-center bg-white rounded-lg shadow-sm p-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-gray-800 font-medium">{honor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('about.culture.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">{locale === 'zh' ? '品牌理念' : 'Brand'}</h3>
              <p className="text-gray-700">{t('about.culture.brand')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-green-900 mb-2">{locale === 'zh' ? '经营理念' : 'Management'}</h3>
              <p className="text-gray-700 text-sm">{t('about.culture.management')}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-purple-900 mb-2">{locale === 'zh' ? '团队理念' : 'Team'}</h3>
              <p className="text-gray-700">{t('about.culture.team')}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-orange-900 mb-2">{t('about.culture.esg')}</h3>
              <p className="text-gray-700 text-sm">{t('about.culture.esgDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
