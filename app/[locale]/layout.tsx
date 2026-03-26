import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { locales, type Locale, rtlLocales, defaultLocale } from '@/lib/i18n/config';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成hreflang标签用于SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // 为每种语言生成alternate链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}`;
  }
  
  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternateLanguages,
    },
  };
}

// 加载翻译消息
async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const isRTL = rtlLocales.includes(locale as Locale);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${isRTL ? 'rtl' : 'ltr'} flex flex-col min-h-screen`}>
        {/* GA4 数据分析（afterInteractive，不阻塞渲染） */}
        <GoogleAnalytics />
        <Navbar locale={locale as Locale} messages={{ navigation: messages.navigation, common: messages.common }} />
        <div className="flex-1">
          {children}
        </div>
        <Footer locale={locale as Locale} messages={{ navigation: messages.navigation, footer: messages.footer, common: messages.common }} />
      </body>
    </html>
  );
}
