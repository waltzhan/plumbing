/**
 * 简化版产品导入脚本
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const client = createClient({
  projectId: 'p23es0ex',
  dataset: 'production',
  apiVersion: '2024-03-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `product-${Date.now()}.jpg`,
    });
    return asset._id;
  } catch (error) {
    console.warn('Failed to upload image:', imageUrl.substring(0, 80));
    return null;
  }
}

async function importProduct(productData: any, categoryId: string) {
  try {
    // 上传第一张图片作为主图
    let mainImage = null;
    if (productData.images && productData.images.length > 0) {
      const imageUrl = productData.images[0].url;
      const assetId = await uploadImage(imageUrl);
      if (assetId) {
        mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        };
      }
    }

    // 上传所有图片到 gallery
    const gallery = [];
    for (const img of productData.images?.slice(0, 5) || []) {
      const assetId = await uploadImage(img.url);
      if (assetId) {
        gallery.push({
          _key: `img-${gallery.length}`,
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        });
      }
    }

    const doc = {
      _type: 'product',
      name: productData.title,
      slug: productData.slug,
      model: productData.sku,
      sku: productData.sku,
      price: productData.price,
      currency: productData.currency || 'USD',
      description: productData.description,
      shortDescription: productData.shortDescription,
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
      mainImage,
      gallery,
      images: gallery,
      status: 'active',
      stock: 100,
      features: { zh: [], en: [], id: [], th: [], vi: [], ar: [] },
      applications: { zh: [], en: [], id: [], th: [], vi: [], ar: [] },
      targetMarkets: [],
    };

    const result = await client.create(doc);
    console.log('✅ Created:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Importing products...\n');

  // 加载产品数据
  const data = JSON.parse(fs.readFileSync(path.join('data', 'top50-bathroom-faucets.json'), 'utf-8'));
  
  // 只导入前2个产品测试
  const testProducts = data.slice(0, 2);
  console.log(`Importing ${testProducts.length} products...\n`);

  const categoryId = 'DDkH7Ore4K9MDVWIp2O7s3'; // 浴室水龙头分类ID

  for (const product of testProducts) {
    console.log('Importing:', product.title.en.substring(0, 50) + '...');
    await importProduct(product, categoryId);
    console.log('');
  }

  console.log('✅ Done!');
}

main();
