import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GOPRO LED - Professional LED Manufacturer',
  description: 'Leading manufacturer of IR LEDs, Visible Light LEDs, and UV LEDs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
