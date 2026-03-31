/**
 * 导入精选产品到 Sanity V2（修复分类引用）
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const client = createClient({
  projectId: 'p23es0ex',
  dataset: 'production',
  apiVersion: '2024-03-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 分类映射表（category slug -> Sanity document ID）
const categoryMap: Record<string, string> = {
  'faucets': 'bathroom-faucets',
  'toilets': 'toilets',
  'showers': 'showers',
  'bathtubs': 'bathtubs',
  'sinks': 'bathroom-sinks',
  'accessories': 'bathroom-accessories',
  'kitchen-faucets': 'kitchen-faucets',
  'kitchen-sinks': 'kitchen-sinks',
};

interface Product {
  title: Record<string, string>;
  slug: { current: string };
  description: Record<string, string>;
  shortDescription: Record<string, string>;
  category: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  specifications: Record<string, string>;
  imageUrls: string[];
  tags: string[];
  stock: number;
  publishedAt: string;
  brand?: string;
}

/**
 * 获取分类的 Sanity ID
 */
async function getCategoryId(categorySlug: string): Promise<string | null> {
  const mappedSlug = categoryMap[categorySlug] || categorySlug;
  
  try {
    const result = await client.fetch(
      `*[_type == "productCategory" && slug.current == $slug][0]._id`,
      { slug: mappedSlug }
    );
    return result || null;
  } catch (error) {
    console.error(`Failed to get category ID for ${categorySlug}:`, error);
    return null;
  }
}

/**
 * 上传图片到 Sanity
 */
async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `product-${Date.now()}.jpg`,
    });
    
    return asset._id;
  } catch (error) {
    console.warn(`Failed to upload image: ${imageUrl.substring(0, 80)}...`);
    return null;
  }
}

/**
 * 去除品牌名称
 */
function removeBrandFromText(text: string, brand: string): string {
  if (!text || !brand) return text;
  const brandRegex = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return text.replace(brandRegex, '').replace(/\s+/g, ' ').trim();
}

/**
 * 加载产品数据
 */
function loadProducts(filename: string): Product[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * 导入单个产品
 */
async function importProduct(product: Product, categoryId: string): Promise<boolean> {
  try {
    // 检查是否已存在（强制导入模式，先删除后创建）
    const existing = await client.fetch(
      `*[_type == "product" && sku == $sku][0]._id`,
      { sku: product.sku }
    );
    
    if (existing) {
      console.log(`  🗑️  Deleting existing: ${product.title.en.substring(0, 40)}...`);
      await client.delete(existing);
    }

    const brand = product.brand || '';
    
    // 清理品牌信息
    const cleanTitle: Record<string, string> = {};
    for (const [lang, title] of Object.entries(product.title)) {
      cleanTitle[lang] = removeBrandFromText(title, brand);
    }

    // 上传图片
    console.log(`  📸 Uploading images...`);
    const images: any[] = [];
    for (let i = 0; i < product.imageUrls.slice(0, 5).length; i++) {
      const imageUrl = product.imageUrls[i];
      const assetId = await uploadImageToSanity(imageUrl);
      if (assetId) {
        images.push({
          _key: `image-${i}`,
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        });
      }
    }

    // 创建产品文档（字段名与前端查询匹配）
    const doc = {
      _type: 'product',
      name: cleanTitle,  // 前端使用 name 而不是 title
      slug: product.slug,
      model: product.sku,  // 前端使用 model 显示型号
      description: product.description,
      shortDescription: product.shortDescription,
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      specifications: product.specifications,
      mainImage: images.length > 0 ? images[0] : null,  // 前端使用 mainImage
      gallery: images,  // 前端使用 gallery 作为图集
      images,  // 保留原始 images 字段
      stock: product.stock,
      status: 'active',
      publishedAt: product.publishedAt,
      // 前端需要的其他字段（多语言对象格式）
      features: { zh: [], en: [], id: [], th: [], vi: [], ar: [] },
      applications: { zh: [], en: [], id: [], th: [], vi: [], ar: [] },
      targetMarkets: [],
    };

    const result = await client.create(doc);
    console.log(`  ✅ Created: ${result._id}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed:`, error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Importing products to Sanity...\n');

  // 测试模式：只导入第一个分类
  const categories = [
    { file: 'top50-bathroom-faucets.json', slug: 'faucets', name: '浴室水龙头' },
    // { file: 'top50-toilets.json', slug: 'toilets', name: '马桶' },
    // { file: 'top50-showers.json', slug: 'showers', name: '淋浴系统' },
    // { file: 'top50-bathtubs.json', slug: 'bathtubs', name: '浴缸' },
    // { file: 'top50-bathroom-sinks.json', slug: 'sinks', name: '浴室水槽' },
    // { file: 'top50-bathroom-accessories.json', slug: 'accessories', name: '浴室配件' },
    // { file: 'top50-kitchen-faucets.json', slug: 'kitchen-faucets', name: '厨房水龙头' },
    // { file: 'top50-kitchen-sinks.json', slug: 'kitchen-sinks', name: '厨房水槽' },
  ];

  let totalImported = 0;
  let totalFailed = 0;

  for (const cat of categories) {
    console.log(`\n📂 ${cat.name}`);
    
    // 获取分类 ID
    const categoryId = await getCategoryId(cat.slug);
    if (!categoryId) {
      console.log(`  ⚠️ Category not found: ${cat.slug}`);
      continue;
    }
    console.log(`  📁 Category ID: ${categoryId}`);

    // 加载产品
    const products = loadProducts(cat.file);
    console.log(`  📦 Products: ${products.length}`);

    let imported = 0;
    let failed = 0;

    // 测试模式：只导入前2个产品
    const testProducts = products.slice(0, 2);
    console.log(`  🧪 Test mode: importing ${testProducts.length} products only`);
    
    for (let i = 0; i < testProducts.length; i++) {
      const product = testProducts[i];
      console.log(`\n  [${i + 1}/${testProducts.length}] ${product.title.en.substring(0, 50)}...`);
      
      const success = await importProduct(product, categoryId);
      if (success) imported++;
      else failed++;

      // 延迟避免请求过快
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n  📊 Imported: ${imported}, Failed: ${failed}`);
    totalImported += imported;
    totalFailed += failed;

    // 分类间延迟
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n\n📋 ====== Summary ======`);
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log('======================\n');
}

main().catch(console.error);
