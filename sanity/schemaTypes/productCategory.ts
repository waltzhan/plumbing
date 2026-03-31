export default {
  name: 'productCategory',
  title: '产品分类',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '分类名称',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'id', title: 'Bahasa Indonesia', type: 'string' },
        { name: 'th', title: 'ภาษาไทย', type: 'string' },
        { name: 'vi', title: 'Tiếng Việt', type: 'string' },
        { name: 'ar', title: 'العربية', type: 'string' },
      ],
    },
    {
      name: 'slug',
      title: 'URL 别名',
      type: 'slug',
      options: {
        source: 'title.zh',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: '分类描述',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
        { name: 'id', title: 'Bahasa Indonesia', type: 'text' },
        { name: 'th', title: 'ภาษาไทย', type: 'text' },
        { name: 'vi', title: 'Tiếng Việt', type: 'text' },
        { name: 'ar', title: 'العربية', type: 'text' },
      ],
    },
    {
      name: 'image',
      title: '分类图片',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'order',
      title: '排序',
      type: 'number',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'title.zh',
    },
  },
}
