'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, locales, localeNames, rtlLocales } from '@/lib/i18n/config';

interface NavbarProps {
  locale: Locale;
  messages: {
    navigation: {
      home: string;
      products: string;
      solutions: string;
      about: string;
      support: string;
      contact: string;
      inquiry: string;
      language: string;
      news: string;
    };
    common: {
      language: string;
    };
  };
}

export default function Navbar({ locale, messages }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = rtlLocales.includes(locale);

  // 语言切换时保存 cookie
  const handleLanguageChange = (newLocale: Locale) => {
    // 设置 cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setIsLangMenuOpen(false);
  };

  // 获取当前路径（不含locale前缀）
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      return '/' + segments.slice(2).join('/');
    }
    return pathname;
  };

  const currentPath = getPathWithoutLocale() || '/';

  // 生成带locale的链接
  const getLocalizedHref = (path: string) => {
    if (path === '/') {
      return `/${locale}`;
    }
    return `/${locale}${path}`;
  };

  const navItems = [
    { href: '/', label: messages.navigation.home },
    { href: '/products', label: messages.navigation.products },
    { href: '/news', label: messages.navigation.news },
    { href: '/about', label: messages.navigation.about },
    { href: '/contact', label: messages.navigation.contact },
  ];

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={getLocalizedHref('/')} className="flex items-center">
              <span className="text-2xl font-bold text-blue-900">BOJET</span>
              <span className="text-2xl font-bold text-cyan-500 ml-1">卫浴</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getLocalizedHref(item.href)}
                className={`text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === item.href ? 'text-blue-900 bg-blue-50' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span className="text-lg">🌐</span>
                <span>{localeNames[locale]}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  {locales.map((loc) => (
                    <Link
                      key={loc}
                      href={`/${loc}${currentPath}`}
                      className={`block px-4 py-2 text-sm ${
                        locale === loc
                          ? 'bg-blue-50 text-blue-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleLanguageChange(loc as Locale)}
                    >
                      {localeNames[loc as Locale]}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={getLocalizedHref('/contact')}
              className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              {messages.navigation.inquiry}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-900 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getLocalizedHref(item.href)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  currentPath === item.href
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="border-t pt-2 mt-2">
              <p className="px-3 py-2 text-sm font-medium text-gray-500">🌐 {messages.navigation.language || 'Language'}</p>
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}${currentPath}`}
                  className={`block px-3 py-2 text-sm ${
                    locale === loc
                      ? 'text-blue-900 bg-blue-50 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {localeNames[loc as Locale]}
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="pt-2">
              <Link
                href={getLocalizedHref('/contact')}
                className="block w-full text-center bg-blue-900 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {messages.navigation.inquiry}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
