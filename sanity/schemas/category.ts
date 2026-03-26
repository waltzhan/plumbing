// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: '产品分类',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
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
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '分类描述 (多语言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
        { name: 'id', title: 'Bahasa Indonesia', type: 'text', rows: 3 },
        { name: 'th', title: 'ภาษาไทย', type: 'text', rows: 3 },
        { name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 3 },
        { name: 'ar', title: 'العربية', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'parent',
      title: '父级分类',
      type: 'reference',
      to: [{ type: 'category' }],
      description: '若为顶级分类则留空',
    }),
    defineField({
      name: 'icon',
      title: '分类图标',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'orderRank',
      title: '排序权重',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name.zh',
      subtitle: 'slug.current',
    },
  },
});
