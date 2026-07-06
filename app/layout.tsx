import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CricCard — Your FIFA-Style Sports Card',
  description: 'Generate premium sports cards for cricket, football, and badminton. Share your stats like a pro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1a1a2e', color: '#fff', border: '1px solid #FFD700' },
            success: { iconTheme: { primary: '#FFD700', secondary: '#1a1a2e' } },
          }}
        />
      </body>
    </html>
  );
}
