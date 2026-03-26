/**
 * Sanity 询单保存模块
 * 用于将询单信息保存到 Sanity CMS
 */

import { createClient } from '@sanity/client';

interface InquiryData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  products?: string[];
  quantity?: string;
  message?: string;
  locale?: string;
}

// 创建 Sanity 客户端
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-18',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * 保存询单到 Sanity
 */
export async function saveInquiryToSanity(data: InquiryData): Promise<boolean> {
  if (!process.env.SANITY_API_TOKEN) {
    console.warn('SANITY_API_TOKEN is not configured');
    return false;
  }

  try {
    // 产品名称映射
    const productLabels: Record<string, string> = {
      'ir-led': '红外LED',
      'visible-led': '可见光LED',
      'uv-led': '紫外LED',
      'other': '其他',
    };

    const productNames = data.products?.map(p => productLabels[p] || p).join('、') || '未选择';

    // 创建询单文档
    const doc = {
      _type: 'inquiry',
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      products: productNames,
      quantity: data.quantity || '未填写',
      message: data.message || '',
      locale: data.locale || 'zh',
      status: 'new', // new, contacted, quoted, closed
      submittedAt: new Date().toISOString(),
    };

    const result = await client.create(doc);
    console.log('Inquiry saved to Sanity:', result._id);
    return true;
  } catch (error) {
    console.error('Failed to save inquiry to Sanity:', error);
    return false;
  }
}
