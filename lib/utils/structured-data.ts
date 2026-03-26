// GEO (Generative Engine Optimization) 结构化数据生成工具
// 针对AI搜索引擎优化的Schema.org标记

interface ProductData {
  model: string;
  name: { [key: string]: string };
  description?: { [key: string]: string };
  specifications?: { [key: string]: any };
  category?: { name: { [key: string]: string } };
  features?: { [key: string]: string[] };
  applications?: { [key: string]: string[] };
}

interface LocaleMessages {
  metadata: {
    title: string;
    description: string;
  };
}

/**
 * 生成产品Schema - 针对AI搜索优化
 * 包含详细的产品规格、应用场景、技术参数
 */
export function generateProductSchema(product: ProductData, locale: string = 'en') {
  const productName = product.name[locale] || product.name.en;
  const description = product.description?.[locale] || product.description?.en || '';
  const features = product.features?.[locale] || product.features?.en || [];
  const applications = product.applications?.[locale] || product.applications?.en || [];
  const category = product.category?.name[locale] || product.category?.name.en || 'LED';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    model: product.model,
    sku: product.model,
    description: description,
    brand: {
      '@type': 'Brand',
      name: 'GOPRO LED',
      url: 'https://goproled.com'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Xiamen Guangpu Electronics Co., Ltd.',
      foundingDate: '1994',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No.1 Guangpu Road, Jimei District',
        addressLocality: 'Xiamen',
        addressRegion: 'Fujian',
        addressCountry: 'CN'
      },
      url: 'https://goproled.com'
    },
    category: category,
    material: 'Semiconductor',
    productionDate: '1994',
    // AI搜索关键：详细的产品规格
    additionalProperty: [
      ...(features.map((feature: string) => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature
      }))),
      ...(applications.map((app: string) => ({
        '@type': 'PropertyValue',
        name: 'Application',
        value: app
      })))
    ],
    // B2B优化：供应信息
    offers: {
      '@type': 'Offer',
      '@id': `https://goproled.com/offer/${product.model}`,
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      eligibleRegion: [
        { '@type': 'Country', name: 'Malaysia' },
        { '@type': 'Country', name: 'Indonesia' },
        { '@type': 'Country', name: 'Thailand' },
        { '@type': 'Country', name: 'Vietnam' },
        { '@type': 'Country', name: 'UAE' },
        { '@type': 'Country', name: 'Saudi Arabia' }
      ],
      seller: {
        '@type': 'Organization',
        name: 'Xiamen Guangpu Electronics Co., Ltd.'
      }
    },
    // AI搜索优化：产品标识
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'MPN',
      value: product.model
    }
  };
}

/**
 * 生成组织Schema - 企业信息优化
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://goproled.com/#organization',
    name: 'Xiamen Guangpu Electronics Co., Ltd.',
    alternateName: ['GOPRO LED', '光莆电子', 'Guangpu Electronics'],
    url: 'https://goproled.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://goproled.com/logo.png',
      width: 200,
      height: 60
    },
    foundingDate: '1994',
    description: 'Professional LED manufacturer specializing in IR LEDs, Visible Light LEDs, and UV LEDs. Serving Southeast Asia and Middle East markets since 1994.',
    // 企业资质
    knowsAbout: [
      'LED Manufacturing',
      'Infrared LED Technology',
      'UV LED Solutions',
      'Visible Light LEDs',
      'SMD LED Components',
      'Electronic Components'
    ],
    // 认证信息
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ISO 9001' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ISO 14001' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'RoHS' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'CE' }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.1 Guangpu Road, Jimei District',
      addressLocality: 'Xiamen',
      addressRegion: 'Fujian',
      postalCode: '361021',
      addressCountry: 'CN'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+86-592-12345678',
        email: 'sales@goproled.com',
        availableLanguage: ['English', 'Chinese', 'Indonesian', 'Thai', 'Vietnamese', 'Arabic'],
        areaServed: ['Southeast Asia', 'Middle East'],
        hoursAvailable: 'Mo-Fr 09:00-18:00'
      }
    ],
    sameAs: [
      'https://www.linkedin.com/company/gopro-led',
      'https://twitter.com/goproled'
    ]
  };
}

/**
 * 生成网站Schema - 站点导航优化
 */
