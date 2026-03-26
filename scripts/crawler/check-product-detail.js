const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  const p = await client.fetch('*[_type == "product"][0] { name, shortDescription, description, seo, slug }');
  console.log('名称:', JSON.stringify(p.name, null, 2));
  console.log('短描述:', JSON.stringify(p.shortDescription, null, 2));
  console.log('SEO:', JSON.stringify(p.seo, null, 2));
  console.log('slug:', JSON.stringify(p.slug, null, 2));
}

main().catch(console.error);
