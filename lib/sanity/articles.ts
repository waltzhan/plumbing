import { client } from './client';
import { groq } from 'next-sanity';

// 获取文章列表
export async function getArticles(
  locale: string = 'zh',
  category?: string,
  limit: number = 10,
  offset: number = 0
) {
  const categoryFilter = category ? `&& category->slug.current == "${category}"` : '';
  
  const query = groq`
    *[_type == "article" && status == "published" ${categoryFilter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      _id,
      _createdAt,
      title,
      slug,
      category->{
        _id,
        title,
        slug
      },
      excerpt,
      coverImage,
      tags,
      publishedAt,
      author,
      viewCount,
      "estimatedReadTime": length(pt::text(content.${locale})) / 200
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取文章总数
export async function getArticlesCount(category?: string) {
  const categoryFilter = category ? `&& category->slug.current == "${category}"` : '';
  
  const query = groq`
    count(*[_type == "article" && status == "published" ${categoryFilter}])
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取单篇文章
export async function getArticleBySlug(slug: string, locale: string = 'zh') {
  const query = groq`
    *[_type == "article" && slug.current == "${slug}" && status == "published"][0] {
      _id,
      _createdAt,
      title,
      slug,
      category->{
        _id,
        title,
        slug
      },
      tags,
      excerpt,
      content,
      coverImage,
      publishedAt,
      author,
      source,
      seo,
      viewCount,
      "estimatedReadTime": length(pt::text(content.${locale})) / 200
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取相关文章
export async function getRelatedArticles(
  currentId: string,
  categoryId: string,
  limit: number = 3,
  locale: string = 'zh'
) {
  const query = groq`
    *[_type == "article" && _id != "${currentId}" && category._ref == "${categoryId}" && status == "published"] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      "estimatedReadTime": length(pt::text(content.${locale})) / 200
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取推荐文章
export async function getFeaturedArticles(limit: number = 5) {
  const query = groq`
    *[_type == "article" && isFeatured == true && status == "published"] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      category->{
        title,
        slug
      }
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取最新文章
export async function getLatestArticles(limit: number = 6) {
  const query = groq`
    *[_type == "article" && status == "published"] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      category->{
        title,
        slug
      }
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取所有文章分类
export async function getArticleCategories() {
  const query = groq`
    *[_type == "articleCategory"] | order(orderRank asc) {
      _id,
      title,
      slug,
      description
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 获取单个分类
export async function getArticleCategoryBySlug(slug: string) {
  const query = groq`
    *[_type == "articleCategory" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      description
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

// 获取所有文章slug（用于静态生成）
export async function getAllArticleSlugs() {
  const query = groq`
    *[_type == "article" && status == "published"] {
      slug
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 获取所有分类slug（用于静态生成）
export async function getAllCategorySlugs() {
  const query = groq`
    *[_type == "articleCategory"] {
      slug
    }
  `;
  
  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}
