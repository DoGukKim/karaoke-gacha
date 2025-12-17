import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/infrastructure/providers/QueryProvider';
import { TDSProvider } from '@/infrastructure/providers/TDSProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '노래방 애창곡 뽑기',
  description: '코노 필수템! 랜덤 노래 뽑기',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <QueryProvider>
            <TDSProvider>{children}</TDSProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  );
}
