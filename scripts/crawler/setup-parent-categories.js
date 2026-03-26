/**
 * 创建"光传感器"父分类，并将红外LED、可见光LED、紫外LED设为其子分类
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log('🌳 建立分类层级结构...\n');

  // 1. 创建"光传感器"父分类
  console.log('📁 创建父分类：光传感器');
  const parentCategory = await client.createOrReplace({
    _type: 'category',
    _id: 'category-optical-sensors',
    name: {
      zh: '光传感器',
      en: 'Optical Sensors',
      id: 'Sensor Optik',
      th: 'เซ็นเซอร์แสง',
      vi: 'Cảm biến Quang học',
      ar: 'المستشعرات الضوئية',
    },
    slug: { _type: 'slug', current: 'optical-sensors' },
    description: {
      zh: '包括红外LED、可见光LED、紫外LED等光学传感器元器件',
      en: 'Optical sensor components including IR LEDs, Visible LEDs, and UV LEDs',
    },
  });
  console.log('  ✅ 创建成功:', parentCategory._id);

  // 2. 查找三个子分类的 ID
  console.log('\n🔍 查找子分类...');
  const childCategories = await client.fetch(
    `*[_type == "category" && slug.current in ["ir-leds", "visible-leds", "uv-leds"]] { _id, "slug": slug.current, name }`
  );

  console.log('  找到子分类:', childCategories.length, '个');
  childCategories.forEach(c => console.log('  -', c.name.zh, ':', c._id));

  if (childCategories.length === 0) {
    console.error('❌ 未找到子分类，请检查 slug 是否正确');
    return;
  }

  // 3. 为每个子分类设置 parent 引用
  console.log('\n🔗 设置父分类引用...');
  for (const cat of childCategories) {
    await client.patch(cat._id).set({
      parent: {
        _type: 'reference',
        _ref: parentCategory._id,
      },
    }).commit();
    console.log(`  ✅ ${cat.name.zh} → 光传感器`);
  }

  // 4. 验证结果
  console.log('\n📊 验证结果：');
  const allCategories = await client.fetch(`
    *[_type == "category"] {
      _id,
      name { zh },
      "slug": slug.current,
      "parentName": parent->name.zh
    }
  `);

  const topLevel = allCategories.filter(c => !c.parentName);
  const children = allCategories.filter(c => c.parentName);

  console.log('\n顶级分类:');
  topLevel.forEach(c => console.log(`  📂 ${c.name.zh} (${c.slug})`));

  console.log('\n子分类:');
  children.forEach(c => console.log(`  └─ ${c.name.zh} → ${c.parentName}`));

  console.log('\n✅ 分类层级设置完成！');
}

main().catch(console.error);
