# 光莆官网产品数据爬虫

## 文件说明

- `fetch-products.ts` - 爬虫脚本，抓取官网所有产品数据
- `transform-and-import.ts` - 数据转换和导入脚本
- `products-data.json` - 抓取的数据输出文件（运行后生成）

## 使用步骤

### 1. 安装依赖

```bash
cd scripts/crawler
npm install jsdom @sanity/client
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=nckyp28c
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

> 获取 Sanity API Token：
> 1. 访问 https://www.sanity.io/manage/project/nckyp28c
> 2. 进入 API > Tokens
> 3. 创建新 Token，选择 "Editor" 权限

### 3. 运行爬虫

```bash
npx ts-node fetch-products.ts
```

这会生成 `products-data.json` 文件。

### 4. 导入到 Sanity

```bash
npx ts-node transform-and-import.ts
```

## 数据结构

### 抓取的产品数据

```typescript
{
  id: string;           // 产品ID
  name: string;         // 产品名称（中文）
  url: string;          // 产品详情页URL
  categoryId: string;   // 分类ID
  category: string;     // 分类名称
  sellingPoints: string[];    // 产品卖点
  developmentTime?: string;   // 开发时间
  applications: string[];     // 应用场景
  imageUrl?: string;          // 产品图片URL
  specifications: { key: string; value: string }[];  // 规格参数
  features: string[];         // 产品特性
}
```

### 产品分类

- `ir-leds` - 红外LED (IR LEDs)
- `visible-leds` - 可见光LED (Visible LEDs)
- `uv-leds` - 紫外LED (UV LEDs)
- `light-source` - 光源模组 (Light Source Modules)
- `sterilization` - 消杀模组 (Sterilization Modules)
- `smart-sensors` - 智能传感 (Smart Sensors)

## 注意事项

1. **请求频率**：脚本已添加 500ms 延迟，避免请求过快
2. **图片处理**：目前只抓取图片URL，需要额外上传到 Sanity
3. **多语言**：中文数据直接抓取，其他语言需要后续翻译
4. **数据完整性**：部分产品可能没有完整规格参数

## 多语言处理方案

抓取的数据只有中文，其他语言需要：

1. **机器翻译**：使用 Google Translate API 或 DeepL API 批量翻译
2. **人工校对**：对关键产品进行人工翻译校对
3. **逐步完善**：先上线中文和英文，其他语言后续补充

## SEO/GEO 优化

导入的数据已包含：

- ✅ 产品名称（多语言字段）
- ✅ 产品描述（多语言字段）
- ✅ Meta 标题/描述（多语言字段）
- ✅ 关键词标签
- ✅ 目标市场标记

需要后续补充：
- 📝 产品图片上传到 Sanity
- 📝 多语言翻译
- 📝 数据手册 PDF 上传
