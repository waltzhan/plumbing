# 快速部署指南

## 5 分钟快速上线

### 步骤 1: 创建 Sanity 项目 (2分钟)

1. 访问 https://www.sanity.io/manage
2. 点击 "Create new project"
3. 项目名称: `your-company-website`
4. 选择 "Clean project with no predefined schemas"
5. 记录 **Project ID**
6. 进入项目 → API → Tokens → **Add API token** → 选择 "Editor" 权限
7. 复制 **Token**

### 步骤 2: 部署到 Vercel (2分钟)

1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 配置环境变量:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=你的ProjectID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=你的Token
NEXT_PUBLIC_SITE_URL=https://你的域名.com
WECHAT_WEBHOOK_URL=你的企微Webhook（可选）
```

4. 点击 Deploy

### 步骤 3: 配置域名 (1分钟)

1. 在 Vercel 项目设置中添加自定义域名
2. 在域名服务商添加 DNS 记录
3. 等待 SSL 证书自动配置

### 步骤 4: 配置 Sanity Studio (可选)

```bash
npm install -g @sanity/cli
sanity login
sanity init --project 你的ProjectID
cd sanity
sanity deploy
```

访问 `https://你的ProjectID.sanity.studio`

## 完成！

你的网站现在应该可以正常访问了。

## 后续配置

### 配置企业微信通知

1. 在企业微信群中添加机器人
2. 复制 Webhook 地址
3. 添加到 Vercel 环境变量 `WECHAT_WEBHOOK_URL`
4. 重新部署

### 添加产品内容

1. 访问 Sanity Studio
2. 创建产品分类
3. 添加产品
4. 网站自动同步

### 配置 Google Analytics

1. 访问 https://analytics.google.com
2. 创建属性，获取衡量 ID (格式: G-XXXXXXXXXX)
3. 添加到 Vercel 环境变量 `NEXT_PUBLIC_GA_ID`
4. 重新部署

## 故障排除

### 部署失败

- 检查环境变量是否完整
- 检查 Sanity Project ID 是否正确

### 询单通知失败

- 检查 Webhook URL 是否正确
- 检查企业微信群机器人是否正常

### 图片不显示

- 在 Sanity 中重新上传图片
- 检查图片 URL 是否正确

## 技术支持

如有问题，请查看 README.md 或提交 Issue。
