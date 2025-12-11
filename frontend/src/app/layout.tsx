import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker - Manage Your Finances',
  description: 'A comprehensive expense tracking application to manage your personal finances with ease',
  keywords: ['expense tracker', 'finance', 'money management', 'budgeting', 'personal finance'],
  authors: [{ name: 'Expense Tracker Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900 antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <div id="root" className="h-full">
            {children}
          </div>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
              maxWidth: '500px',
            },
            // Default options for specific types
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
              style: {
                border: '1px solid #22c55e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Portal for modals and overlays */}
        <div id="portal" />
        </ThemeProvider>
      </body>
    </html>
  );
}
