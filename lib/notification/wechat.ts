/**
 * 企业微信通知模块
 * 用于发送询单实时通知到企业微信群
 */

interface InquiryData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  products?: string[];
  quantity?: string;
  message?: string;
  locale?: string;
}

/**
 * 发送询单通知到企业微信
 */
export async function sendInquiryNotification(data: InquiryData): Promise<boolean> {
  const webhookUrl = process.env.WECHAT_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('WECHAT_WEBHOOK_URL is not configured');
    return false;
  }

  // 产品名称映射
  const productLabels: Record<string, string> = {
    'ir-led': '红外LED',
    'visible-led': '可见光LED',
    'uv-led': '紫外LED',
    'other': '其他',
  };

  const productNames = data.products?.map(p => productLabels[p] || p).join('、') || '未选择';

  // 构建消息内容
  const content = `🎯 **新询单提醒**

📋 **公司信息**
• 公司名称：${data.companyName}
• 联系人：${data.contactName}
• 国家/地区：${data.country}

📞 **联系方式**
• 邮箱：${data.email}
• 电话：${data.phone}

💡 **产品需求**
• 感兴趣的产品：${productNames}
• 预计采购数量：${data.quantity || '未填写'}

📝 **详细需求**
${data.message || '无'}

⏰ 提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

请及时跟进！`;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WeChat webhook error:', errorText);
      return false;
    }

    const result = await response.json();
    
    if (result.errcode !== 0) {
      console.error('WeChat API error:', result);
      return false;
    }

    console.log('WeChat notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send WeChat notification:', error);
    return false;
  }
}
