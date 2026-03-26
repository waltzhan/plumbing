# 博杰卫浴 (bojet) - 水暖卫浴外贸网站

GitHub: https://github.com/waltzhan/plumbing

专业水暖卫浴行业外贸网站模板，基于 Next.js + Sanity CMS 构建。

## 功能特性

- **多语言支持**：中文、英文、印尼语、泰语、越南语、阿拉伯语
- **产品展示**：水龙头、淋浴系统、卫浴配件、管道配件
- **询单系统**：企业微信实时通知
- **CMS 管理**：Sanity 内容管理系统
- **SEO 优化**：结构化数据、多语言 SEO、llms.txt

## 技术栈

- **前端**：Next.js 14 + React + TypeScript + Tailwind CSS
- **CMS**：Sanity
- **部署**：Vercel
- **通知**：企业微信 Webhook

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填写：

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_API_TOKEN=your_token

# 企业微信通知
WECHAT_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx

# 网站配置
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
INQUIRY_EMAIL=sales@yourdomain.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 部署到 Vercel

```bash
vercel --prod
```

## 目录结构

```
app/              # Next.js 应用路由
components/       # React 组件
lib/              # 工具函数和 API
messages/         # 多语言翻译文件
public/           # 静态资源
sanity/           # Sanity schema 配置
```

## 自定义配置

### 品牌信息

编辑 `messages/` 目录下的翻译文件：
- `zh.json` - 中文
- `en.json` - 英文
- `id.json` - 印尼语
- `th.json` - 泰语
- `vi.json` - 越南语
- `ar.json` - 阿拉伯语

### 产品数据

在 Sanity Studio 中管理产品：
1. 访问 `https://your-project.sanity.studio`
2. 添加产品分类和产品
3. 上传产品图片

## 许可证

MIT
