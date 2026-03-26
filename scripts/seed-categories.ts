// 初始化产品分类数据脚本
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-03-10',
  token: 'skb7xF9nxsT6bfoJsTAQGBgA7q1iSNjQecXG0NmHCNx42QreJAHuWEwmOQcAPBUcPoO9TrsVMFyYPUZD8jIjA5d1jJEf0fyjCGwUpDGrvcgTfix322mvO0WHKduQ00kxYZ3rU4VGQOnncTOl9qDMtWF947NA5gcltdJm9xxjOcwuFFMphfqL',
  useCdn: false,
});

const categories = [
  {
    _type: 'category',
    name: {
      zh: 'CHIP LED',
      en: 'CHIP LED',
      id: 'CHIP LED',
      th: 'CHIP LED',
      vi: 'CHIP LED',
      ar: 'CHIP LED',
    },
    slug: { current: 'chip-led' },
    description: {
      zh: '超小型封装LED，适用于消费电子指示灯',
      en: 'Ultra-small package LEDs for consumer electronics indicators',
    },
    orderRank: 1,
  },
  {
    _type: 'category',
    name: {
      zh: 'PLCC LED',
      en: 'PLCC LED',
      id: 'PLCC LED',
      th: 'PLCC LED',
      vi: 'PLCC LED',
      ar: 'PLCC LED',
    },
    slug: { current: 'plcc-led' },
    description: {
      zh: '中高功率LED，适用于照明和显示',
      en: 'Medium to high power LEDs for lighting and display',
    },
    orderRank: 2,
  },
  {
    _type: 'category',
    name: {
      zh: '红外传感器',
      en: 'IR Sensors',
      id: 'Sensor IR',
      th: 'เซ็นเซอร์อินฟราเรด',
      vi: 'Cảm biến hồng ngoại',
      ar: 'مستشعرات الأشعة تحت الحمراء',
    },
    slug: { current: 'ir-sensors' },
    description: {
      zh: '红外发射和接收器件，适用于传感应用',
      en: 'Infrared emitters and receivers for sensing applications',
    },
    orderRank: 3,
  },
  {
    _type: 'category',
    name: {
      zh: '紫外LED',
      en: 'UV LED',
      id: 'UV LED',
      th: 'UV LED',
      vi: 'UV LED',
      ar: 'UV LED',
    },
    slug: { current: 'uv-led' },
    description: {
      zh: '紫外光LED，适用于消毒和固化',
      en: 'Ultraviolet LEDs for sterilization and curing',
    },
    orderRank: 4,
  },
];

async function seedCategories() {
  console.log('开始初始化产品分类...');
  
  for (const category of categories) {
    try {
      // 检查是否已存在
      const existing = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug.current }
      );
      
      if (existing) {
        console.log(`分类已存在: ${category.name.zh}`);
        continue;
      }
      
      const result = await client.create(category);
      console.log(`✅ 创建分类: ${category.name.zh} (${result._id})`);
    } catch (error) {
      console.error(`❌ 创建分类失败 ${category.name.zh}:`, error);
    }
  }
  
  console.log('分类初始化完成！');
}

seedCategories();
