'use client';

import { useState, FormEvent } from 'react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface ProductOption {
  id: string;
  name: Record<string, string>;
}

interface InquiryFormProps {
  locale: string;
  messages: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    country: string;
    products: string;
    quantity: string;
    message: string;
    submit: string;
    selectCountry: string;
    selectQuantity: string;
    quantityOptions: {
      '1k-10k': string;
      '10k-50k': string;
      '50k-100k': string;
      '100k+': string;
    };
    placeholder: {
      email: string;
      phone: string;
      message: string;
    };
    submitStatus: {
      sending: string;
      success: string;
      error: string;
    };
  };
  productOptions: ProductOption[];
}

export default function InquiryForm({ locale, messages, productOptions }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    products: [] as string[],
    quantity: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      products: checked
        ? [...prev.products, productId]
        : prev.products.filter(p => p !== productId),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // GA4 转化跟踪：询盘提交成功
        trackEvent('inquiry_submit', {
          locale,
          product_count: formData.products.length,
          quantity: formData.quantity,
          country: formData.country,
        });
        // 重置表单
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          country: '',
          products: [],
          quantity: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = [
    { value: 'malaysia', label: locale === 'zh' ? '马来西亚' : 'Malaysia' },
    { value: 'indonesia', label: locale === 'zh' ? '印尼' : 'Indonesia' },
    { value: 'thailand', label: locale === 'zh' ? '泰国' : 'Thailand' },
    { value: 'vietnam', label: locale === 'zh' ? '越南' : 'Vietnam' },
    { value: 'singapore', label: locale === 'zh' ? '新加坡' : 'Singapore' },
    { value: 'philippines', label: locale === 'zh' ? '菲律宾' : 'Philippines' },
    { value: 'uae', label: locale === 'zh' ? '阿联酋' : 'UAE' },
    { value: 'saudi-arabia', label: locale === 'zh' ? '沙特阿拉伯' : 'Saudi Arabia' },
    { value: 'other', label: locale === 'zh' ? '其他' : 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {messages.submitStatus.success}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {messages.submitStatus.error}
        </div>
      )}

      {/* Company & Contact Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {messages.companyName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={messages.companyName}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {messages.contactName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={messages.contactName}
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {messages.email} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={messages.placeholder.email}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {messages.phone} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={messages.placeholder.phone}
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.country} <span className="text-red-500">*</span>
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{messages.selectCountry}</option>
          {countryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Products of Interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {messages.products}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productOptions.map((product) => (
            <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={product.id}
                checked={formData.products.includes(product.id)}
                onChange={(e) => handleProductChange(product.id, e.target.checked)}
                className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{product.name[locale] || product.name.en}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.quantity}
        </label>
        <select
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{messages.selectQuantity}</option>
          <option value="1k-10k">{messages.quantityOptions['1k-10k']}</option>
          <option value="10k-50k">{messages.quantityOptions['10k-50k']}</option>
          <option value="50k-100k">{messages.quantityOptions['50k-100k']}</option>
          <option value="100k+">{messages.quantityOptions['100k+']}</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.message}
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={messages.placeholder.message}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-900 hover:bg-blue-800 text-white'
        }`}
      >
        {isSubmitting ? messages.submitStatus.sending : messages.submit}
      </button>
    </form>
  );
}
