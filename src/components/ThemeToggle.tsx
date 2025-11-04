'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
      title={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
    >
      {theme === 'light' ? (
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 1-21.21 0c-.425 0-.817-.22-1.179-.6a8.954 8.954 0 0 1-.88-2.657A3.301 3.301 0 0 1-1.94-2.61 3.11 3.11 0 0 1 .465-2.157M15 8a3 3 0 0 1 0 6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 9a3 3 0 1 1 0 6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657A8.954 8.954 0 0 1 19.21 13.21 3 3 0 0 0-1.179-.6a8.954 8.954 0 0 1-.88-2.657A3.301 3.301 0 0 1-1.94-2.61 3.11 3.11 0 0 1 .465-2.157M15 8a3 3 0 0 1 0 6"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m5.636 5.636l.707.707m2.828-2.828a1 1 0 1 1.414 0l-.707.707M6.343 6.343a1 1 0 1 1.414 0l3.172 3.172a1 1 0 1 1.414 0l-3.172-3.172m6.586 6.586a1 1 0 1 1.414 0l6.586 6.586a1 1 0 1 1.414 0l-6.586-6.586"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 21h6m-6 0h6"
          />
        </svg>
      )}
    </button>
  );
}