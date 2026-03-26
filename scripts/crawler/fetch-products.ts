/**
 * 光莆官网产品数据爬虫
 * 自动抓取所有分类页面和产品详情页
 */

import { JSDOM } from 'jsdom';

// 产品分类配置
const CATEGORIES = [
  {
    id: 'ir-leds',
    name: { zh: '红外LED', en: 'IR LEDs' },
    url: 'https://www.goproled.com/Pr_index_gci_206.html',
    parent: '光传感器',
  },
  {
    id: 'visible-leds',
    name: { zh: '可见光LED', en: 'Visible LEDs' },
    url: 'https://www.goproled.com/Pr_index_gci_207.html',
    parent: '光传感器',
  },
  {
    id: 'uv-leds',
    name: { zh: '紫外LED', en: 'UV LEDs' },
    url: 'https://www.goproled.com/Pr_index_gci_208.html',
    parent: '光传感器',
  },
  {
    id: 'light-source',
    name: { zh: '光源模组', en: 'Light Source Modules' },
    url: 'https://www.goproled.com/Pr_index_gci_231.html',
    parent: null,
  },
  {
    id: 'sterilization',
    name: { zh: '消杀模组', en: 'Sterilization Modules' },
    url: 'https://www.goproled.com/Pr_index_gci_233.html',
    parent: null,
  },
  {
    id: 'smart-sensors',
    name: { zh: '智能传感', en: 'Smart Sensors' },
    url: 'https://www.goproled.com/Pr_index_gci_232.html',
    parent: null,
  },
];

interface Product {
  name: string;
  url: string;
  id: string;
  categoryId: string;
}

interface ProductDetail {
  name: string;
  category: string;
  sellingPoints: string[];
  developmentTime?: string;
  applications: string[];
  imageUrl?: string;
  specifications: { key: string; value: string }[];
  features: string[];
}

/**
 * 获取页面 HTML
 */
async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  
  return response.text();
}

/**
 * 解析产品列表页面
 */
function parseProductList(html: string, categoryId: string): Product[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const products: Product[] = [];
  
  // 查找产品链接 - 根据页面结构调整选择器
  const links = document.querySelectorAll('a[href^="/Pr_d_gci_"]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const name = link.textContent?.trim();
    
    if (href && name && !name.includes('走进光莆') && !name.includes('首页')) {
      // 提取产品ID
      const match = href.match(/id_(\d+)\.html/);
      const id = match ? match[1] : '';
      
      products.push({
        name,
        url: `https://www.goproled.com${href}`,
        id,
        categoryId,
      });
    }
  });
  
  // 去重
  const uniqueProducts = products.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );
  
  return uniqueProducts;
}

/**
 * 解析产品详情页面
 */
function parseProductDetail(html: string): ProductDetail {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // 产品名称
  const titleEl = document.querySelector('h1, .product-title, [class*="title"]');
  const name = titleEl?.textContent?.trim() || '';
  
  // 所属分类
  const categoryEl = document.querySelector('.product-category, [class*="category"]');
  const category = categoryEl?.textContent?.trim() || '';
  
  // 产品卖点
  const sellingPoints: string[] = [];
  const sellingPointsEl = document.querySelector('.product-selling-points, [class*="selling"]');
  if (sellingPointsEl) {
    const points = sellingPointsEl.querySelectorAll('li, p');
    points.forEach((p) => {
      const text = p.textContent?.trim();
      if (text) sellingPoints.push(text);
    });
  }
  
  // 开发时间
  let developmentTime: string | undefined;
  const devTimeMatch = html.match(/开发时间[:：]\s*(\d{4}年)/);
  if (devTimeMatch) {
    developmentTime = devTimeMatch[1];
  }
  
  // 产品应用
  const applications: string[] = [];
  const appMatch = html.match(/产品应用[:：]\s*([^<]+)/);
  if (appMatch) {
    applications.push(...appMatch[1].split(/[,，、]/).map((s) => s.trim()));
  }
  
  // 产品图片
  const imgEl = document.querySelector('.product-image img, [class*="product"] img');
  const imageUrl = imgEl?.getAttribute('src');
  
  // 规格参数表格
  const specifications: { key: string; value: string }[] = [];
  const table = document.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length >= 2) {
        const key = cells[0].textContent?.trim();
        const value = cells[1].textContent?.trim();
        if (key && value) {
          specifications.push({ key, value });
        }
      }
    });
  }
  
  // 产品特性
  const features: string[] = [];
  const featuresEl = document.querySelector('.product-features, [class*="feature"]');
  if (featuresEl) {
    const items = featuresEl.querySelectorAll('li');
    items.forEach((item) => {
      const text = item.textContent?.trim();
      if (text) features.push(text);
    });
  }
  
  return {
    name,
    category,
    sellingPoints,
    developmentTime,
    applications,
    imageUrl: imageUrl ? `https://www.goproled.com${imageUrl}` : undefined,
    specifications,
    features,
  };
}

