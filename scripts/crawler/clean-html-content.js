/**
 * 清洗 Sanity 中产品描述的 HTML 内容
 * 移除爬虫带入的无用 img/导航/a标签等
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * 清洗 HTML 内容
 */
function cleanHtml(html) {
  if (!html) return '';
  return html
    // 移除所有 <img> 标签
    .replace(/<img[^>]*>/gi, '')
    // 移除 javascript: 链接的整个 <a> 标签
    .replace(/<a[^>]*href="javascript:[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
    // 移除所有 <a> 标签但保留内容
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    // 移除爬虫带入的页面导航区块（else_prve_next 及其后所有内容）
    .replace(/<div[^>]*class="[^"]*else_prve_next[^"]*"[\s\S]*/gi, '')
    // 移除爬虫带入的 detail_contact 区块
    .replace(/<div[^>]*class="[^"]*detail_contact[^"]*"[\s\S]*/gi, '')
    // 移除开头的孤立闭合标签（如 "</p>"）
    .replace(/^\s*<\/[^>]+>\s*/, '')
    // 清理多余连续换行
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br/><br/>')
    .trim();
}

const LANGS = ['zh', 'en', 'id', 'th', 'vi', 'ar'];

async function main() {
  console.log('🧹 开始清洗产品 HTML 描述...\n');

  const products = await client.fetch(
    '*[_type == "product"] { _id, name { zh }, description, shortDescription, "seo": seo { metaDescription } }'
  );

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const patches = {};
    let needsUpdate = false;

    // 清洗 description
    for (const lang of LANGS) {
      const raw = product.description?.[lang];
      if (raw) {
        const cleaned = cleanHtml(raw);
        if (cleaned !== raw) {
          patches[`description.${lang}`] = cleaned;
          needsUpdate = true;
        }
      }
    }

    // 清洗 shortDescription
    for (const lang of LANGS) {
      const raw = product.shortDescription?.[lang];
      if (raw) {
        const cleaned = cleanHtml(raw);
        if (cleaned !== raw) {
          patches[`shortDescription.${lang}`] = cleaned;
          needsUpdate = true;
        }
      }
    }

    // 清洗 seo.metaDescription
    for (const lang of LANGS) {
      const raw = product.seo?.metaDescription?.[lang];
      if (raw) {
        const cleaned = cleanHtml(raw);
        if (cleaned !== raw) {
          patches[`seo.metaDescription.${lang}`] = cleaned;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      await client.patch(product._id).set(patches).commit();
      console.log(`  ✅ 已清洗: ${product.name?.zh}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n✅ 清洗完成！`);
  console.log(`   已更新: ${updated}`);
  console.log(`   无需更新: ${skipped}`);
  console.log(`   总计: ${products.length}`);
}

main().catch(console.error);
