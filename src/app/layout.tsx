import LayoutProvider from '@/providers/layout-provider';
import ThemeProvider from '@/providers/theme-providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Parche Chat',
  description: 'David friends and family chat app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/sign-in'>
      <html lang='en' className={`${montserrat.className} font-sans`}>
        <body>
          <AntdRegistry>
            <LayoutProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </LayoutProvider>
          </AntdRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
