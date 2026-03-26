// @ts-nocheck
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// 从环境变量或直接配置中获取项目ID
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'gopro-trade-website',
  title: '光莆外贸网站 CMS',
  
  projectId,
  dataset,
  
  plugins: [
    deskTool(),
    visionTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  // 支持中英文界面
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
});
