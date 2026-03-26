/**
 * 图片 SEO 优化工具
 * 生成描述性的 alt 文本和图片结构化数据
 */

interface ProductImageData {
  name: { [key: string]: string };
  model: string;
  category?: { name: { [key: string]: string } };
  description?: { [key: string]: string };
}

/**
 * 生成 SEO 友好的图片 alt 文本
 */
export function generateImageAlt(
  product: ProductImageData,
  locale: string = 'en',
  context?: 'main' | 'thumbnail' | 'gallery'
): string {
  const name = product.name?.[locale] || product.name?.en || product.name?.zh || '';
  const category = product.category?.name?.[locale] || product.category?.name?.en || 'LED';
  const model = product.model || '';
  
  const contextSuffix = {
    main: '',
    thumbnail: ' - thumbnail',
    gallery: ' - product view',
  };
  
  // 构建描述性 alt 文本
  const parts = [name];
  if (model) parts.push(`(${model})`);
  parts.push(`- ${category} product`);
  
  return parts.join(' ') + (contextSuffix[context || 'main'] || '');
}

/**
 * 生成图片结构化数据 (ImageObject Schema)
 */
export function generateImageSchema(
  imageUrl: string,
  product: ProductImageData,
  locale: string = 'en',
  options?: {
    width?: number;
    height?: number;
    caption?: string;
  }
) {
  const name = product.name?.[locale] || product.name?.en || '';
  const description = product.description?.[locale] || product.description?.en || '';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: imageUrl,
    name: name,
    description: description || generateImageAlt(product, locale),
    ...(options?.width && { width: options.width }),
    ...(options?.height && { height: options.height }),
    ...(options?.caption && { caption: options.caption }),
    // 图片授权信息
    license: 'https://ledcoreco.com/terms#image-license',
    acquireLicensePage: 'https://ledcoreco.com/contact',
  };
}

/**
 * 生成产品图片集结构化数据
 */
export function generateImageGallerySchema(
  images: Array<{ url: string; alt?: string }>,
  product: ProductImageData,
  locale: string = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: product.name?.[locale] || product.name?.en,
    image: images.map((img, index) => ({
      '@type': 'ImageObject',
      contentUrl: img.url,
      name: img.alt || `${product.name?.[locale]} - view ${index + 1}`,
      position: index + 1,
    })),
  };
}

/**
 * 生成产品图片的 srcset 配置
 * 用于响应式图片优化
 */
export function generateSrcSet(baseUrl: string): string {
  const widths = [640, 750, 828, 1080, 1200, 1920];
  return widths
    .map(w => `${baseUrl}?w=${w}&q=75 ${w}w`)
    .join(', ');
}

/**
 * 验证 alt 文本质量
 * 返回优化建议
 */
export function validateAltText(alt: string): {
  isValid: boolean;
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 100;
  
  // 检查长度
  if (alt.length < 10) {
    suggestions.push('Alt text too short, should be at least 10 characters');
    score -= 20;
  }
  if (alt.length > 125) {
    suggestions.push('Alt text too long, should be less than 125 characters');
    score -= 10;
  }
  
  // 检查是否包含 "image" 或 "picture"
  if (/\b(image|picture|photo)\b/i.test(alt)) {
    suggestions.push('Avoid using "image", "picture", or "photo" in alt text');
    score -= 15;
  }
  
  // 检查是否只是文件名
  if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(alt)) {
    suggestions.push('Alt text should not be a filename');
    score -= 30;
  }
  
  // 检查关键词密度
  const words = alt.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (uniqueWords.size < words.length * 0.7) {
    suggestions.push('Avoid keyword stuffing in alt text');
    score -= 10;
  }
  
  return {
    isValid: score >= 70,
    score: Math.max(0, score),
    suggestions,
  };
}
