/**
 * Shopify 产品数据导入脚本
 * 从 plumbing-deals.com 抓取产品数据并导入到 Sanity
 */

// import { client } from '../lib/sanity/client';

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: {
    id: number;
    title: string;
    sku: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
    grams: number;
  }[];
  images: {
    id: number;
    src: string;
    width: number;
    height: number;
  }[];
  options: {
    name: string;
    values: string[];
  }[];
}

interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
}

// Shopify 店铺配置
const SHOPIFY_DOMAIN = 'plumbing-deals.com';
const API_LIMIT = 250; // Shopify API 最大返回数量

/**
 * 从 Shopify 获取产品列表
 */
async function fetchProductsFromCollection(collectionHandle: string, page: number = 1): Promise<ShopifyProduct[]> {
  const url = `https://${SHOPIFY_DOMAIN}/collections/${collectionHandle}/products.json?limit=${API_LIMIT}&page=${page}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json() as { products: ShopifyProduct[] };
    return data.products || [];
  } catch (error) {
    console.error(`Failed to fetch products from ${collectionHandle}:`, error);
    return [];
  }
}

/**
 * 获取所有分页产品
 */
async function fetchAllProductsFromCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
  const allProducts: ShopifyProduct[] = [];
  let page = 1;
  let hasMore = true;

  console.log(`📦 Fetching products from collection: ${collectionHandle}`);

  while (hasMore && page <= 10) { // 限制最多 10 页，防止无限循环
    const products = await fetchProductsFromCollection(collectionHandle, page);
    
    if (products.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...products);
      console.log(`  Page ${page}: ${products.length} products`);
      
      // 如果返回数量小于限制，说明是最后一页
      if (products.length < API_LIMIT) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  console.log(`✅ Total fetched: ${allProducts.length} products from ${collectionHandle}`);
  return allProducts;
}

/**
 * 转换 Shopify 产品为 Sanity 格式
 */
function convertToSanityProduct(shopifyProduct: ShopifyProduct, category: string) {
  const variant = shopifyProduct.variants[0]; // 使用第一个变体
  
  // 提取规格参数（从 body_html 中解析）
  const specifications = extractSpecifications(shopifyProduct.body_html);
  
  // 提取简短描述
  const shortDescription = extractShortDescription(shopifyProduct.body_html);
  
  return {
    _type: 'product',
    title: {
      en: shopifyProduct.title,
      zh: shopifyProduct.title, // 后续可以翻译
      id: shopifyProduct.title,
      th: shopifyProduct.title,
      vi: shopifyProduct.title,
      ar: shopifyProduct.title,
    },
    slug: {
      current: shopifyProduct.handle,
    },
    description: {
      en: shopifyProduct.body_html,
      zh: shortDescription,
      id: shortDescription,
      th: shortDescription,
      vi: shortDescription,
      ar: shortDescription,
    },
    shortDescription: {
      en: shortDescription,
      zh: shortDescription,
      id: shortDescription,
      th: shortDescription,
      vi: shortDescription,
      ar: shortDescription,
    },
    category: category,
    subCategory: shopifyProduct.product_type || category,
    brand: shopifyProduct.vendor || 'Unknown',
    sku: variant?.sku || '',
    price: parseFloat(variant?.price || '0'),
    compareAtPrice: variant?.compare_at_price ? parseFloat(variant.compare_at_price) : null,
    currency: 'USD',
    specifications: specifications,
    images: shopifyProduct.images.map((img, index) => ({
      _type: 'image',
      _key: `image_${index}`,
      asset: {
        _type: 'reference',
        _ref: `image-${shopifyProduct.id}-${img.id}`, // 占位，实际需要先上传图片
      },
      url: img.src, // 临时存储原始 URL
      alt: shopifyProduct.title,
    })),
    imageUrls: shopifyProduct.images.map(img => img.src), // 用于后续图片上传
    tags: shopifyProduct.tags || [],
    source: {
      platform: 'shopify',
      originalId: shopifyProduct.id.toString(),
      originalUrl: `https://${SHOPIFY_DOMAIN}/products/${shopifyProduct.handle}`,
    },
    status: 'active',
    stock: variant?.available ? 100 : 0,
    weight: variant?.grams || 0,
    publishedAt: new Date().toISOString(),
  };
}

/**
 * 从 HTML 中提取简短描述
 */
function extractShortDescription(html: string): string {
  // 移除 HTML 标签，提取前 200 个字符
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

/**
 * 从 HTML 中提取规格参数
 */
function extractSpecifications(html: string): Record<string, string> {
  const specs: Record<string, string> = {};
  
  // 匹配常见的规格格式
  const patterns = [
    /<strong>(Brand|品牌):?<\/strong>\s*([^<]+)/i,
    /<strong>(MPN|型号):?<\/strong>\s*([^<]+)/i,
    /<strong>(Material|材料):?<\/strong>\s*([^<]+)/i,
    /<strong>(Finish|表面处理):?<\/strong>\s*([^<]+)/i,
    /<strong>(Color|颜色):?<\/strong>\s*([^<]+)/i,
    /<strong>(Shape|形状):?<\/strong>\s*([^<]+)/i,
    /<strong>(Certifications|认证):?<\/strong>\s*([^<]+)/i,
    /<strong>(Warranty|保修):?<\/strong>\s*([^<]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      specs[key] = value;
    }
  }
  
  return specs;
}

/**
 * 保存产品数据到 JSON 文件（用于预览和验证）
 */
function saveProductsToFile(products: any[], filename: string) {
  const fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`💾 Saved ${products.length} products to ${filePath}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting Shopify Product Import...\n');

  // 定义要抓取的分类
  const collections = [
    { handle: 'bathroom-faucets', category: 'faucets', name: '浴室水龙头' },
    { handle: 'toilets', category: 'toilets', name: '马桶' },
    { handle: 'showers', category: 'showers', name: '淋浴系统' },
    { handle: 'bathtubs', category: 'bathtubs', name: '浴缸' },
    { handle: 'bathroom-sinks', category: 'sinks', name: '浴室水槽' },
    { handle: 'bathroom-accessories', category: 'accessories', name: '浴室配件' },
    { handle: 'kitchen-faucets', category: 'kitchen-faucets', name: '厨房水龙头' },
    { handle: 'kitchen-sinks', category: 'kitchen-sinks', name: '厨房水槽' },
  ];

  const allProducts: any[] = [];

  // 抓取每个分类的产品
  for (const collection of collections) {
    console.log(`\n📂 Processing category: ${collection.name}`);
    const products = await fetchAllProductsFromCollection(collection.handle);
    
    // 转换为 Sanity 格式
    const convertedProducts = products.map(p => convertToSanityProduct(p, collection.category));
    allProducts.push(...convertedProducts);
    
    // 每个分类保存一个文件
    saveProductsToFile(convertedProducts, `products-${collection.handle}.json`);
    
    // 延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 保存所有产品
  saveProductsToFile(allProducts, 'all-products.json');

  console.log(`\n✅ Total products fetched: ${allProducts.length}`);
  console.log('\n📋 Category breakdown:');
  
  const categoryCount: Record<string, number> = {};
  for (const product of allProducts) {
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
  }
  
  for (const [cat, count] of Object.entries(categoryCount)) {
    console.log(`  - ${cat}: ${count} products`);
  }

  console.log('\n💡 Next steps:');
  console.log('  1. Review the JSON files in /data directory');
  console.log('  2. Upload product images to Sanity');
  console.log('  3. Import products to Sanity using: npx sanity exec scripts/import-to-sanity.ts');
}

// 运行
main().catch(console.error);
