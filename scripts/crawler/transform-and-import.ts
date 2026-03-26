/**
 * 转换爬取的数据并导入 Sanity CMS
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// 产品数据类型
interface RawProduct {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  category: string;
  sellingPoints: string[];
  developmentTime?: string;
  applications: string[];
  imageUrl?: string;
  specifications: { key: string; value: string }[];
  features: string[];
}

interface RawCategory {
  id: string;
  name: { zh: string; en: string };
  parent: string | null;
}

interface CrawledData {
  categories: RawCategory[];
  products: RawProduct[];
}

// 生成产品型号
function generateModel(name: string, categoryId: string): string {
  const prefix = categoryId
    .split('-')
    .map((s) => s.charAt(0).toUpperCase())
    .join('');
  
  // 提取数字或生成随机数
  const match = name.match(/(\d+)/);
  const num = match ? match[1] : Math.floor(Math.random() * 9000 + 1000);
  
  return `GP-${prefix}${num}`;
}

// 生成英文翻译（简化版，实际应该调用翻译API）
function generateEnTranslation(zhText: string): string {
  // 这里应该调用翻译API，暂时返回空字符串作为标记
  return '';
}

// 转换产品数据为 Sanity 格式
function transformProduct(
  rawProduct: RawProduct,
  categoryRef: string
): {
  _type: 'product';
  _id: string;
  name: { zh: string; en: string; id: string; th: string; vi: string; ar: string };
  slug: { current: string };
  model: string;
  category: { _type: 'reference'; _ref: string };
  description: { zh: string; en: string; id: string; th: string; vi: string; ar: string };
  shortDescription: { zh: string; en: string; id: string; th: string; vi: string; ar: string };
  features: { zh: string[]; en: string[]; id: string[]; th: string[]; vi: string[]; ar: string[] };
  applications: { zh: string[]; en: string[]; id: string[]; th: string[]; vi: string[]; ar: string[] };
  targetMarkets: string[];
  status: string;
  orderRank: number;
  seo: {
    metaTitle: { zh: string; en: string };
    metaDescription: { zh: string; en: string };
    keywords: string[];
  };
} {
  const model = generateModel(rawProduct.name, rawProduct.categoryId);
  const slug = `${rawProduct.categoryId}-${rawProduct.id}`;
  
  // 构建描述
  const description = rawProduct.sellingPoints.join('\n');
  const shortDescription = rawProduct.sellingPoints[0] || '';
  
  return {
    _type: 'product',
    _id: `product-${rawProduct.id}`,
    name: {
      zh: rawProduct.name,
      en: generateEnTranslation(rawProduct.name),
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
    slug: { current: slug },
    model,
    category: { _type: 'reference', _ref: categoryRef },
    description: {
      zh: description,
      en: generateEnTranslation(description),
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
    shortDescription: {
      zh: shortDescription,
      en: generateEnTranslation(shortDescription),
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
    features: {
      zh: rawProduct.features.length > 0 ? rawProduct.features : rawProduct.sellingPoints,
      en: [],
      id: [],
      th: [],
      vi: [],
      ar: [],
    },
    applications: {
      zh: rawProduct.applications,
      en: [],
      id: [],
      th: [],
      vi: [],
      ar: [],
    },
    targetMarkets: ['global'],
    status: 'active',
    orderRank: parseInt(rawProduct.id) || 0,
    seo: {
      metaTitle: { zh: rawProduct.name, en: '' },
      metaDescription: { zh: shortDescription, en: '' },
      keywords: ['LED', model, rawProduct.name, rawProduct.categoryId],
    },
  };
}

// 转换分类数据
function transformCategory(rawCategory: RawCategory): {
  _type: 'category';
  _id: string;
  name: { zh: string; en: string; id: string; th: string; vi: string; ar: string };
  slug: { current: string };
  description?: { zh: string; en: string; id: string; th: string; vi: string; ar: string };
} {
  return {
    _type: 'category',
    _id: `category-${rawCategory.id}`,
    name: {
      zh: rawCategory.name.zh,
      en: rawCategory.name.en,
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
    slug: { current: rawCategory.id },
    description: {
      zh: '',
      en: '',
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
  };
}

// 导入到 Sanity
async function importToSanity(data: CrawledData): Promise<void> {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  console.log('🚀 开始导入到 Sanity CMS...\n');

  // 1. 导入分类
  console.log('📁 导入分类...');
  const categoryRefs: Record<string, string> = {};

  for (const rawCategory of data.categories) {
    const categoryDoc = transformCategory(rawCategory);

    try {
      const result = await client.createOrReplace(categoryDoc);
      categoryRefs[rawCategory.id] = result._id;
      console.log(`  ✅ ${rawCategory.name.zh}`);
    } catch (error) {
      console.error(`  ❌ ${rawCategory.name.zh}:`, error);
    }
  }

  // 2. 导入产品
  console.log('\n📦 导入产品...');
  let successCount = 0;
  let failCount = 0;

  for (const rawProduct of data.products) {
    const categoryRef = categoryRefs[rawProduct.categoryId];
    if (!categoryRef) {
      console.warn(`  ⚠️ 分类未找到: ${rawProduct.categoryId}`);
      continue;
    }

    const productDoc = transformProduct(rawProduct, categoryRef);

    try {
      await client.createOrReplace(productDoc);
      console.log(`  ✅ ${rawProduct.name}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${rawProduct.name}:`, error);
      failCount++;
    }

    // 延迟避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\n✅ 导入完成！成功: ${successCount}, 失败: ${failCount}`);
}

// 主函数
async function main() {
  const dataPath = path.join(__dirname, 'products-data.json');

  if (!fs.existsSync(dataPath)) {
    console.error('❌ 数据文件不存在，请先运行 fetch-products.ts');
    process.exit(1);
  }

  const rawData: CrawledData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📊 读取到 ${rawData.categories.length} 个分类, ${rawData.products.length} 个产品\n`);

  await importToSanity(rawData);
}

// 如果直接运行
if (require.main === module) {
  main().catch(console.error);
}

export { transformProduct, transformCategory };
