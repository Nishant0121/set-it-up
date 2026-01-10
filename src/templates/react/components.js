export const getNavbar = (options) => {
  const { addRouter, addContext } = options;
  return `import React from 'react';
${addRouter ? `import { Link } from 'react-router-dom';` : ''}
${addContext ? `import { useAppContext } from '../context/AppContext';` : ''}

export function Navbar() {
  ${addContext ? `const { theme, toggleTheme } = useAppContext();` : ''}
  
  return (
    <nav className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">My App</h1>
      <div className="flex gap-4">
        ${addRouter ? `
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Home</Link>
        <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">About</Link>
        ` : ''}
        ${addContext ? `
        <button onClick={toggleTheme} className="px-3 py-1 bg-gray-200 rounded text-sm">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        ` : ''}
      </div>
    </nav>
  );
}
`;
};

export const getLayout = (options) => {
  const { addRouter } = options;
  return `import React from 'react';
import { Navbar } from './Navbar';
${addRouter ? `import { Outlet } from 'react-router-dom';` : ''}

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans">
      <Navbar />
      <main className="container mx-auto p-4">
        ${addRouter ? `<Outlet />` : `<div className="text-center p-10">Outlet requires Router</div>`}
      </main>
    </div>
  );
}
`;
};
