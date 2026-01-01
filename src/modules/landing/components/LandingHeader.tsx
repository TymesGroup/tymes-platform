/**
 * LandingHeader - Header compartilhado para páginas públicas
 * Design Apple-inspired
 */

import React, { useState, useEffect } from 'react';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

const modules = [
  { id: 'shop', title: 'Shop' },
  { id: 'class', title: 'Class' },
  { id: 'work', title: 'Work' },
  { id: 'social', title: 'Social' },
];

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl backdrop-saturate-150'
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <a
            href="/"
            className="text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              T
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {modules.map(m => (
              <a
                key={m.id}
                href={`/${m.id}`}
                className="text-xs font-normal text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-60 transition-opacity"
              >
                {m.title}
              </a>
            ))}
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={onLogin}
              className="text-xs font-normal text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-60 transition-opacity"
            >
              Entrar
            </button>
            <button
              onClick={onSignup}
              className="text-xs font-normal text-[#0066cc] hover:underline transition-all"
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
