import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'YouTube Activity Analyzer',
  description: 'Analyze your YouTube watch history from Google Takeout',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#CC0000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* YouTube Icon */}
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold gradient-text truncate">YouTube Activity Analyzer</h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Phân tích lịch sử xem YouTube từ Google Takeout</p>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 text-center text-gray-500 text-xs sm:text-sm">
              YouTube Activity Analyzer - Built with Next.js & React
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
