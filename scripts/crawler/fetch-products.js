/**
 * 光莆官网产品数据爬虫 (JavaScript 版本)
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

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

/**
 * 获取页面 HTML
 */
async function fetchPage(url) {
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
function parseProductList(html, categoryId) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const products = [];
  
  // 查找产品链接
  const links = document.querySelectorAll('a[href^="/Pr_d_gci_"]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const name = link.textContent?.trim();
    
    if (href && name && !name.includes('走进光莆') && !name.includes('首页') && name.length > 2) {
      // 提取产品ID
      const match = href.match(/id_(\d+)\.html/);
      const id = match ? match[1] : '';
      
      if (id && !products.find(p => p.id === id)) {
        products.push({
          name,
          url: `https://www.goproled.com${href}`,
          id,
          categoryId,
        });
      }
    }
  });
  
  return products;
}

/**
 * 解析产品详情页面
 */
function parseProductDetail(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // 产品名称 - 从 title 或 h1 获取
  const titleEl = document.querySelector('h1');
  const name = titleEl?.textContent?.trim() || '';
  
  // 所属分类
  let category = '';
  const categoryMatch = html.match(/所属分类[:：]\s*([^<\n]+)/);
  if (categoryMatch) {
    category = categoryMatch[1].trim();
  }
  
  // 产品卖点
  const sellingPoints = [];
  const sellingPointsMatch = html.match(/产品卖点[:：]?\s*([\s\S]*?)(?:产品特征|规则参数|»|上一篇|$)/);
  if (sellingPointsMatch) {
    const text = sellingPointsMatch[1].trim();
    if (text && text.length > 5) {
      sellingPoints.push(text);
    }
  }
  
  // 核心优势
  const advantageMatch = html.match(/核心优势[:：]\s*([^<\n]+)/);
  if (advantageMatch) {
    sellingPoints.push(`核心优势：${advantageMatch[1].trim()}`);
  }
  
  // 开发时间
  let developmentTime;
  const devTimeMatch = html.match(/开发时间[:：]\s*(\d{4}年?)/);
  if (devTimeMatch) {
    developmentTime = devTimeMatch[1];
  }
  
  // 产品应用
  const applications = [];
  const appMatch = html.match(/产品应用[:：]\s*([^<\n]+)/);
  if (appMatch) {
    applications.push(...appMatch[1].split(/[,，、]/).map((s) => s.trim()).filter(s => s));
  }
  
  // 产品图片
  const imgEl = document.querySelector('.product-image img, [class*="product"] img, img[src*="/Uploads/Pr/"]');
  let imageUrl = imgEl?.getAttribute('src');
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `https://www.goproled.com${imageUrl}`;
  }
  
  // 规格参数表格
  const specifications = [];
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length >= 2) {
        const key = cells[0].textContent?.trim();
        const value = cells[1].textContent?.trim();
        if (key && value && key !== '参数' && key !== '规格') {
          specifications.push({ key, value });
        }
      }
    });
  });
  
  // 产品特性 - 从列表获取
  const features = [];
  const featureLists = document.querySelectorAll('ul li, ol li');
  featureLists.forEach((item) => {
    const text = item.textContent?.trim();
    if (text && text.length > 3 && text.length < 100 && !text.includes('Copyright')) {
      features.push(text);
    }
  });
  
  return {
    name,
    category,
    sellingPoints,
    developmentTime,
    applications,
    imageUrl,
    specifications,
    features: features.slice(0, 10), // 限制数量
  };
}

/**
 * 获取分页链接
 */
function getPaginationUrls(html, baseUrl) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const urls = [baseUrl];
  
  // 查找分页链接
  const pageLinks = document.querySelectorAll('a[href*="_p_"]');
  const pageNumbers = new Set();
  
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
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主爬虫函数
 */
async function crawlAllProducts() {
  const allProducts = [];
  
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
      const categoryProducts = [];
      for (const pageUrl of pageUrls) {
        try {
          const pageHtml = await fetchPage(pageUrl);
          const products = parseProductList(pageHtml, category.id);
          categoryProducts.push(...products);
          await delay(500);
        } catch (error) {
          console.error(`  分页抓取失败: ${pageUrl}`, error.message);
        }
      }
      
      // 去重
      const uniqueProducts = categoryProducts.filter(
        (p, i, self) => i === self.findIndex((t) => t.id === p.id)
      );
      
      console.log(`  找到 ${uniqueProducts.length} 个产品`);
      
      // 4. 获取每个产品的详情
      for (let i = 0; i < uniqueProducts.length; i++) {
        const product = uniqueProducts[i];
        try {
          console.log(`    [${i + 1}/${uniqueProducts.length}] 📦 抓取: ${product.name}`);
          const detailHtml = await fetchPage(product.url);
          const detail = parseProductDetail(detailHtml);
          
          allProducts.push({
            ...product,
            ...detail,
          });
          
          await delay(800);
        } catch (error) {
          console.error(`    ❌ 抓取失败: ${product.name}`, error.message);
        }
      }
    } catch (error) {
      console.error(`❌ 分类处理失败: ${category.name.zh}`, error.message);
    }
    
    console.log('');
  }
  
  console.log(`\n✅ 抓取完成！共 ${allProducts.length} 个产品`);
  
  return {
    categories: CATEGORIES,
    products: allProducts,
  };
}

// 运行爬虫
crawlAllProducts()
  .then((data) => {
    // 保存到文件
    const outputPath = path.join(__dirname, 'products-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n💾 数据已保存到: ${outputPath}`);
    console.log(`📊 统计: ${data.categories.length} 个分类, ${data.products.length} 个产品`);
  })
  .catch((error) => {
    console.error('爬虫出错:', error);
    process.exit(1);
  });
