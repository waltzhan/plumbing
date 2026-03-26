import { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';
import InquiryForm from '@/components/forms/InquiryForm';

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

// 静态产品列表（用于询盘表单多选）
const productOptions = [
  { id: 'ir-led', name: { en: 'IR LED', zh: '红外LED', id: 'LED IR', th: 'LED อินฟราเรด', vi: 'LED Hồng ngoại', ar: 'LED الأشعة تحت الحمراء' } },
  { id: 'visible-led', name: { en: 'Visible LED', zh: '可见光LED', id: 'LED Cahaya Terlihat', th: 'LED แสงที่มองเห็นได้', vi: 'LED Ánh sáng nhìn thấy', ar: 'LED الضوء المرئي' } },
  { id: 'uv-led', name: { en: 'UV LED', zh: '紫外LED', id: 'LED UV', th: 'LED UV', vi: 'LED UV', ar: 'LED UV' } },
  { id: 'other', name: { en: 'Other', zh: '其他', id: 'Lainnya', th: 'อื่นๆ', vi: 'Khác', ar: 'أخرى' } },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  const title = `${messages.navigation.contact} | bojet`;
  const description = messages.metadata?.description;
  
  // 为每种语言生成 alternate 链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}/contact`;
  }
  
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/contact`,
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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isRTL = locale === 'ar';

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // 地址根据语言切换
  const addressValue = locale === 'zh' 
    ? '厦门火炬高新区（翔安）产业区民安大道1800-1812号' 
    : 'No.1800-1812 Min\'an Avenue, Xiang\'an Torch High-tech Zone, Xiamen, China';
  const emailValue = 'sales@ledcoreco.com';

  // 从翻译文件获取标签文本
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // 表单标签
  const labels = {
    companyName: t('contact.companyName'),
    contactName: t('contact.contactName'),
    email: t('contact.email'),
    phone: t('contact.phone'),
    country: t('contact.country'),
    products: t('contact.products'),
    quantity: t('contact.quantity'),
    message: t('contact.message'),
    submit: t('contact.submit'),
    contactInfo: t('contact.contactInfo'),
    address: t('contact.address'),
    addressValue: addressValue,
    emailValue: emailValue,
  };

  // 表单消息
  const formMessages = {
    companyName: t('contact.companyName'),
    contactName: t('contact.contactName'),
    email: t('contact.email'),
    phone: t('contact.phone'),
    country: t('contact.country'),
    products: t('contact.products'),
    quantity: t('contact.quantity'),
    message: t('contact.message'),
    submit: t('contact.submit'),
    selectCountry: t('contact.selectCountry'),
    selectQuantity: t('contact.selectQuantity'),
    quantityOptions: {
      '1k-10k': t('contact.quantityOptions.1k-10k'),
      '10k-50k': t('contact.quantityOptions.10k-50k'),
      '50k-100k': t('contact.quantityOptions.50k-100k'),
      '100k+': t('contact.quantityOptions.100k+'),
    },
    placeholder: {
      email: t('contact.placeholder.email'),
      phone: t('contact.placeholder.phone'),
      message: t('contact.placeholder.message'),
    },
    submitStatus: {
      sending: t('contact.submitStatus.sending'),
      success: t('contact.submitStatus.success'),
      error: t('contact.submitStatus.error'),
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <InquiryForm
                locale={locale}
                messages={formMessages}
                productOptions={productOptions}
              />
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{labels.contactInfo}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.addressValue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.emailValue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('footer.quickLinks')}
              </h3>
              <nav className="space-y-2">
                <Link href={getLocalizedHref('/products')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.products}
                </Link>
                <Link href={getLocalizedHref('/about')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.about}
                </Link>
                <Link href={getLocalizedHref('/support')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.support}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
