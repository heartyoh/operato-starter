'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { useTheme } from '@/hooks/use-theme';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-14 bg-gray-800 dark:bg-gray-900 text-white flex items-center justify-between px-4">
      <h1 className="text-lg font-bold">Operato Starter</h1>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        {/* Mobile: Hamburger icon */}
        <button
          className="md:hidden text-white hover:text-gray-300 p-2"
          onClick={onMenuClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-56 bg-gray-100 dark:bg-gray-800 p-4 space-y-2
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <nav className="space-y-1">
          <Link
            href="/"
            className="block hover:text-blue-500"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block hover:text-blue-500"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            href="/users"
            className="block hover:text-blue-500"
            onClick={onClose}
          >
            Users
          </Link>
          <Link
            href="/profile"
            className="block hover:text-blue-500"
            onClick={onClose}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block hover:text-blue-500"
            onClick={onClose}
          >
            Settings
          </Link>
        </nav>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="h-12 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      © 2025 Operato Starter
    </footer>
  );
}
