/**
 * 批量导入产品到 Sanity
 * 按指定数量导入各分类产品
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// Sanity 配置
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p23es0ex',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 导入配置
const importConfig = [
  { category: 'bathroom-faucets', file: 'products-bathroom-faucets.json', count: 200, name: '浴室水龙头' },
  { category: 'toilets', file: 'products-toilets.json', count: 10, name: '马桶' },
  { category: 'showers', file: 'products-showers.json', count: 200, name: '淋浴系统' },
  { category: 'bathtubs', file: 'products-bathtubs.json', count: 10, name: '浴缸' },
  { category: 'bathroom-sinks', file: 'products-bathroom-sinks.json', count: 30, name: '浴室水槽' },
  { category: 'bathroom-accessories', file: 'products-bathroom-accessories.json', count: 50, name: '浴室配件' },
  { category: 'kitchen-faucets', file: 'products-kitchen-faucets.json', count: 200, name: '厨房水龙头' },
  { category: 'kitchen-sinks', file: 'products-kitchen-sinks.json', count: 50, name: '厨房水槽' },
];

interface SourceProduct {
  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  handle?: string;
  slug?: { current?: string };
  productType?: string;
  tags?: string[];
  variants?: any[];
  images?: any[];
  options?: any[];
  vendor?: string;
  price?: string;
  compareAtPrice?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  [key: string]: any;
}

/**
 * 从文件加载产品
 */
function loadProducts(filename: string): SourceProduct[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 生成 slug
 */
function generateSlug(title: any, handle?: string): string {
  if (handle) return handle;
  const safeTitle = String(title || '');
  return safeTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

/**
 * 清理 HTML 标签
 */
function cleanHtml(html: any): string {
  if (!html) return '';
  const safeHtml = String(html);
  return safeHtml
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 获取字符串值（处理多语言对象或字符串）
 */
function getStringValue(value: any, locale: string = 'en'): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[locale] || value['en'] || Object.values(value)[0] || '';
  }
  return String(value || '');
}

/**
 * 翻译文本（简单模拟，实际应该调用翻译 API）
 */
function translateText(text: any): Record<string, string> {
  const safeText = getStringValue(text, 'en');
  // 这里简化处理，实际应该调用翻译服务
  return {
    zh: safeText,
    en: safeText,
    id: safeText,
    th: safeText,
    vi: safeText,
    ar: safeText,
  };
}

/**
 * 获取分类 ID
 */
async function getCategoryId(slug: string): Promise<string | null> {
  try {
    const result = await client.fetch(
      `*[_type == "productCategory" && slug.current == $slug][0]._id`,
      { slug }
    );
    return result || null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}

/**
 * 检查产品是否已存在
 */
async function productExists(slug: string): Promise<boolean> {
  try {
    const result = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]._id`,
      { slug }
    );
    return !!result;
  } catch (error) {
    console.error(`Error checking product ${slug}:`, error);
    return false;
  }
}

/**
 * 处理图片上传
 */
async function uploadImage(imageUrl: string, productTitle: any): Promise<any | null> {
  if (!imageUrl) return null;
  
  try {
    // 检查是否是远程 URL
    if (imageUrl.startsWith('http')) {
      // 对于远程图片，直接返回引用
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageUrl, // 这里简化处理，实际应该下载并上传到 Sanity
        },
      };
    }
    return null;
  } catch (error) {
    console.error(`Error processing image for ${getStringValue(productTitle)}:`, error);
    return null;
  }
}

/**
 * 转换产品数据
 */
async function transformProduct(
  source: SourceProduct,
  categoryId: string,
  categorySlug: string
): Promise<any> {
  const slug = generateSlug(source.title, source.handle);
  
  // 处理图片
  const safeTitle = getStringValue(source.title);
  const mainImage = source.images && source.images.length > 0 
    ? await uploadImage(source.images[0].src, safeTitle)
    : null;
  
  const gallery = source.images && source.images.length > 1
    ? await Promise.all(source.images.slice(1, 6).map(img => uploadImage(img.src, safeTitle)))
    : [];
  
  // 提取规格
  const specifications: Record<string, string> = {};
  if (source.options) {
    source.options.forEach((opt: any) => {
      if (opt.name && opt.values && opt.values.length > 0) {
        specifications[opt.name] = opt.values.join(', ');
      }
    });
  }
  
  // 提取特性
  const features: string[] = [];
  if (source.tags) {
    features.push(...source.tags.slice(0, 5));
  }
  
  // 提取应用场景
  const applications: string[] = [];
  if (source.productType) {
    applications.push(source.productType);
  }
  
  return {
    _type: 'product',
    name: translateText(source.title),
    slug: { current: slug },
    model: source.sku || source.barcode || slug.substring(0, 20),
    description: translateText(cleanHtml(source.description || '')),
    shortDescription: translateText(cleanHtml(source.description || '').substring(0, 200)),
    category: {
      _type: 'reference',
      _ref: categoryId,
    },
    mainImage,
    gallery: gallery.filter(Boolean),
    specifications,
    features: { zh: features, en: features, id: features, th: features, vi: features, ar: features },
    applications: { zh: applications, en: applications, id: applications, th: applications, vi: applications, ar: applications },
    targetMarkets: ['global'],
    status: 'active',
    seo: {
      metaTitle: translateText(source.title),
      metaDescription: translateText(cleanHtml(source.description || '').substring(0, 160)),
    },
  };
}

/**
 * 导入单个分类的产品
 */
async function importCategory(config: typeof importConfig[0]): Promise<void> {
  console.log(`\n📦 开始导入: ${config.name} (目标: ${config.count}个)`);
  
  // 获取分类 ID
  const categoryId = await getCategoryId(config.category);
  if (!categoryId) {
    console.error(`❌ 分类不存在: ${config.category}`);
    return;
  }
  console.log(`✅ 找到分类 ID: ${categoryId}`);
  
  // 加载产品数据
  let products: SourceProduct[];
  try {
    products = loadProducts(config.file);
    console.log(`📊 数据文件共有 ${products.length} 个产品`);
  } catch (error) {
    console.error(`❌ 无法加载文件 ${config.file}:`, error);
    return;
  }
  
  // 截取指定数量
  const selectedProducts = products.slice(0, config.count);
  console.log(`🎯 将导入前 ${selectedProducts.length} 个产品`);
  
  // 导入产品
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < selectedProducts.length; i++) {
    const source = selectedProducts[i];
    const slug = generateSlug(source.title, source.handle || source.slug?.current);
    const displayTitle = getStringValue(source.title);
    
    console.log(`\n[${i + 1}/${selectedProducts.length}] ${displayTitle}`);
    
    // 检查是否已存在
    const exists = await productExists(slug);
    if (exists) {
      console.log(`  ⏭️  已存在，跳过`);
      skipCount++;
      continue;
    }
    
    try {
      // 转换数据
      const product = await transformProduct(source, categoryId, config.category);
      
      // 创建产品
      const result = await client.create(product);
      console.log(`  ✅ 导入成功: ${result._id}`);
      successCount++;
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  ❌ 导入失败:`, error);
      errorCount++;
    }
  }
  
  console.log(`\n📊 ${config.name} 导入完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ⏭️  跳过: ${skipCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始批量导入产品...\n');
  console.log('导入计划:');
  importConfig.forEach(config => {
    console.log(`  - ${config.name}: ${config.count}个`);
  });
  
  for (const config of importConfig) {
    await importCategory(config);
  }
  
  console.log('\n🎉 所有分类导入完成!');
}

main().catch(console.error);
