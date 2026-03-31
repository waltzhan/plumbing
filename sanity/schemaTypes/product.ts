export default {
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '产品名称 (前端显示)',
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
      name: 'title',
      title: '产品名称 (兼容字段)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
        { name: 'id', title: 'Bahasa Indonesia', type: 'string' },
        { name: 'th', title: 'ภาษาไทย', type: 'string' },
        { name: 'vi', title: 'Tiếng Việt', type: 'string' },
        { name: 'ar', title: 'العربية', type: 'string' },
      ],
      hidden: true, // 隐藏，仅用于兼容
    },
    {
      name: 'slug',
      title: 'URL 别名',
      type: 'slug',
      options: {
        source: 'name.zh',
        maxLength: 96,
      },
    },
    {
      name: 'model',
      title: '产品型号',
      type: 'string',
      description: '用于前端显示的产品型号',
    },
    {
      name: 'description',
      title: '产品描述',
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
      name: 'shortDescription',
      title: '简短描述',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
        { name: 'id', title: 'Bahasa Indonesia', type: 'string' },
        { name: 'th', title: 'ภาษาไทย', type: 'string' },
        { name: 'vi', title: 'Tiếng Việt', type: 'string' },
        { name: 'ar', title: 'العربية', type: 'string' },
      ],
    },
    {
      name: 'category',
      title: '产品分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
    },
    {
      name: 'sku',
      title: '产品型号',
      type: 'string',
    },
    {
      name: 'price',
      title: '价格',
      type: 'number',
    },
    {
      name: 'compareAtPrice',
      title: '原价',
      type: 'number',
    },
    {
      name: 'currency',
      title: '货币',
      type: 'string',
      initialValue: 'USD',
    },
    {
      name: 'mainImage',
      title: '主图',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: '产品列表页显示的主图',
    },
    {
      name: 'gallery',
      title: '产品图集 (前端显示)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: '产品详情页显示的图集',
    },
    {
      name: 'images',
      title: '产品图集 (原始)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      hidden: true, // 隐藏，仅用于兼容
    },
    {
      name: 'specifications',
      title: '产品规格参数',
      type: 'object',
      fields: [
        { name: 'material', title: '材质', type: 'string' },
        { name: 'finish', title: '表面处理', type: 'string' },
        { name: 'color', title: '颜色', type: 'string' },
        { name: 'size', title: '尺寸', type: 'string' },
        { name: 'weight', title: '重量', type: 'string' },
        { name: 'installation', title: '安装方式', type: 'string' },
        { name: 'certification', title: '认证', type: 'string' },
      ],
    },
    {
      name: 'features',
      title: '产品特性',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
        { name: 'id', title: 'Bahasa Indonesia', type: 'array', of: [{ type: 'string' }] },
        { name: 'th', title: 'ภาษาไทย', type: 'array', of: [{ type: 'string' }] },
        { name: 'vi', title: 'Tiếng Việt', type: 'array', of: [{ type: 'string' }] },
        { name: 'ar', title: 'العربية', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'applications',
      title: '应用场景',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
        { name: 'id', title: 'Bahasa Indonesia', type: 'array', of: [{ type: 'string' }] },
        { name: 'th', title: 'ภาษาไทย', type: 'array', of: [{ type: 'string' }] },
        { name: 'vi', title: 'Tiếng Việt', type: 'array', of: [{ type: 'string' }] },
        { name: 'ar', title: 'العربية', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'targetMarkets',
      title: '目标市场',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'datasheet',
      title: '数据手册 (PDF)',
      type: 'file',
    },
    {
      name: 'stock',
      title: '库存数量',
      type: 'number',
      initialValue: 100,
    },
    {
      name: 'status',
      title: '状态',
      type: 'string',
      options: {
        list: [
          { title: '上架', value: 'active' },
          { title: '下架', value: 'inactive' },
        ],
      },
      initialValue: 'active',
    },
    {
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'name.zh',
      media: 'mainImage',
    },
  },
}
