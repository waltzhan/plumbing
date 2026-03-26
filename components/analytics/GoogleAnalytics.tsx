'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * 页面路由变化时发送 pageview 事件（SPA 路由跟踪）
 */
function GAPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag === 'undefined') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics 4 集成组件
 * - 仅在配置了 NEXT_PUBLIC_GA_ID 时才加载（本地开发不加载）
 * - 使用 next/script afterInteractive 策略，不阻塞页面渲染
 * - 支持 SPA 路由跟踪（页面切换时自动发送 pageview）
 *
 * 使用方式：在 layout.tsx 中引入此组件
 * 环境变量：在 .env.local 中设置 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* GA4 脚本（afterInteractive：页面交互后加载，不影响 FCP/LCP） */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            // 隐私合规：匿名化 IP
            anonymize_ip: true,
            // 转化跟踪：询盘提交
            send_page_view: true,
          });
        `}
      </Script>

      {/* SPA 路由跟踪（Suspense 包裹，因为 useSearchParams 需要） */}
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  );
}

/**
 * GA4 自定义事件跟踪工具函数
 * 在业务组件中引入并调用，跟踪关键转化事件
 *
 * 示例：
 *   import { trackEvent } from '@/components/analytics/GoogleAnalytics';
 *   trackEvent('inquiry_submit', { locale: 'zh', product: 'IR LED' });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;
  window.gtag('event', eventName, params);
}

// 扩展 window 类型（TypeScript 兼容）
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
