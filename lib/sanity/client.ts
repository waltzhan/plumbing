import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// 从环境变量读取 Sanity 配置
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p23es0ex';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-10',
  useCdn: false,
  token, // 用于写入操作（如自动化发布）
});

// 导出 client 供其他模块使用
export const client = sanityClient;

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export function urlForImage(source: any): string {
  if (!source) return '';
  return builder.image(source).url();
}