/**
 * 获取分页链接
 */
function getPaginationUrls(html: string, baseUrl: string): string[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const urls: string[] = [baseUrl];
  
  // 查找分页链接
  const pageLinks = document.querySelectorAll('a[href*="_p_"]');
  const pageNumbers = new Set<number>();
  
  pageLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const match = href.match(/_p_(\d+)\.html/);
      if (match) {
        pageNumbers.add(parseInt(match[1]));
      }
    }
  });
  
  // 生成所有分页URL
  pageNumbers.forEach((page) => {
    const baseUrlWithoutExt = baseUrl.replace('.html', '');
    urls.push(`${baseUrlWithoutExt}_p_${page}.html`);
  });
  
  return urls;
}

/**
 * 主爬虫函数
 */
export async function crawlAllProducts(): Promise<{
  categories: typeof CATEGORIES;
  products: (Product & ProductDetail)[];
}> {
  const allProducts: (Product & ProductDetail)[] = [];
  
  console.log('开始抓取产品数据...\n');
  
  for (const category of CATEGORIES) {
    console.log(`📁 处理分类: ${category.name.zh}`);
    
    try {
      // 1. 获取分类首页
      const listHtml = await fetchPage(category.url);
      
      // 2. 获取所有分页URL
      const pageUrls = getPaginationUrls(listHtml, category.url);
      console.log(`  发现 ${pageUrls.length} 个分页`);
      
      // 3. 遍历所有分页获取产品列表
      const categoryProducts: Product[] = [];
      for (const pageUrl of pageUrls) {
        const pageHtml = await fetchPage(pageUrl);
        const products = parseProductList(pageHtml, category.id);
        categoryProducts.push(...products);
      }
      
      // 去重
      const uniqueProducts = categoryProducts.filter(
        (p, i, self) => i === self.findIndex((t) => t.id === p.id)
      );
      
      console.log(`  找到 ${uniqueProducts.length} 个产品`);
      
      // 4. 获取每个产品的详情
      for (const product of uniqueProducts) {
        try {
          console.log(`    📦 抓取: ${product.name}`);
          const detailHtml = await fetchPage(product.url);
          const detail = parseProductDetail(detailHtml);
          
          allProducts.push({
            ...product,
            ...detail,
          });
          
          // 延迟，避免请求过快
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`    ❌ 抓取失败: ${product.name}`, error);
        }
      }
    } catch (error) {
      console.error(`❌ 分类处理失败: ${category.name.zh}`, error);
    }
    
    console.log('');
  }
  
  console.log(`\n✅ 抓取完成！共 ${allProducts.length} 个产品`);
  
  return {
    categories: CATEGORIES,
    products: allProducts,
  };
}

// 如果直接运行此脚本
if (require.main === module) {
  crawlAllProducts()
    .then((data) => {
      // 保存到文件
      const fs = require('fs');
      const outputPath = './products-data.json';
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`\n💾 数据已保存到: ${outputPath}`);
    })
    .catch(console.error);
}
