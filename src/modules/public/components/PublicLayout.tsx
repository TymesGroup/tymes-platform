/**
 * PublicLayout - Layout compartilhado para páginas públicas
 * Inclui header e footer consistentes com a landing page
 * Inclui modal de autenticação igual à landing page
 */

import React, { useEffect, useState } from 'react';
import { LandingHeader } from '../../landing/components/LandingHeader';
import { LandingFooter } from '../../landing/components/LandingFooter';
import { AuthModal } from '../../../components/shared/AuthModal';

interface PublicLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, title }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col">
      {/* Header - Same as landing page */}
      <LandingHeader onLogin={() => openAuth('login')} onSignup={() => openAuth('signup')} />

      {/* Main Content - with padding for fixed header */}
      <main className="flex-1 pt-12">
        {title && (
          <div className="bg-gradient-to-b from-[#f5f5f7] to-white dark:from-[#1d1d1f] dark:to-black py-16">
            <div className="max-w-[980px] mx-auto px-6">
              <h1 className="text-[48px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] text-center">
                {title}
              </h1>
            </div>
          </div>
        )}
        <div className="max-w-[980px] mx-auto px-6 py-12">{children}</div>
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Auth Modal - Same as landing page */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        moduleColor="from-indigo-600 to-purple-600"
        redirectTo="/app"
      />
    </div>
  );
};
