'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  mainImageUrl: string | null;
  galleryImages: string[];
  productName: string;
  productModel?: string;
}

export default function ProductImageGallery({
  mainImageUrl,
  galleryImages,
  productName,
  productModel,
}: ProductImageGalleryProps) {
  // 合并主图和 gallery 图片，主图放在第一位
  const allImages = mainImageUrl 
    ? [mainImageUrl, ...galleryImages.filter(url => url !== mainImageUrl)]
    : galleryImages;
  
  const [selectedImage, setSelectedImage] = useState<string | null>(allImages[0] || null);

  // 如果没有图片，显示占位符
  if (allImages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center min-h-[360px]">
        <div className="text-center">
          <svg className="w-32 h-32 mx-auto mb-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xl font-bold text-gray-300">{productModel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center min-h-[360px]">
        {selectedImage ? (
          <div className="relative w-full aspect-square">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-32 h-32 mx-auto mb-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl font-bold text-gray-300">{productModel}</p>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((imgUrl, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedImage(imgUrl)}
              className={`bg-white rounded-lg shadow-sm p-2 aspect-square relative cursor-pointer hover:shadow-md transition-shadow ${
                selectedImage === imgUrl ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="150px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
