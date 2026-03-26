import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function StudioInfoPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isZh = locale === 'zh';
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isZh ? 'CMS 后台管理' : 'CMS Admin'}
        </h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              {isZh ? '配置说明' : 'Setup Instructions'}
            </h2>
            <p className="text-gray-700 mb-4">
              {isZh 
                ? '要使用CMS后台，您需要先创建Sanity项目并配置环境变量。'
                : 'To use the CMS, you need to create a Sanity project and configure environment variables.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {isZh ? '步骤 1: 创建Sanity项目' : 'Step 1: Create Sanity Project'}
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>{isZh ? '访问' : 'Visit'} <a href="https://www.sanity.io/manage" target="_blank" className="text-blue-600 hover:underline">sanity.io/manage</a> {isZh ? '注册账号' : 'to register'}</li>
              <li>{isZh ? '创建新项目' : 'Create a new project'}</li>
              <li>{isZh ? '获取 Project ID' : 'Get your Project ID'}</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {isZh ? '步骤 2: 配置环境变量' : 'Step 2: Configure Environment Variables'}
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 text-sm">
              <code className="text-green-400">
                NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id<br/>
                NEXT_PUBLIC_SANITY_DATASET=production<br/>
                SANITY_API_TOKEN=your_token
              </code>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {isZh ? '步骤 3: 启动Studio' : 'Step 3: Start Studio'}
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 text-sm">
              <code className="text-yellow-400">
                npx sanity@latest dev
              </code>
            </div>
            <p className="text-gray-600 text-sm">
              {isZh ? '然后访问' : 'Then visit'} http://localhost:3333
            </p>
          </div>

          <div className="pt-4 border-t">
            <Link 
              href={`/${locale}`}
              className="text-blue-600 hover:underline"
            >
              ← {isZh ? '返回首页' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
