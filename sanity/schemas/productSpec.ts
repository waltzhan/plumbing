// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productSpec',
  title: '产品规格参数',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '参数名称',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.required() },
      ],
    }),
    defineField({
      name: 'key',
      title: '参数键名',
      type: 'string',
      description: '用于程序识别的唯一标识，如：wavelength, power, voltage',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'unit',
      title: '单位',
      type: 'string',
      description: '如：nm, mW, V, mA',
    }),
    defineField({
      name: 'value',
      title: '参数值',
      type: 'string',
      description: '具体数值或范围，如：940, 100-200, 3.0-3.4',
    }),
    defineField({
      name: 'category',
      title: '所属分类',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'isHighlight',
      title: '是否高亮显示',
      type: 'boolean',
      description: '重要参数将在产品卡片上突出显示',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name.zh',
      subtitle: 'key',
    },
  },
});
