// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'articleCategory',
  title: '资讯分类',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '分类名称 (多语言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文 (必填)', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'en', title: 'English (必填)', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'id', title: 'Bahasa Indonesia', type: 'string' },
        { name: 'th', title: 'ภาษาไทย', type: 'string' },
        { name: 'vi', title: 'Tiếng Việt', type: 'string' },
        { name: 'ar', title: 'العربية', type: 'string' },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'title.zh',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '分类描述 (多语言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 2 },
        { name: 'en', title: 'English', type: 'text', rows: 2 },
        { name: 'id', title: 'Bahasa Indonesia', type: 'text', rows: 2 },
        { name: 'th', title: 'ภาษาไทย', type: 'text', rows: 2 },
        { name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 2 },
        { name: 'ar', title: 'العربية', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'orderRank',
      title: '排序权重',
      type: 'number',
      description: '数字越小排序越靠前',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title.zh',
    },
  },
});
