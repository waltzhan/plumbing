/**
 * 导入精选产品到 Sanity（去除品牌信息）
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

interface Product {
  _type: string;
  title: Record<string, string>;
  slug: { current: string };
  description: Record<string, string>;
  shortDescription: Record<string, string>;
  category: string;
  subCategory: string;
  brand: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  specifications: Record<string, string>;
  images: any[];
  imageUrls: string[];
  tags: string[];
  source: {
    platform: string;
    originalId: string;
    originalUrl: string;
  };
  status: string;
  stock: number;
  weight: number;
  publishedAt: string;
}

/**
 * 从文件加载产品
 */
function loadProducts(filename: string): Product[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}`);
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * 上传图片到 Sanity
 */
async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`  ⚠️ Failed to download image: ${imageUrl.substring(0, 80)}...`);
      return null;
    }
    
    const buffer = await response.arrayBuffer();
    
    // 上传到 Sanity
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `product-${Date.now()}.jpg`,
    });
    
    return asset._id;
  } catch (error) {
    console.warn(`  ⚠️ Failed to upload image:`, error);
    return null;
  }
}

/**
 * 去除品牌名称的函数
 */
function removeBrandFromText(text: string, brand: string): string {
  if (!text || !brand) return text;
  
  // 创建品牌匹配的正则（不区分大小写）
  const brandRegex = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  
  // 去除品牌名
  let cleaned = text.replace(brandRegex, '').trim();
  
  // 清理多余的空格和标点
  cleaned = cleaned.replace(/\s+/g, ' ').replace(/,\s*,/g, ',').replace(/^\s*[,:-]\s*/, '').trim();
  
  return cleaned;
}

/**
 * 准备产品数据（去除品牌信息）
 */
async function prepareProduct(product: Product): Promise<any> {
  const brand = product.brand || '';
  
  // 去除标题中的品牌
  const cleanTitle: Record<string, string> = {};
  for (const [lang, title] of Object.entries(product.title)) {
    cleanTitle[lang] = removeBrandFromText(title, brand);
  }
  
  // 去除描述中的品牌
  const cleanDescription: Record<string, string> = {};
  for (const [lang, desc] of Object.entries(product.description)) {
    // 对于 HTML 描述，只处理简短描述版本
    if (lang === 'en') {
      cleanDescription[lang] = desc; // 保留原始 HTML
    } else {
      cleanDescription[lang] = removeBrandFromText(desc, brand);
    }
  }
  
  // 去除简短描述中的品牌
  const cleanShortDesc: Record<string, string> = {};
  for (const [lang, desc] of Object.entries(product.shortDescription)) {
    cleanShortDesc[lang] = removeBrandFromText(desc, brand);
  }
  
  // 去除规格中的品牌
  const cleanSpecs: Record<string, string> = {};
  for (const [key, value] of Object.entries(product.specifications)) {
    const cleanKey = removeBrandFromText(key, brand);
    const cleanValue = removeBrandFromText(value, brand);
    cleanSpecs[cleanKey] = cleanValue;
  }
  
  // 上传图片到 Sanity
  console.log(`  📸 Uploading ${Math.min(product.imageUrls.length, 5)} images...`);
  const imageAssets: any[] = [];
  
  for (let i = 0; i < Math.min(product.imageUrls.length, 5); i++) {
    const imageUrl = product.imageUrls[i];
    const assetId = await uploadImageToSanity(imageUrl);
    if (assetId) {
      imageAssets.push({
        _type: 'image',
        _key: `image_${i}`,
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      });
    }
  }
  
  if (imageAssets.length === 0) {
    console.warn(`  ⚠️ No images uploaded for product`);
  }
  
  // 返回清理后的产品数据
  return {
    _type: 'product',
    title: cleanTitle,
    slug: product.slug,
    description: cleanDescription,
    shortDescription: cleanShortDesc,
    category: product.category,
    subCategory: product.subCategory,
    // 不导入 brand 字段
    sku: product.sku,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency,
    specifications: cleanSpecs,
    images: imageAssets,
    tags: product.tags.filter(tag => 
      !brand.toLowerCase().includes(tag.toLowerCase()) &&
      tag.toLowerCase() !== brand.toLowerCase()
    ),
    status: 'active',
    stock: product.stock,
    weight: product.weight,
    publishedAt: product.publishedAt,
  };
}

/**
 * 导入产品到 Sanity
 */
async function importProduct(productData: any): Promise<boolean> {
  try {
    // 检查是否已存在（基于 SKU）
    const existing = await client.fetch(
      `*[_type == "product" && sku == $sku][0]._id`,
      { sku: productData.sku }
    );
    
    if (existing) {
      console.log(`  ⏭️  Product already exists (SKU: ${productData.sku})`);
      return false;
    }
    
    // 创建产品
    const result = await client.create(productData);
    console.log(`  ✅ Created: ${result._id}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to create product:`, error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting import to Sanity (brand-free)...\n');
  
  // 检查 Sanity token
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN not found in environment variables');
    console.log('💡 Please set SANITY_API_TOKEN and try again');
    return;
  }
  
  const categories = [
    { file: 'top50-bathroom-faucets.json', name: '浴室水龙头' },
    { file: 'top50-toilets.json', name: '马桶' },
    { file: 'top50-showers.json', name: '淋浴系统' },
    { file: 'top50-bathtubs.json', name: '浴缸' },
    { file: 'top50-bathroom-sinks.json', name: '浴室水槽' },
    { file: 'top50-bathroom-accessories.json', name: '浴室配件' },
    { file: 'top50-kitchen-faucets.json', name: '厨房水龙头' },
    { file: 'top50-kitchen-sinks.json', name: '厨房水槽' },
  ];
  
  let totalImported = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  
  for (const cat of categories) {
    console.log(`\n📂 Importing: ${cat.name}`);
    const products = loadProducts(cat.file);
    
    if (products.length === 0) {
      console.log(`  ⚠️ No products found`);
      continue;
    }
    
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n  [${i + 1}/${products.length}] ${product.title.en.substring(0, 50)}...`);
      console.log(`     Brand: ${product.brand} (will be removed)`);
      
      try {
        // 准备产品数据（去除品牌）
        const productData = await prepareProduct(product);
        
        // 导入到 Sanity
        const success = await importProduct(productData);
        
        if (success) {
          imported++;
        } else {
          skipped++;
        }
        
        // 延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`     ❌ Error:`, error);
        failed++;
      }
    }
    
    console.log(`\n  📊 ${cat.name} Summary:`);
    console.log(`     Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
    
    totalImported += imported;
    totalSkipped += skipped;
    totalFailed += failed;
    
    // 分类之间延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 总汇总
  console.log('\n\n📋 ====== Import Summary ======');
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Skipped: ${totalSkipped}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log('==============================\n');
  
  if (totalFailed > 0) {
    console.log('⚠️ Some products failed to import. Check logs above.');
  }
}

main().catch(console.error);
