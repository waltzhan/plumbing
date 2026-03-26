/**
 * 下载产品图片并上传到 Sanity
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

// 临时下载目录
const TEMP_DIR = path.join(__dirname, 'temp-images');

/**
 * 确保临时目录存在
 */
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

/**
 * 下载图片
 */
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filePath = path.join(TEMP_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    
    return filePath;
  } catch (error) {
    console.error(`  ❌ 下载失败: ${url}`, error.message);
    return null;
  }
}

/**
 * 上传图片到 Sanity
 */
async function uploadImageToSanity(filePath, filename) {
  try {
    const fileData = fs.readFileSync(filePath);
    
    // 上传到 Sanity
    const asset = await client.assets.upload('image', fileData, {
      filename: filename,
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`  ❌ 上传失败:`, error.message);
    return null;
  }
}

/**
 * 从 products-data.json 获取图片URL
 */
function getImageUrlFromData(productId) {
  try {
    const dataPath = path.join(__dirname, 'products-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const product = data.products.find(p => p.id === productId);
    return product?.imageUrl || null;
  } catch (error) {
    console.error('读取数据文件失败:', error.message);
    return null;
  }
}

/**
 * 清理临时文件
 */
function cleanup() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🖼️ 开始上传产品图片...\n');
  
  ensureTempDir();
  
  // 获取所有没有图片的产品
  const products = await client.fetch(`
    *[_type == "product" && !defined(mainImage)] { 
      _id, 
      name { zh },
      "productId": _id
    }
  `);
  
  console.log(`找到 ${products.length} 个需要上传图片的产品\n`);
  
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] 📦 ${product.name.zh}`);
    
    // 从原始数据获取图片URL
    const productId = product._id.replace('product-', '');
    const imageUrl = getImageUrlFromData(productId);
    
    if (!imageUrl) {
      console.log(`  ⏭️ 无图片URL，跳过\n`);
      skipCount++;
      continue;
    }
    
    console.log(`  📥 下载: ${imageUrl}`);
    
    // 生成文件名
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `product-${productId}${ext}`;
    
    // 下载图片
    const filePath = await downloadImage(imageUrl, filename);
    if (!filePath) {
      failCount++;
      continue;
    }
    
    console.log(`  📤 上传到 Sanity...`);
    
    // 上传到 Sanity
    const imageAsset = await uploadImageToSanity(filePath, filename);
    if (!imageAsset) {
      failCount++;
      continue;
    }
    
    // 更新产品文档
    try {
      await client.patch(product._id).set({ mainImage: imageAsset }).commit();
      console.log(`  ✅ 上传成功\n`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ 更新产品失败:`, error.message);
      failCount++;
    }
    
    // 删除临时文件
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // 忽略删除错误
    }
    
    // 延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // 清理临时目录
  cleanup();
  
  console.log(`\n✅ 图片上传完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   跳过: ${skipCount}`);
  console.log(`   总计: ${products.length}`);
}

// 程序退出时清理
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit();
});

main().catch((error) => {
  console.error('出错:', error);
  cleanup();
  process.exit(1);
});
