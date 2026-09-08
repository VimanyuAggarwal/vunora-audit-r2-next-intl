import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { VunoraSiteCode } from './vunora-site-code';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <VunoraSiteCode slot="head" />
        {children}
        <Analytics />
        <VunoraSiteCode slot="body-end" />
      </body>
    </html>
  );
}
