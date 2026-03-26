/**
 * 使用 Google Translate API 批量翻译产品数据
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 语言配置
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'th', name: 'ภาษาไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
];

// 简单的翻译映射（实际应该调用翻译API）
const TRANSLATION_CACHE = {};

/**
 * 调用 Google Translate API
 * 注意：这里使用免费的翻译服务，实际生产环境建议使用付费API
 */
async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return '';
  
  // 检查缓存
  const cacheKey = `${text}_${targetLang}`;
  if (TRANSLATION_CACHE[cacheKey]) {
    return TRANSLATION_CACHE[cacheKey];
  }
  
  try {
    // 使用 Google Translate API (需要API key)
    // 这里使用免费的 mymemory.translated.net API 作为示例
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=zh|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    const translated = data.responseData?.translatedText || '';
    
    // 缓存结果
    TRANSLATION_CACHE[cacheKey] = translated;
    
    // 延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return translated;
  } catch (error) {
    console.error(`翻译失败 (${targetLang}):`, error.message);
    return '';
  }
}

/**
 * 翻译产品数据
 */
async function translateProduct(product) {
  const updates = {};
  
  console.log(`  翻译产品: ${product.name.zh}`);
  
  // 翻译产品名称
  for (const lang of LANGUAGES) {
    if (!product.name[lang.code] || product.name[lang.code] === '') {
      const translated = await translateText(product.name.zh, lang.code);
      if (translated) {
        updates[`name.${lang.code}`] = translated;
        console.log(`    ${lang.code}: ${translated}`);
      }
    }
  }
  
  // 翻译简短描述
  if (product.shortDescription?.zh) {
    for (const lang of LANGUAGES) {
      if (!product.shortDescription[lang.code] || product.shortDescription[lang.code] === '') {
        const translated = await translateText(product.shortDescription.zh, lang.code);
        if (translated) {
          updates[`shortDescription.${lang.code}`] = translated;
        }
      }
    }
  }
  
  // 翻译完整描述
  if (product.description?.zh) {
    for (const lang of LANGUAGES) {
      if (!product.description[lang.code] || product.description[lang.code] === '') {
        const translated = await translateText(product.description.zh, lang.code);
        if (translated) {
          updates[`description.${lang.code}`] = translated;
        }
      }
    }
  }
  
  // 翻译产品特性
  if (product.features?.zh && product.features.zh.length > 0) {
    for (const lang of LANGUAGES) {
      if (!product.features[lang.code] || product.features[lang.code].length === 0) {
        const translatedFeatures = [];
        for (const feature of product.features.zh) {
          const translated = await translateText(feature, lang.code);
          if (translated) translatedFeatures.push(translated);
        }
        if (translatedFeatures.length > 0) {
          updates[`features.${lang.code}`] = translatedFeatures;
        }
      }
    }
  }
  
  // 翻译应用场景
  if (product.applications?.zh && product.applications.zh.length > 0) {
    for (const lang of LANGUAGES) {
      if (!product.applications[lang.code] || product.applications[lang.code].length === 0) {
        const translatedApps = [];
        for (const app of product.applications.zh) {
          const translated = await translateText(app, lang.code);
          if (translated) translatedApps.push(translated);
        }
        if (translatedApps.length > 0) {
          updates[`applications.${lang.code}`] = translatedApps;
        }
      }
    }
  }
  
  // 翻译SEO字段
  if (product.seo?.metaTitle?.zh) {
    for (const lang of LANGUAGES) {
      if (!product.seo.metaTitle[lang.code]) {
        const translated = await translateText(product.seo.metaTitle.zh, lang.code);
        if (translated) {
          updates[`seo.metaTitle.${lang.code}`] = translated;
        }
      }
    }
  }
  
  if (product.seo?.metaDescription?.zh) {
    for (const lang of LANGUAGES) {
      if (!product.seo.metaDescription[lang.code]) {
        const translated = await translateText(product.seo.metaDescription.zh, lang.code);
        if (translated) {
          updates[`seo.metaDescription.${lang.code}`] = translated;
        }
      }
    }
  }
  
  return updates;
}

/**
 * 翻译分类数据
 */
async function translateCategory(category) {
  const updates = {};
  
  console.log(`  翻译分类: ${category.name.zh}`);
  
  for (const lang of LANGUAGES) {
    if (!category.name[lang.code] || category.name[lang.code] === '') {
      // 分类使用预定义的英文名称
      if (lang.code === 'en' && category.name.en) {
        updates[`name.${lang.code}`] = category.name.en;
        console.log(`    ${lang.code}: ${category.name.en}`);
      } else {
        const translated = await translateText(category.name.zh, lang.code);
        if (translated) {
          updates[`name.${lang.code}`] = translated;
          console.log(`    ${lang.code}: ${translated}`);
        }
      }
    }
  }
  
  return updates;
}

/**
 * 主函数
 */
async function main() {
  console.log('🌐 开始批量翻译...\n');
  
  // 1. 翻译分类
  console.log('📁 翻译分类...');
  const categories = await client.fetch('*[_type == "category"] { _id, name }');
  
  for (const category of categories) {
    const updates = await translateCategory(category);
    
    if (Object.keys(updates).length > 0) {
      try {
        await client.patch(category._id).set(updates).commit();
        console.log(`  ✅ 已更新\n`);
      } catch (error) {
        console.error(`  ❌ 更新失败:`, error.message);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 2. 翻译产品
  console.log('\n📦 翻译产品...');
  const products = await client.fetch('*[_type == "product"] { _id, name, shortDescription, description, features, applications, seo }');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}]`);
    
    const updates = await translateProduct(product);
    
    if (Object.keys(updates).length > 0) {
      try {
        await client.patch(product._id).set(updates).commit();
        console.log(`  ✅ 已更新`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ 更新失败:`, error.message);
        failCount++;
      }
    } else {
      console.log(`  ⏭️ 无需更新`);
    }
    
    // 每个产品之间延迟，避免API限制
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n✅ 翻译完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   总计: ${products.length}`);
}

main().catch(console.error);
