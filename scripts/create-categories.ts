/**
 * 创建产品分类到 Sanity
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'p23es0ex',
  dataset: 'production',
  apiVersion: '2024-03-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const categories = [
  {
    title: { zh: '浴室水龙头', en: 'Bathroom Faucets', id: 'Keran Kamar Mandi', th: 'ก๊อกน้ำห้องน้ำ', vi: 'Vòi nước phòng tắm', ar: 'صنابير الحمام' },
    slug: { current: 'bathroom-faucets' },
  },
  {
    title: { zh: '马桶', en: 'Toilets', id: 'Toilet', th: 'สุขภัณฑ์', vi: 'Bồn cầu', ar: 'المراحيض' },
    slug: { current: 'toilets' },
  },
  {
    title: { zh: '淋浴系统', en: 'Shower Systems', id: 'Sistem Shower', th: 'ระบบฝักบัว', vi: 'Hệ thống vòi sen', ar: 'أنظمة الدش' },
    slug: { current: 'showers' },
  },
  {
    title: { zh: '浴缸', en: 'Bathtubs', id: 'Bak Mandi', th: 'อ่างอาบน้ำ', vi: 'Bồn tắm', ar: 'أحواض الاستحمام' },
    slug: { current: 'bathtubs' },
  },
  {
    title: { zh: '浴室水槽', en: 'Bathroom Sinks', id: 'Wastafel Kamar Mandi', th: 'อ่างล้างหน้าห้องน้ำ', vi: 'Chậu rửa phòng tắm', ar: 'أحواض الحمام' },
    slug: { current: 'bathroom-sinks' },
  },
  {
    title: { zh: '浴室配件', en: 'Bathroom Accessories', id: 'Aksesoris Kamar Mandi', th: 'อุปกรณ์เสริมห้องน้ำ', vi: 'Phụ kiện phòng tắm', ar: 'إكسسوارات الحمام' },
    slug: { current: 'bathroom-accessories' },
  },
  {
    title: { zh: '厨房水龙头', en: 'Kitchen Faucets', id: 'Keran Dapur', th: 'ก๊อกน้ำห้องครัว', vi: 'Vòi nước nhà bếp', ar: 'صنابير المطبخ' },
    slug: { current: 'kitchen-faucets' },
  },
  {
    title: { zh: '厨房水槽', en: 'Kitchen Sinks', id: 'Wastafel Dapur', th: 'อ่างล้างจานห้องครัว', vi: 'Chậu rửa nhà bếp', ar: 'أحواض المطبخ' },
    slug: { current: 'kitchen-sinks' },
  },
];

async function createCategories() {
  console.log('Creating product categories...\n');
  
  for (const category of categories) {
    try {
      // 检查是否已存在
      const existing = await client.fetch(
        `*[_type == "productCategory" && slug.current == $slug][0]._id`,
        { slug: category.slug.current }
      );
      
      if (existing) {
        console.log(`⏭️  Category already exists: ${category.title.zh}`);
        continue;
      }
      
      // 创建分类
      const result = await client.create({
        _type: 'productCategory',
        ...category,
      });
      
      console.log(`✅ Created: ${category.title.zh} (${result._id})`);
    } catch (error) {
      console.error(`❌ Failed to create ${category.title.zh}:`, error);
    }
  }
  
  console.log('\n✅ All categories created!');
}

createCategories().catch(console.error);
