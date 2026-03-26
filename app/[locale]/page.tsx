import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  generateOrganizationSchema, 
  generateWebsiteSchema, 
  generateFAQSchema,
  generateLocalBusinessSchema
} from '@/lib/utils/structured-data';
import { getProductsBySlugList } from '@/lib/sanity/queries';
import { urlForImage } from '@/lib/sanity/client';
import { locales } from '@/lib/i18n/config';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import idMessages from '@/messages/id.json';
import thMessages from '@/messages/th.json';
import viMessages from '@/messages/vi.json';
import arMessages from '@/messages/ar.json';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

// SEO: 生成首页 metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = messagesMap[locale] || enMessages;
  
  const title = messages.metadata?.title || 'GOPRO LED - Professional LED Manufacturer';
  const description = messages.metadata?.description || 'Leading manufacturer of IR LEDs, Visible Light LEDs, and UV LEDs';
  
  // 为每种语言生成 alternate 链接
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}`;
  }
  
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
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

const messagesMap: Record<string, any> = {
  en: enMessages,
  zh: zhMessages,
  id: idMessages,
  th: thMessages,
  vi: viMessages,
  ar: arMessages,
};

// 辅助函数：通过路径获取嵌套属性
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

// 加载翻译文件
function getMessages(locale: string) {
  const messages = messagesMap[locale] || enMessages;
  return (key: string) => getNestedValue(messages, key);
}

// GEO优化：获取FAQ内容 - 扩展长尾关键词覆盖
function getFAQs(locale: string) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    en: [
      { question: 'What types of LEDs does GOPRO manufacture?', answer: 'GOPRO manufactures IR LEDs, Visible Light LEDs, and UV LEDs for various applications including consumer electronics, lighting, and industrial use.' },
      { question: 'Which markets does GOPRO serve?', answer: 'We primarily serve Southeast Asia (Malaysia, Indonesia, Thailand, Vietnam) and Middle East markets.' },
      { question: 'What is the minimum order quantity?', answer: 'We accept orders starting from 1,000 pieces, with competitive pricing for bulk orders over 10,000 pieces.' },
      // SEO长尾关键词扩展
      { question: 'What is the difference between IR LED and visible LED?', answer: 'IR LEDs emit infrared light (invisible to human eye) used for sensing and communication, while visible LEDs emit light in the visible spectrum for illumination and display purposes.' },
      { question: 'How to choose the right LED for my application?', answer: 'Consider factors like wavelength (for IR), color temperature (for visible), power requirements, viewing angle, and operating environment. Contact our sales team for technical guidance.' },
      { question: 'What certifications do GOPRO LED products have?', answer: 'Our products are certified with ISO 9001, ISO 14001, RoHS, and CE, ensuring quality and compliance with international standards.' },
      { question: 'Can you provide custom LED solutions?', answer: 'Yes, we offer OEM/ODM services with custom specifications including wavelength, power, package type, and special requirements for your specific application.' },
      { question: 'What is the typical lead time for LED orders?', answer: 'Standard products: 2-3 weeks. Custom products: 4-6 weeks depending on specifications. Rush orders available upon request.' },
    ],
    zh: [
      { question: '光莆生产哪些类型的LED？', answer: '光莆生产红外LED、可见光LED和紫外LED，应用于消费电子、照明和工业等领域。' },
      { question: '光莆服务哪些市场？', answer: '我们主要服务东南亚（马来西亚、印尼、泰国、越南）和中东市场。' },
      { question: '最小订单量是多少？', answer: '我们接受1000件起订，10000件以上批量订单可享受优惠价格。' },
      // SEO长尾关键词扩展
      { question: '红外LED和可见光LED有什么区别？', answer: '红外LED发射人眼不可见的红外光，用于传感和通信；可见光LED发射可见光谱的光，用于照明和显示。' },
      { question: '如何为我的应用选择合适的LED？', answer: '需要考虑波长（红外）、色温（可见光）、功率需求、视角和工作环境等因素。请联系我们的销售团队获取技术指导。' },
      { question: '光莆LED产品有哪些认证？', answer: '我们的产品通过ISO 9001、ISO 14001、RoHS和CE认证，确保质量符合国际标准。' },
      { question: '可以提供定制LED解决方案吗？', answer: '是的，我们提供OEM/ODM服务，可根据您的具体应用需求定制波长、功率、封装类型等特殊规格。' },
      { question: 'LED订单的典型交货期是多久？', answer: '标准产品2-3周，定制产品4-6周（视规格而定）。紧急订单可协商加急处理。' },
    ],
    id: [
      { question: 'LED apa saja yang diproduksi GOPRO?', answer: 'GOPRO memproduksi LED IR, LED Cahaya Terlihat, dan LED UV untuk berbagai aplikasi termasuk elektronik konsumen, pencahayaan, dan industri.' },
      { question: 'Pasar mana yang dilayani GOPRO?', answer: 'Kami terutama melayani pasar Asia Tenggara (Malaysia, Indonesia, Thailand, Vietnam) dan Timur Tengah.' },
      { question: 'Berapa jumlah pesanan minimum?', answer: 'Kami menerima pesanan mulai dari 1.000 pcs, dengan harga kompetitif untuk pesanan massal di atas 10.000 pcs.' },
      { question: 'Apakah bisa pesan LED custom?', answer: 'Ya, kami melayani OEM/ODM dengan spesifikasi kustom sesuai kebutuhan aplikasi Anda.' },
    ],
    th: [
      { question: 'GOPRO ผลิต LED ประเภทใดบ้าง?', answer: 'GOPRO ผลิต LED อินฟราเรด LED แสงที่มองเห็นได้ และ LED UV สำหรับแอพพลิเคชั่นต่างๆ' },
      { question: 'GOPRO ให้บริการตลาดใดบ้าง?', answer: 'เราให้บริการหลักในเอเชียตะวันออกเฉียงใต้และตะวันออกกลาง' },
      { question: 'จำนวนสั่งซื้อขั้นต่ำเท่าไหร่?', answer: 'เรารับออเดอร์ตั้งแต่ 1,000 ชิ้น ราคาพิเศษสำหรับออเดอร์เกิน 10,000 ชิ้น' },
    ],
    vi: [
      { question: 'GOPRO sản xuất loại LED nào?', answer: 'GOPRO sản xuất LED hồng ngoại, LED ánh sáng nhìn thấy và LED UV cho nhiều ứng dụng khác nhau.' },
      { question: 'GOPRO phục vụ thị trường nào?', answer: 'Chúng tôi chủ yếu phục vụ thị trường Đông Nam Á và Trung Đông.' },
      { question: 'Số lượng đặt hàng tối thiểu là bao nhiêu?', answer: 'Chúng tôi chấp nhận đơn hàng từ 1.000 chiếc, giá cả cạnh tranh cho đơn hàng số lượng lớn trên 10.000 chiếc.' },
    ],
    ar: [
      { question: 'ما أنواع LED التي تصنعها GOPRO؟', answer: 'تصنع GOPRO LED الأشعة تحت الحمراء وLED الضوء المرئي وLED UV لتطبيقات متنوعة.' },
      { question: 'ما الأسواق التي تخدمها GOPRO؟', answer: 'نحن نخدم بشكل أساسي أسواق جنوب شرق آسيا والشرق الأوسط.' },
      { question: 'ما هو الحد الأدنى لكمية الطلب؟', answer: 'نقبل الطلبات ابتداءً من 1000 قطعة، بأسعار تنافسية للطلبات الكبيرة.' },
    ],
  };
  return faqs[locale] || faqs.en;
}

// ISR 配置：每 1 小时重新验证
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getMessages(locale);
  
  // GEO优化：生成结构化数据
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema(locale);
  const faqSchema = generateFAQSchema(getFAQs(locale));
  const localBusinessSchema = generateLocalBusinessSchema();

  // 获取首页展示的4个代表产品图片
  const FEATURED_SLUGS = [
    'lidar-vcsel-emitter-sensor',
    'dust-visualization-module',
    'static-uv-sterilization-module-gp-xs17xx-series',
    'flexible-contact-sensing-module',
  ];
  
  // 尝试获取产品数据，失败则使用空数组
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await getProductsBySlugList(FEATURED_SLUGS);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
  }
  // 按 FEATURED_SLUGS 顺序排列，方便索引
  const productMap: Record<string, any> = {};
  for (const p of featuredProducts) {
    productMap[p.slug?.current] = p;
  }

  return (
    <>
      {/* GEO优化：结构化数据标记 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-2">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/products`}
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.years')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.patents')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.employees')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{t('trustBar.certifications')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t('products.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  key: 'opticalSensor',
                  categorySlug: 'optical-sensors',
                  productSlug: 'lidar-vcsel-emitter-sensor',
                  color: 'from-blue-50 to-blue-100',
                  iconColor: 'text-blue-600',
                },
                {
                  key: 'lightModule',
                  categorySlug: 'light-source',
                  productSlug: 'dust-visualization-module',
                  color: 'from-amber-50 to-amber-100',
                  iconColor: 'text-amber-600',
                },
                {
                  key: 'sterilizationModule',
                  categorySlug: 'sterilization',
                  productSlug: 'static-uv-sterilization-module-gp-xs17xx-series',
                  color: 'from-purple-50 to-purple-100',
                  iconColor: 'text-purple-600',
                },
                {
                  key: 'intelligentSensor',
                  categorySlug: 'smart-sensors',
                  productSlug: 'flexible-contact-sensing-module',
                  color: 'from-green-50 to-green-100',
                  iconColor: 'text-green-600',
                },
              ].map((item) => {
                const product = productMap[item.productSlug];
                const imgUrl = product?.mainImage ? urlForImage(product.mainImage) : '';
                return (
                  <div key={item.key} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                    <Link href={`/${locale}/products?category=${item.categorySlug}`} className="block">
                      <div className={`h-36 relative ${imgUrl ? '' : `bg-gradient-to-br ${item.color}`} flex items-center justify-center overflow-hidden`}>
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={product?.name?.[locale] || product?.name?.zh || item.key}
                            fill
                            // 性能优化：第一个产品图片优先加载（LCP），其余懒加载
                            priority={item.key === 'opticalSensor'}
                            loading={item.key === 'opticalSensor' ? 'eager' : 'lazy'}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <svg className={`w-14 h-14 ${item.iconColor} opacity-60 group-hover:opacity-80 transition`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                      </div>
                    </Link>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {t(`products.categories.${item.key}`)}
                      </h3>
                      <Link
                        href={`/${locale}/products?category=${item.categorySlug}`}
                        className="block w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition text-center text-sm font-medium"
                      >
                        {t('products.viewDetails')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
