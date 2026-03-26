import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// 硬编码 Sanity 配置，避免构建时环境变量问题
const projectId = 'nckyp28c';
const dataset = 'production';
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
