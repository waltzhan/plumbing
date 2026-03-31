/**
 * 删除所有产品（用于重新导入）
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'p23es0ex',
  dataset: 'production',
  apiVersion: '2024-03-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteAllProducts() {
  console.log('🗑️  Deleting all products...\n');
  
  try {
    // 获取所有产品 ID
    const products = await client.fetch(`*[_type == "product"]._id`);
    console.log(`Found ${products.length} products to delete`);
    
    // 批量删除
    for (const id of products) {
      await client.delete(id);
      console.log(`  Deleted: ${id}`);
    }
    
    console.log(`\n✅ Deleted ${products.length} products`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deleteAllProducts();

