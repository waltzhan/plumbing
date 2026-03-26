import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';

// 从光莆官网提取的产品数据
const productsData = [
  {
    name: { zh: '显尘模组', en: 'Dust Detection Module' },
    model: 'GP-DM01',
    category: '光源模组',
    description: {
      zh: '显尘模组采用绿光显尘技术，利用一束绿色平行光束，让用户在不伤眼的情况下发现家中死角处更细小的灰尘。这束光在垂直方向上被压缩至小角度，而在水平方向上则展开成大角度，从而实现了较广泛的照射范围，同时避免了光直射眼睛的伤害。这种照射方式能明显显示出清洁器前方工作表面的灰尘和杂质，提升了对微小颗粒（如皮屑、宠物毛发、尘螨和部分花粉）的识别能力。因此，显尘模组不仅能提高清洁效率，还能方便用户观察清洁效果。',
      en: 'The dust detection module uses green light technology to illuminate dust particles invisible to the naked eye. The green parallel light beam is compressed to a small angle vertically and expanded to a large angle horizontally, achieving wide illumination while avoiding direct eye exposure. This enhances the recognition of tiny particles such as dander, pet hair, dust mites, and pollen, improving cleaning efficiency and allowing users to observe cleaning results.',
    },
    shortDescription: {
      zh: '绿光显尘技术，让微尘无所遁形',
      en: 'Green light dust detection technology for thorough cleaning',
    },
    features: {
      zh: [
        '绿光显尘可视化，满足用户深度清洁需求',
        '高清晰边界光型，看得更清、更广',
        'LED+双曲面透镜，灰尘投影更远',
        '线性光贴地设计，更加安全高效',
        '自主研发专利，可灵活定制',
        '超低功耗，体积小方便安装',
      ],
      en: [
        'Green light dust visualization for deep cleaning needs',
        'High-definition boundary light pattern for clearer visibility',
        'LED + dual-curved lens for longer dust projection',
        'Linear ground-hugging light design for safety and efficiency',
        'Self-developed patented technology, customizable',
        'Ultra-low power consumption, compact and easy to install',
      ],
    },
    specifications: [
      { key: '工作电压', value: 'DC 12V', unit: '' },
      { key: '工作电流', value: '125', unit: 'mA' },
      { key: '绿光波长', value: '500-570', unit: 'nm' },
      { key: '照度', value: '400', unit: 'Lux(可调光)' },
      { key: '工作温度', value: '-10~60', unit: '℃' },
    ],
    applications: {
      zh: ['扫地机，照地面灰尘', '除螨仪，照床上被子', '电熨斗，照衣服的褶皱'],
      en: ['Robot vacuum cleaners', 'Mite removers', 'Steam irons'],
    },
    targetMarkets: ['global'],
    status: 'active',
    orderRank: 1,
  },
  // 更多产品可以继续添加...
];

// 产品分类数据
const categoriesData = [
  { name: { zh: '光源模组', en: 'Light Source Modules' }, slug: 'light-source' },
  { name: { zh: '消杀模组', en: 'Sterilization Modules' }, slug: 'sterilization' },
  { name: { zh: '智能传感', en: 'Smart Sensors' }, slug: 'smart-sensors' },
  { name: { zh: '红外LED', en: 'IR LEDs' }, slug: 'ir-leds' },
  { name: { zh: '可见光LED', en: 'Visible Light LEDs' }, slug: 'visible-leds' },
  { name: { zh: '紫外LED', en: 'UV LEDs' }, slug: 'uv-leds' },
];

async function importData() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  console.log('Starting import...');

  // 1. 导入分类
  console.log('Importing categories...');
  const categoryRefs: Record<string, string> = {};
  
  for (const cat of categoriesData) {
    const doc = {
      _type: 'category',
      _id: `category-${cat.slug}`,
      name: cat.name,
      slug: { current: cat.slug },
    };
    
    try {
      const result = await client.createOrReplace(doc);
      categoryRefs[cat.name.zh] = result._id;
      console.log(`✓ Category: ${cat.name.zh}`);
    } catch (error) {
      console.error(`✗ Category ${cat.name.zh}:`, error);
    }
  }

  // 2. 导入产品
  console.log('Importing products...');
  
  for (const product of productsData) {
    const categoryId = categoryRefs[product.category];
    
    if (!categoryId) {
      console.warn(`⚠ Category not found for: ${product.name.zh}`);
      continue;
    }

    // 创建规格文档
    const specRefs = [];
    for (const spec of product.specifications) {
      const specDoc = {
        _type: 'productSpec',
        _id: `spec-${product.model}-${spec.key}`,
        name: { zh: spec.key, en: spec.key },
        value: spec.value,
        unit: spec.unit,
      };
      
      try {
        const result = await client.createOrReplace(specDoc);
        specRefs.push({ _type: 'reference', _ref: result._id });
      } catch (error) {
        console.error(`✗ Spec ${spec.key}:`, error);
      }
    }

    // 创建产品文档
    const productDoc = {
      _type: 'product',
      _id: `product-${product.model.toLowerCase()}`,
      name: product.name,
      slug: { current: product.model.toLowerCase() },
      model: product.model,
      category: { _type: 'reference', _ref: categoryId },
      description: product.description,
      shortDescription: product.shortDescription,
      features: product.features,
      applications: product.applications,
      specifications: specRefs,
      targetMarkets: product.targetMarkets,
      status: product.status,
      orderRank: product.orderRank,
      seo: {
        metaTitle: product.name,
        metaDescription: product.shortDescription,
        keywords: ['LED', product.model, product.name.en, product.name.zh],
      },
    };

    try {
      const result = await client.createOrReplace(productDoc);
      console.log(`✓ Product: ${product.name.zh} (${result._id})`);
    } catch (error) {
      console.error(`✗ Product ${product.name.zh}:`, error);
    }
  }

  console.log('Import completed!');
}

importData().catch(console.error);
