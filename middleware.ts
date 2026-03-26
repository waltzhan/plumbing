import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

// 浏览器语言到网站语言的映射（全部小写）
const browserLocaleMap: Record<string, string> = {
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'id': 'id',
  'ms': 'id',
  'th': 'th',
  'vi': 'vi',
  'ar': 'ar',
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
};

function getBrowserLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].trim().toLowerCase();
      const q = parts[1] ? parseFloat(parts[1].replace('q=', '')) : 1.0;
      return { code, priority: isNaN(q) ? 1.0 : q };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const { code } of languages) {
    if (browserLocaleMap[code]) return browserLocaleMap[code];
    const prefix = code.split('-')[0];
    if (browserLocaleMap[prefix]) return browserLocaleMap[prefix];
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理根路径
  if (pathname !== '/') {
    return NextResponse.next();
  }

  // 检测浏览器语言并重定向
  const browserLocale = getBrowserLocale(request);
  const newUrl = new URL(`/${browserLocale}`, request.url);

  // 使用 302 临时重定向，并禁用缓存
  const response = NextResponse.redirect(newUrl, 302);
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  matcher: ['/'],
};
