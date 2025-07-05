import './globals.css';
import SocketInitializer from './SocketIntializer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minesweeper VS',
  description: 'Multiplayer Minesweeper built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SocketInitializer /> {/* Triggers on any route connection */}
        {children}
      </body>
    </html>
  );
}
