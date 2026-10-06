import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@xyflow/react/dist/style.css';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { CommandPalette } from '@/components/command/CommandPalette';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NEXUS — Personal Developer Command Center',
  description:
    'A polished personal developer dashboard and interactive universe graph connecting software projects, GitHub activity, and milestones.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/icon.svg' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = localStorage.getItem('nexus-settings');
                if (s) {
                  var p = JSON.parse(s);
                  if (p.theme === 'light') {
                    document.documentElement.classList.add('light-theme');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="h-full flex flex-col bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-200 overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 flex flex-col relative z-10 overflow-hidden">
          {children}
        </main>
        <CommandPalette />
      </body>
    </html>
  );
}
