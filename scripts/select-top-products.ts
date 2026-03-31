/**
 * 筛选每个分类的前 50 个优质产品
 * 基于：品牌知名度、价格合理性、图片数量、描述完整度
 */

import * as fs from 'fs';
import * as path from 'path';

interface Product {
  title: { en: string };
  brand: string;
  price: number;
  compareAtPrice: number | null;
  imageUrls: string[];
  description: { en: string };
  specifications: Record<string, string>;
  category: string;
  [key: string]: any;
}

// 知名品牌列表（按知名度排序）
const PREMIUM_BRANDS = [
  'Toto', 'Kohler', 'Grohe', 'Hansgrohe', 'Moen', 'Delta', 
  'American Standard', 'Pfister', 'Roca', 'Geberit', 'Duravit',
  'Villeroy & Boch', 'Axor', 'Kludi', 'Dornbracht'
];

const MID_TIER_BRANDS = [
  'Studiolux', 'Caroma', 'Blanco', 'InSinkErator', 'Saniflo',
  'Panasonic', 'Eago', 'Ariel', 'Anzzi', 'Fresca'
];

/**
 * 计算产品综合评分
 */
function calculateScore(product: Product): number {
  let score = 0;
  
  // 1. 品牌评分 (0-30分)
  const brandLower = product.brand?.toLowerCase() || '';
  const premiumIndex = PREMIUM_BRANDS.findIndex(b => brandLower.includes(b.toLowerCase()));
  const midIndex = MID_TIER_BRANDS.findIndex(b => brandLower.includes(b.toLowerCase()));
  
  if (premiumIndex !== -1) {
    score += 30 - premiumIndex; // 排名越靠前分数越高
  } else if (midIndex !== -1) {
    score += 15 - midIndex;
  } else if (product.brand && product.brand !== 'Unknown') {
    score += 5; // 有品牌但非知名
  }
  
  // 2. 价格评分 (0-25分) - 适中价格更有可能畅销
  const price = product.price;
  if (price >= 100 && price <= 500) {
    score += 25; // 最佳价格区间
  } else if (price >= 50 && price < 100) {
    score += 20;
  } else if (price > 500 && price <= 1000) {
    score += 15;
  } else if (price > 1000 && price <= 2000) {
    score += 10;
  } else if (price > 30) {
    score += 5;
  }
  
  // 3. 折扣评分 (0-10分) - 有折扣说明促销力度大
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const discount = (product.compareAtPrice - product.price) / product.compareAtPrice;
    if (discount >= 0.3) score += 10; // 30%以上折扣
    else if (discount >= 0.2) score += 7;
    else if (discount >= 0.1) score += 5;
  }
  
  // 4. 图片评分 (0-20分)
  const imageCount = product.imageUrls?.length || 0;
  if (imageCount >= 5) score += 20;
  else if (imageCount >= 3) score += 15;
  else if (imageCount >= 2) score += 10;
  else if (imageCount >= 1) score += 5;
  
  // 5. 描述完整度 (0-15分)
  const descLength = product.description?.en?.length || 0;
  if (descLength > 2000) score += 15;
  else if (descLength > 1000) score += 10;
  else if (descLength > 500) score += 5;
  
  // 6. 规格参数 (0-10分)
  const specCount = Object.keys(product.specifications || {}).length;
  if (specCount >= 5) score += 10;
  else if (specCount >= 3) score += 7;
  else if (specCount >= 1) score += 3;
  
  return score;
}

/**
 * 从文件加载产品
 */
function loadProducts(filename: string): Product[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}`);
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * 保存产品到文件
 */
function saveProducts(products: Product[], filename: string) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`💾 Saved ${products.length} products to ${filename}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🎯 Selecting top 50 products from each category...\n');
  
  const categories = [
    { file: 'products-bathroom-faucets.json', name: '浴室水龙头' },
    { file: 'products-toilets.json', name: '马桶' },
    { file: 'products-showers.json', name: '淋浴系统' },
    { file: 'products-bathtubs.json', name: '浴缸' },
    { file: 'products-bathroom-sinks.json', name: '浴室水槽' },
    { file: 'products-bathroom-accessories.json', name: '浴室配件' },
    { file: 'products-kitchen-faucets.json', name: '厨房水龙头' },
    { file: 'products-kitchen-sinks.json', name: '厨房水槽' },
  ];
  
  const allSelectedProducts: Product[] = [];
  const stats: Array<{ category: string; total: number; selected: number; avgScore: number; topBrand: string }> = [];
  
  for (const cat of categories) {
    console.log(`\n📂 Processing: ${cat.name}`);
    const products = loadProducts(cat.file);
    
    if (products.length === 0) {
      console.log(`  ⚠️ No products found`);
      continue;
    }
    
    // 计算每个产品的评分
    const scoredProducts = products.map(p => ({
      product: p,
      score: calculateScore(p),
    }));
    
    // 按评分排序
    scoredProducts.sort((a, b) => b.score - a.score);
    
    // 取前 50 个
    const selected = scoredProducts.slice(0, 50).map(item => item.product);
    const topScore = scoredProducts[0]?.score || 0;
    const minScore = scoredProducts[selected.length - 1]?.score || 0;
    
    // 统计
    const brandCount: Record<string, number> = {};
    let totalScore = 0;
    for (const item of scoredProducts.slice(0, 50)) {
      const brand = item.product.brand || 'Unknown';
      brandCount[brand] = (brandCount[brand] || 0) + 1;
      totalScore += item.score;
    }
    const topBrand = Object.entries(brandCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    stats.push({
      category: cat.name,
      total: products.length,
      selected: selected.length,
      avgScore: Math.round(totalScore / selected.length),
      topBrand,
    });
    
    console.log(`  📊 Total: ${products.length}, Selected: ${selected.length}`);
    console.log(`  ⭐ Score range: ${topScore} - ${minScore}`);
    console.log(`  🏷️  Top brand: ${topBrand}`);
    
    // 显示前 5 个产品
    console.log(`  🏆 Top 5 products:`);
    selected.slice(0, 5).forEach((p, i) => {
      const score = scoredProducts[i]?.score || 0;
      console.log(`     ${i + 1}. [${score}分] ${p.title.en.substring(0, 60)}... ($${p.price})`);
    });
    
    allSelectedProducts.push(...selected);
    
    // 保存分类文件
    saveProducts(selected, `top50-${cat.file.replace('products-', '')}`);
  }
  
  // 保存所有精选产品
  saveProducts(allSelectedProducts, 'all-top50-products.json');
  
  // 打印汇总
  console.log('\n\n📋 ====== 筛选汇总 ======');
  console.log(`总分类数: ${stats.length}`);
  console.log(`总产品数: ${allSelectedProducts.length}`);
  console.log('\n各分类详情:');
  stats.forEach(s => {
    console.log(`  ${s.category}: ${s.selected}/${s.total} (平均分: ${s.avgScore}, 主要品牌: ${s.topBrand})`);
  });
  
  console.log('\n✅ 精选产品已保存到 data/top50-*.json');
  console.log('💡 下一步: 运行 import-to-sanity.ts 导入到 Sanity');
}

main().catch(console.error);
