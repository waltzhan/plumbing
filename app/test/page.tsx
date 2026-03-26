import { headers } from 'next/headers';
import { unstable_noStore } from 'next/cache';

export default async function TestPage() {
  unstable_noStore();
  
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const userAgent = headersList.get('user-agent');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>调试信息</h1>
      <pre>{JSON.stringify({
        acceptLanguage,
        userAgent,
        timestamp: new Date().toISOString(),
      }, null, 2)}</pre>
    </div>
  );
}
