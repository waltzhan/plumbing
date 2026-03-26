// 简单测试新闻抓取
const Parser = require('rss-parser');
const parser = new Parser();

async function testCrawler() {
  console.log('🕷️ Testing news crawler...');
  
  const sources = [
    { name: 'LEDinside', url: 'https://www.ledinside.com/rss.xml' },
    { name: '高工LED', url: 'https://www.gg-led.com/rss.xml' },
  ];
  
  for (const source of sources) {
    try {
      console.log(`\n📡 Testing ${source.name} RSS...`);
      const feed = await parser.parseURL(source.url);
      console.log(`✅ Found ${feed.items.length} articles`);
      
      if (feed.items.length > 0) {
        const first = feed.items[0];
        console.log('\n📰 First article:');
        console.log(`  Title: ${first.title}`);
        console.log(`  Link: ${first.link}`);
        
        // 关键词检查
        const keywords = ['LED', '半导体', '光运用', '光传感', '智能传感', '具身智能'];
        const text = `${first.title} ${first.content || first.summary || ''}`.toLowerCase();
        const hasKeyword = keywords.some(k => text.includes(k.toLowerCase()));
        console.log(`  Has keyword: ${hasKeyword}`);
      }
    } catch (error) {
      console.error(`❌ ${source.name} failed:`, error.message);
    }
  }
  
  console.log('\n✅ Crawler test completed!');
}

testCrawler();
