'use client';

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * 面包屑导航组件
 * - 自动生成 JSON-LD BreadcrumbList 结构化数据（利于 SEO）
 * - 支持 RTL 布局
 * - 最后一项为当前页，不加链接
 */
export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ledcoreco.com';

  // 生成 BreadcrumbList 结构化数据
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 可见面包屑 UI */}
      <nav aria-label="breadcrumb" className={`py-3 ${className}`}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1">
                {/* 分隔符 */}
                {index > 0 && (
                  <svg
                    className="w-3 h-3 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}

                {isLast || !item.href ? (
                  <span
                    className="text-gray-700 font-medium truncate max-w-[200px]"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-blue-900 transition-colors truncate max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
