/**
 * 检查 Sanity 中的数据
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function check() {
  console.log('🔍 检查 Sanity 数据...\n');
  
  // 检查分类
  const categories = await client.fetch('*[_type == "category"] { _id, name }');
  console.log('📁 分类数量:', categories.length);
  categories.forEach(c => console.log('  -', c.name?.zh || c._id));
  
  // 检查产品
  const products = await client.fetch('*[_type == "product"] { _id, name, model, category-> { name { zh } } }');
  console.log('\n📦 产品数量:', products.length);
  
  // 按分类统计
  const byCategory = {};
  products.forEach(p => {
    const catName = p.category?.name?.zh || '未分类';
    if (!byCategory[catName]) byCategory[catName] = 0;
    byCategory[catName]++;
  });
  
  console.log('\n按分类统计:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log('  -', cat + ':', count, '个');
  });
  
  // 检查是否有图片
  const withImages = await client.fetch('*[_type == "product" && defined(mainImage)] { _id, name { zh } }');
  console.log('\n🖼️ 有图片的产品:', withImages.length);
  
  // 检查多语言字段
  const sample = await client.fetch('*[_type == "product"][0] { name, description }');
  console.log('\n📝 示例产品多语言字段:');
  console.log('  名称:', JSON.stringify(sample.name, null, 2));
  console.log('  描述:', sample.description?.zh?.substring(0, 50) + '...');
  
  // 检查有多少产品需要翻译
  const needTranslation = await client.fetch(`
    *[_type == "product" && (
      name.en == "" || 
      name.id == "" || 
      name.th == "" || 
      name.vi == "" || 
      name.ar == ""
    )] { _id, name { zh } }
  `);
  console.log('\n🌐 需要翻译的产品:', needTranslation.length);
  
  // 检查有多少产品有图片URL但未上传
  const withImageUrls = await client.fetch(`
    *[_type == "product" && !defined(mainImage)] { _id, name { zh } }
  `);
  console.log('📷 需要上传图片的产品:', withImageUrls.length);
}

check().catch(console.error);
