import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Operato Starter',
  description: 'Example Layout scaffold',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="h-14 bg-gray-800 text-white flex items-center px-4">
      <h1 className="text-lg font-bold">Operato Starter</h1>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="w-56 bg-gray-100 p-4 space-y-2">
      <nav className="space-y-1">
        <Link href="/" className="block hover:text-blue-500">
          Home
        </Link>
        <Link href="/dashboard" className="block hover:text-blue-500">
          Dashboard
        </Link>
        <Link href="/users" className="block hover:text-blue-500">
          Users
        </Link>
        <Link href="/profile" className="block hover:text-blue-500">
          Profile
        </Link>
        <Link href="/settings" className="block hover:text-blue-500">
          Settings
        </Link>
      </nav>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="h-12 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
      © 2025 Operato Starter
    </footer>
  );
}
