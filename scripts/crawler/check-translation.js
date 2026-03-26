const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function check() {
  console.log('🔍 检查翻译结果...\n');
  
  // 检查分类翻译
  console.log('📁 分类翻译:');
  const categories = await client.fetch('*[_type == "category"] { name }');
  categories.forEach(cat => {
    console.log(`  ${cat.name.zh}:`);
    console.log(`    EN: ${cat.name.en || '❌'}`);
    console.log(`    ID: ${cat.name.id || '❌'}`);
    console.log(`    TH: ${cat.name.th || '❌'}`);
    console.log(`    VI: ${cat.name.vi || '❌'}`);
    console.log(`    AR: ${cat.name.ar || '❌'}`);
  });
  
  // 检查产品翻译
  console.log('\n📦 产品翻译 (前3个):');
  const products = await client.fetch('*[_type == "product"][0...3] { name, shortDescription }');
  products.forEach(prod => {
    console.log(`\n  ${prod.name.zh}:`);
    console.log(`    EN: ${prod.name.en ? '✅' : '❌'}`);
    console.log(`    ID: ${prod.name.id ? '✅' : '❌'}`);
    console.log(`    TH: ${prod.name.th ? '✅' : '❌'}`);
    console.log(`    VI: ${prod.name.vi ? '✅' : '❌'}`);
    console.log(`    AR: ${prod.name.ar ? '✅' : '❌'}`);
  });
  
  // 统计
  const stats = await client.fetch(`
    {
      "total": count(*[_type == "product"]),
      "withEn": count(*[_type == "product" && name.en != ""]),
      "withId": count(*[_type == "product" && name.id != ""]),
      "withTh": count(*[_type == "product" && name.th != ""]),
      "withVi": count(*[_type == "product" && name.vi != ""]),
      "withAr": count(*[_type == "product" && name.ar != ""])
    }
  `);
  
  console.log('\n📊 翻译统计:');
  console.log(`  总计产品: ${stats.total}`);
  console.log(`  有英文: ${stats.withEn}`);
  console.log(`  有印尼语: ${stats.withId}`);
  console.log(`  有泰语: ${stats.withTh}`);
  console.log(`  有越南语: ${stats.withVi}`);
  console.log(`  有阿拉伯语: ${stats.withAr}`);
}

check().catch(console.error);
