/**
 * 将抓取的产品数据导入 Sanity CMS
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// 读取环境变量
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// 生成产品型号
function generateModel(name, categoryId) {
  const prefix = categoryId
    .split('-')
    .map((s) => s.charAt(0).toUpperCase())
    .join('');
  
  // 提取数字或生成随机数
  const match = name.match(/(\d+)/);
  const num = match ? match[1] : Math.floor(Math.random() * 9000 + 1000);
  
  return `GP-${prefix}${num}`;
}

// 生成 slug
function generateSlug(name, id) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + `-${id}`;
}

// 转换产品数据为 Sanity 格式
function transformProduct(rawProduct, categoryRef) {
  const model = generateModel(rawProduct.name, rawProduct.categoryId);
  const slug = generateSlug(rawProduct.name, rawProduct.id);
  
  // 构建描述
  const description = rawProduct.sellingPoints.join('\n\n') || rawProduct.name;
  const shortDescription = rawProduct.sellingPoints[0] || rawProduct.name;
  
  return {
    _type: 'product',
    _id: `product-${rawProduct.id}`,
    name: {
      zh: rawProduct.name,
      en: '',
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
      en: '',
      id: '',
      th: '',
      vi: '',
      ar: '',
    },
    shortDescription: {
      zh: shortDescription,
      en: '',
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
      metaTitle: { zh: rawProduct.name, en: '', id: '', th: '', vi: '', ar: '' },
      metaDescription: { zh: shortDescription, en: '', id: '', th: '', vi: '', ar: '' },
      keywords: ['LED', model, rawProduct.name, rawProduct.categoryId],
    },
  };
}

// 转换分类数据
function transformCategory(rawCategory) {
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
async function importToSanity(data) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;
  
  if (!token) {
    console.error('❌ 错误: 未找到 SANITY_API_TOKEN 环境变量');
    console.log('请确保 .env.local 文件存在并包含 SANITY_API_TOKEN');
    process.exit(1);
  }
  
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  console.log('🚀 开始导入到 Sanity CMS...\n');
  console.log(`项目: ${projectId}, 数据集: ${dataset}\n`);

  // 1. 导入分类
  console.log('📁 导入分类...');
  const categoryRefs = {};

  for (const rawCategory of data.categories) {
    const categoryDoc = transformCategory(rawCategory);

    try {
      const result = await client.createOrReplace(categoryDoc);
      categoryRefs[rawCategory.id] = result._id;
      console.log(`  ✅ ${rawCategory.name.zh} (${result._id})`);
    } catch (error) {
      console.error(`  ❌ ${rawCategory.name.zh}:`, error.message);
    }
  }

  console.log(`\n✅ 分类导入完成: ${Object.keys(categoryRefs).length} 个\n`);

  // 2. 导入产品
  console.log('📦 导入产品...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < data.products.length; i++) {
    const rawProduct = data.products[i];
    const categoryRef = categoryRefs[rawProduct.categoryId];
    
    if (!categoryRef) {
      console.warn(`  ⚠️ 分类未找到: ${rawProduct.categoryId} - ${rawProduct.name}`);
      continue;
    }

    const productDoc = transformProduct(rawProduct, categoryRef);

    try {
      await client.createOrReplace(productDoc);
      console.log(`  [${i + 1}/${data.products.length}] ✅ ${rawProduct.name}`);
      successCount++;
    } catch (error) {
      console.error(`  [${i + 1}/${data.products.length}] ❌ ${rawProduct.name}:`, error.message);
      failCount++;
    }

    // 延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n✅ 导入完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   总计: ${data.products.length}`);
}

// 主函数
async function main() {
  const dataPath = path.join(__dirname, 'products-data.json');

  if (!fs.existsSync(dataPath)) {
    console.error('❌ 错误: 数据文件不存在');
    console.log('请先运行: node fetch-products.js');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📊 读取到 ${rawData.categories.length} 个分类, ${rawData.products.length} 个产品\n`);

  await importToSanity(rawData);
}

// 运行
main().catch((error) => {
  console.error('导入出错:', error);
  process.exit(1);
});
