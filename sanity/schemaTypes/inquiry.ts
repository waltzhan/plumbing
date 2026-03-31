/**
 * 询单 Schema
 * 用于在 Sanity Studio 中管理询单信息
 */

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'inquiry',
  title: '询单管理',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: '公司名称',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'contactName',
      title: '联系人',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: '邮箱',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: '电话',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: '国家/地区',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: '感兴趣的产品',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: '预计采购数量',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: '详细需求',
      type: 'text',
    }),
    defineField({
      name: 'locale',
      title: '语言',
      type: 'string',
      options: {
        list: [
          { title: '中文', value: 'zh' },
          { title: 'English', value: 'en' },
          { title: 'Bahasa Indonesia', value: 'id' },
          { title: 'ภาษาไทย', value: 'th' },
          { title: 'Tiếng Việt', value: 'vi' },
          { title: 'العربية', value: 'ar' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: '状态',
      type: 'string',
      options: {
        list: [
          { title: '新询单', value: 'new' },
          { title: '已联系', value: 'contacted' },
          { title: '已报价', value: 'quoted' },
          { title: '已成交', value: 'won' },
          { title: '已关闭', value: 'closed' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: '提交时间',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: '跟进备注',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'contactName',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({ title, subtitle, status, submittedAt }: any) {
      const statusMap: Record<string, string> = {
        new: '🆕 新询单',
        contacted: '📞 已联系',
        quoted: '📄 已报价',
        won: '✅ 已成交',
        closed: '❌ 已关闭',
      };
      return {
        title: `${title} - ${subtitle}`,
        subtitle: `${statusMap[status] || status} | ${submittedAt ? new Date(submittedAt).toLocaleString('zh-CN') : ''}`,
      };
    },
  },
  orderings: [
    {
      title: '提交时间 (最新)',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: '提交时间 (最早)',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
  ],
});
