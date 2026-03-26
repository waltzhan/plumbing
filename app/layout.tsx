import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'bojet - Professional Plumbing Manufacturer',
  description: 'Leading manufacturer of faucets, shower systems, and bathroom accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://019d2a59-5bac-77cd-8801-21ae630c0e22.spst2.com/ustat.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
