import type { Metadata, Viewport } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['vietnamese'], variable: '--font-sans' });
const merriweather = Merriweather({
  subsets: ['vietnamese'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});
import Header from '@/components/Header';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Góc Nhỏ Lắng Nghe — Tư vấn tâm lý học đường',
  description: 'Hệ thống tư vấn tâm lý học đường số hóa — kín đáo, ẩn danh, luôn sẵn sàng 24/7 cho học sinh TRƯỜNG PHỔ THÔNG DÂN TỘC NỘI TRÚ, PHƯỜNG HÀM THẮNG, LÂM ĐỒNG.',
  keywords: ['tư vấn tâm lý', 'học đường', 'học sinh', 'sức khỏe tâm thần'],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'GócNhỏ', statusBarStyle: 'default' },
  openGraph: {
    type: 'website',
    title: 'Góc Nhỏ Lắng Nghe',
    description: 'Không gian an toàn để học sinh chia sẻ và nhận hỗ trợ tâm lý',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
      </head>
      <body>
        <Providers>
          <Header />
          <main style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
