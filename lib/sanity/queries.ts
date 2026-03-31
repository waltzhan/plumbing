import { sanityClient } from './client';

// 获取所有产品分类（平铺，含 parent 引用）
export async function getCategories() {
  const query = `*[_type == "category"] | order(_createdAt asc) {
    _id,
    name,
    slug,
    description,
    "parentId": parent._ref
  }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 获取分类树（顶级 + 子级结构）
export async function getCategoryTree() {
  const query = `*[_type == "category" && !defined(parent)] | order(_createdAt asc) {
    _id,
    name,
    slug,
    "children": *[_type == "category" && parent._ref == ^._id] | order(_createdAt asc) {
      _id,
      name,
      slug
    }
  }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 获取所有产品（支持按分类筛选，父分类同时包含子分类产品）
export async function getProducts(categorySlug?: string) {
  // 无筛选：查全部
  if (!categorySlug) {
    const query = `*[_type == "product"] | order(_createdAt asc) {
      _id,
      name,
      slug,
      model,
      "category": category->{title, slug},
      shortDescription,
      mainImage,
      status,
      targetMarkets
    }`;
    return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
  }

  // 有筛选：匹配直属分类 OR 其子分类
  const filter = `&& (
    category->slug.current == "${categorySlug}" ||
    category->parent->slug.current == "${categorySlug}"
  )`;

  const query = `*[_type == "product" ${filter}] | order(_createdAt asc) {
    _id,
    name,
    slug,
    model,
    "category": category->{title, slug},
    shortDescription,
    mainImage,
    status,
    targetMarkets
  }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 获取单个产品详情
export async function getProductBySlug(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    model,
    "category": category->{ _id, title, slug },
    description,
    shortDescription,
    mainImage,
    gallery,
    features,
    applications,
    specifications,
    targetMarkets,
    status,
    seo
  }`;
  return sanityClient.fetch(query, { slug }, { next: { revalidate: 3600 } });
}

// 获取所有产品 slug（用于 generateStaticParams）
export async function getAllProductSlugs() {
  const query = `*[_type == "product" && defined(slug.current)] { "slug": slug.current }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 批量按 slug 获取产品基本信息（用于首页展示）
export async function getProductsBySlugList(slugs: string[]) {
  const query = `*[_type == "product" && slug.current in $slugs] {
    _id,
    name,
    slug,
    mainImage,
    shortDescription
  }`;
  return sanityClient.fetch(query, { slugs }, { next: { revalidate: 3600 } });
}

// 获取相关产品
export async function getRelatedProducts(productId: string, categoryRef: string, limit: number = 4) {
  const query = `*[_type == "product" && _id != $productId && category._ref == $categoryRef] | order(_createdAt asc) [0...${limit}] {
    _id,
    name,
    slug,
    model,
    shortDescription,
    mainImage
  }`;
  return sanityClient.fetch(query, { productId, categoryRef }, { next: { revalidate: 3600 } });
}
