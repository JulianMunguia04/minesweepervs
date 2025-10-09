import './globals.css';
import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href='Minesweepervslogo.png' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MinesweeperVs</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.cdnfonts.com/css/common-pixel" 
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
                
      </head>
      <body style={{position: "relative", minHeight: "100vh"}}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
        <img src="/gaemtiem-logo.png" style={{position:"absolute", bottom: "2vh", right: "2vh", width: "10vh"}}>
        </img>
      </body>
    </html>
  );
}
