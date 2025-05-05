import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Prompt Öğrenme Platformu",
  description: "Prompt mühendisliği öğrenme ve pratik yapma platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.variable + ' font-sans antialiased'} suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{
            margin: '12px'
          }}
          toastOptions={{
            duration: 8000,
            style: {
              maxWidth: '400px',
              background: 'rgb(31 41 55 / 0.95)',
              color: '#e5e7eb',
              border: '1px solid rgb(75 85 99 / 0.5)',
              boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.3), 0 4px 8px -2px rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.5',
            },
            success: {
              duration: 8000,
              style: {
                background: 'rgb(6 78 59 / 0.8)',
                border: '1px solid rgb(6 95 70 / 0.5)',
                color: '#d1fae5',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#022c22',
              },
            },
            error: {
              duration: 10000,
              style: {
                background: 'rgb(127 29 29 / 0.8)',
                border: '1px solid rgb(153 27 27 / 0.5)',
                color: '#fee2e2',
              },
              iconTheme: {
                primary: '#f87171',
                secondary: '#450a0a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