export function generateWebsiteSchema(locale: string = 'en') {
  const siteName = locale === 'zh' ? '光莆LED - 专业LED制造商' : 'GOPRO LED - Professional LED Manufacturer';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `https://goproled.com/${locale}/#website`,
    name: siteName,
    url: `https://goproled.com/${locale}`,
    description: 'Professional LED manufacturer serving Southeast Asia and Middle East markets',
    inLanguage: locale,
    // AI搜索优化：站点搜索
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://goproled.com/${locale}/products?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    // 多语言支持
    translationOfWork: ['en', 'zh', 'id', 'th', 'vi', 'ar'].map(l => ({
      '@type': 'WebSite',
      inLanguage: l,
      url: `https://goproled.com/${l}`
    }))
  };
}

/**
 * 生成面包屑Schema - 导航优化
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://goproled.com/${locale}${item.url}`
    }))
  };
}

/**
 * 生成FAQ Schema - AI问答优化
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * 生成产品系列Schema - 分类页面优化
 */
export function generateItemListSchema(products: ProductData[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductSchema(product, locale)
    }))
  };
}

/**
 * 生成本地业务Schema - 本地SEO优化
 * 针对Google Business Profile和地图搜索
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://ledcoreco.com/#localbusiness',
    name: 'Xiamen Guangpu Electronics Co., Ltd.',
    alternateName: ['GOPRO LED', '光莆电子'],
    description: 'Professional LED manufacturer specializing in IR LEDs, Visible Light LEDs, and UV LEDs since 1994.',
    url: 'https://ledcoreco.com',
    telephone: '+86-592-12345678',
    email: 'sales@ledcoreco.com',
    foundingDate: '1994',
    // 营业时间
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    // 地址信息
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.1800-1812 Min\'an Avenue, Xiang\'an Torch High-tech Zone',
      addressLocality: 'Xiamen',
      addressRegion: 'Fujian',
      postalCode: '361021',
      addressCountry: 'CN',
    },
    // 地理坐标（厦门翔安火炬高新区）
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.6180',
      longitude: '118.2390',
    },
    // 服务区域（目标市场）
    areaServed: [
      { '@type': 'Country', name: 'Malaysia' },
      { '@type': 'Country', name: 'Indonesia' },
      { '@type': 'Country', name: 'Thailand' },
      { '@type': 'Country', name: 'Vietnam' },
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Country', name: 'Philippines' },
      { '@type': 'Country', name: 'UAE' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    // 业务类别
    '@graph': [
      {
        '@type': 'Organization',
        name: 'GOPRO LED',
        sameAs: [
          'https://www.linkedin.com/company/gopro-led',
        ],
      },
    ],
    // 价格范围
    priceRange: '$$$',
    // 支付方式
    paymentAccepted: ['T/T', 'L/C', 'Western Union'],
    // 货币
    currenciesAccepted: 'USD, CNY',
  };
}

/**
 * 生成视频Schema - 视频SEO优化
 */
export function generateVideoSchema(
  name: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    publisher: {
      '@type': 'Organization',
      name: 'GOPRO LED',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ledcoreco.com/logo.png',
        width: 200,
        height: 60,
      },
    },
  };
}

/**
 * 生成文章Schema - 资讯页面SEO优化
 */
export function generateArticleSchema(article: any, locale: string = 'zh') {
  const title = article.title?.[locale] || article.title?.zh || article.title?.en;
  const description = article.excerpt?.[locale] || article.excerpt?.zh || article.excerpt?.en;
  const imageUrl = article.coverImage ? `https://ledcoreco.com${article.coverImage}` : 'https://ledcoreco.com/og-image.jpg';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.author?.name || 'GOPRO LED',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GOPRO LED',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ledcoreco.com/logo.png',
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ledcoreco.com/${locale}/news/${article.slug.current}`,
    },
    inLanguage: locale,
    keywords: article.tags?.join(', ') || '',
    articleSection: article.category?.title?.[locale] || article.category?.title?.zh,
  };
}
