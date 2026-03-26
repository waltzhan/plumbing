/**
 * 修复产品名称 - 从原始数据中提取正确的产品名称
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 从 products-data.json 获取产品名称
function getProductNameFromData(productId) {
  try {
    const dataPath = path.join(__dirname, 'products-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const product = data.products.find(p => p.id === productId);
    
    // 从URL或sellingPoints中提取名称
    if (product) {
      // 尝试从sellingPoints中提取
      if (product.sellingPoints && product.sellingPoints.length > 1) {
        // 第二个元素通常是核心优势，第一个是HTML垃圾
        const coreAdvantage = product.sellingPoints[1];
        if (coreAdvantage && coreAdvantage.includes('核心优势')) {
          // 尝试从URL路径提取产品名称
          const urlMatch = product.url.match(/Pr_d_gci_\d+_id_\d+\.html/);
          if (urlMatch) {
            // 返回一个基于ID的临时名称
            return `产品 ${productId}`;
          }
        }
      }
      
      // 如果有有效的sellingPoints[1]，使用它
      if (product.sellingPoints && product.sellingPoints[1]) {
        return product.sellingPoints[1].replace(/核心优势[：:]\s*/, '').trim();
      }
    }
    
    return null;
  } catch (error) {
    console.error('读取数据文件失败:', error.message);
    return null;
  }
}

// 产品名称映射表（基于之前爬取时看到的产品列表）
const PRODUCT_NAMES = {
  '474': '激光雷达VCSEL发射传感器',
  '472': '距离感测传感器/TOF发射VCSEL传感',
  '471': '环境光传感器',
  '469': '超小型红外对射传感2',
  '468': '超小型红外对射传感1',
  '461': '心率监测传感/血糖监测传感/光疗LED器件',
  '460': '血氧监测传感器',
  '456': '高精密红外对射传感',
  '455': '人脸识别/人体通过检测传感器3',
  '454': '人脸识别/人体通过检测传感器2',
  '453': '人脸识别/人体通过检测传感器1',
  '452': '接近光传感/校对反射式红外传感器2',
  '451': '接近光传感/校对反射式红外传感器1',
  '465': '超小型可见光LED器件1',
  '466': '超小型可见光LED器件2',
  '467': '超小型可见光LED器件3',
  '462': 'UVA/UVB/UVC紫外光器件1',
  '463': 'UVA/UVB/UVC紫外光器件2',
  '464': 'UVA/UVB/UVC紫外光器件3',
  '575': '显尘模组',
  '580': '过流式紫外杀菌模组 GP23XX系列',
  '581': '空气紫外杀菌模组 GP-XS29xx系列',
  '582': '静态紫外杀菌模组 GP-XS17xx系列',
  '576': '柔性接触传感模组',
  '577': 'DTOP距离测量模组',
  '578': '接近唤醒雷达模组',
  '579': '管道式光电液位传感模组',
};

async function main() {
  console.log('🔧 修复产品名称...\n');
  
  // 获取所有产品
  const products = await client.fetch('*[_type == "product"] { _id, name }');
  
  console.log(`找到 ${products.length} 个产品\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productId = product._id.replace('product-', '');
    
    // 从映射表获取名称
    const correctName = PRODUCT_NAMES[productId];
    
    if (!correctName) {
      console.log(`[${i + 1}/${products.length}] ⚠️ 未找到产品 ${productId} 的名称映射`);
      failCount++;
      continue;
    }
    
    console.log(`[${i + 1}/${products.length}] 📝 ${correctName}`);
    
    try {
      // 更新产品名称（所有语言都先用中文）
      await client.patch(product._id).set({
        'name.zh': correctName,
        'name.en': correctName, // 临时用中文，后续翻译
        'name.id': correctName,
        'name.th': correctName,
        'name.vi': correctName,
        'name.ar': correctName,
      }).commit();
      
      console.log(`  ✅ 已更新\n`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ 更新失败:`, error.message);
      failCount++;
    }
    
    // 延迟
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n✅ 修复完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   总计: ${products.length}`);
}

main().catch(console.error);
