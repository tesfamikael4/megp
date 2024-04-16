import './globals.css';
import type { Metadata } from 'next';
import { config } from '@/config/env';
import { ConfigProvider } from '@/contexts/config';
import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';
import { AuthProvider } from '@megp/auth/src/context/auth.context';
import { Inter, Nunito } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'MANEPS',
  description: 'Malawi National Electronic Procurement System',
  icons: {
    icon: '/favicon/android-chrome-512x512.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${inter.className}`}>
        <ConfigProvider config={config}>
          <Providers>
            <RootStyleRegistry>
              <AuthProvider>{children}</AuthProvider>
            </RootStyleRegistry>
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
