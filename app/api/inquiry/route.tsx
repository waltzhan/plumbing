import { NextRequest, NextResponse } from 'next/server';
import { sendInquiryNotification } from '@/lib/notification/wechat';
import { saveInquiryToSanity } from '@/lib/sanity/inquiry';

// 产品选项映射
const productLabels: Record<string, Record<string, string>> = {
  'ir-led': { en: 'IR LED', zh: '红外LED', id: 'LED IR', th: 'LED อินฟราเรด', vi: 'LED Hồng ngoại', ar: 'LED الأشعة تحت الحمراء' },
  'visible-led': { en: 'Visible LED', zh: '可见光LED', id: 'LED Cahaya Terlihat', th: 'LED แสงที่มองเห็นได้', vi: 'LED Ánh sáng nhìn thấy', ar: 'LED الضوء المرئي' },
  'uv-led': { en: 'UV LED', zh: '紫外LED', id: 'LED UV', th: 'LED UV', vi: 'LED UV', ar: 'LED UV' },
  'other': { en: 'Other', zh: '其他', id: 'Lainnya', th: 'อื่นๆ', vi: 'Khác', ar: 'أخرى' },
};

// GET 方法用于测试 API 是否正常工作
export async function GET() {
  return NextResponse.json({ 
    status: 'API is working - WeChat + Sanity VERSION',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactName,
      email,
      phone,
      country,
      products,
      quantity,
      message,
      locale = 'zh',
    } = body;

    // 验证必填字段
    if (!companyName || !contactName || !email || !phone || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 格式化产品兴趣
    const productNames = (products || [])
      .map((p: string) => productLabels[p]?.[locale] || productLabels[p]?.en || p)
      .join(', ');

    // 国家名称映射
    const countryNames: Record<string, Record<string, string>> = {
      malaysia: { en: 'Malaysia', zh: '马来西亚' },
      indonesia: { en: 'Indonesia', zh: '印尼' },
      thailand: { en: 'Thailand', zh: '泰国' },
      vietnam: { en: 'Vietnam', zh: '越南' },
      singapore: { en: 'Singapore', zh: '新加坡' },
      philippines: { en: 'Philippines', zh: '菲律宾' },
      uae: { en: 'UAE', zh: '阿联酋' },
      'saudi-arabia': { en: 'Saudi Arabia', zh: '沙特阿拉伯' },
      other: { en: 'Other', zh: '其他' },
    };
    const countryName = countryNames[country]?.[locale] || countryNames[country]?.en || country;

    // 准备询单数据
    const inquiryData = {
      companyName,
      contactName,
      email,
      phone,
      country: countryName,
      products: products || [],
      quantity: quantity || '',
      message: message || '',
      locale,
    };

    // 并行发送企业微信通知和保存到 Sanity
    const [wechatResult, sanityResult] = await Promise.all([
      sendInquiryNotification(inquiryData),
      saveInquiryToSanity(inquiryData),
    ]);

    console.log('Notification results:', {
      wechat: wechatResult,
      sanity: sanityResult,
    });

    // 即使通知失败，也返回成功（因为数据已保存到 Sanity）
    return NextResponse.json({ 
      success: true,
      notifications: {
        wechat: wechatResult,
        sanity: sanityResult,
      },
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
