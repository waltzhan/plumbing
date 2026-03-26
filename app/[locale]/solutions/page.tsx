import { redirect } from 'next/navigation';

/**
 * 解决方案页面 - 临时重定向到联系页面
 * TODO: 后续需要设计完整的解决方案展示页面
 */
export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 临时重定向到联系页面
  redirect(`/${locale}/contact`);
}
