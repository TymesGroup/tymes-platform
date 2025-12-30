/**
 * Landing Page - Tymes Platform
 * Design inspirado no estilo Apple: minimalista, elegante, tipografia SF Pro
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  ChevronDown,
} from 'lucide-react';
import { AuthModal } from '../../components/shared/AuthModal';
import { LandingFooter } from './components/LandingFooter';
import { AccountTypesSection } from './components/AccountTypesSection';

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const modules = [
    {
      id: 'shop',
      icon: ShoppingBag,
      title: 'Shop',
      headline: 'Venda sem limites.',
      subheadline: 'Marketplace completo para seus produtos.',
      description:
        'Vitrine profissional. Gestão de pedidos. Pagamentos integrados. Tudo que você precisa para vender online.',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'class',
      icon: GraduationCap,
      title: 'Class',
      headline: 'Conhecimento que transforma.',
      subheadline: 'Aprenda. Ensine. Cresça.',
      description:
        'Cursos em alta definição. Certificados reconhecidos. Área completa do professor. Educação sem fronteiras.',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'work',
      icon: Briefcase,
      title: 'Work',
      headline: 'Produtividade elevada.',
      subheadline: 'Projetos. Tarefas. Resultados.',
      description:
        'Gestão ágil de projetos. Colaboração em equipe. Controle de tempo. Entregue mais, com menos esforço.',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      id: 'social',
      icon: Users,
      title: 'Social',
      headline: 'Conexões que importam.',
      subheadline: 'Sua rede. Seu alcance.',
      description:
        'Feed inteligente. Mensagens em tempo real. Campanhas de marketing. Networking que gera resultados.',
      gradient: 'from-orange-400 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] antialiased">
      {/* Apple-style Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                T
              </div>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {modules.map(m => (
                <a
                  key={m.id}
                  href={`#${m.id}`}
                  className="text-xs font-normal text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-60 transition-opacity"
                >
                  {m.title}
                </a>
              ))}
            </div>

            {/* Auth Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => openAuth('login')}
                className="text-xs font-normal text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-60 transition-opacity"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="text-xs font-normal text-[#0066cc] hover:underline transition-all"
              >
                Começar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Apple Style */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-12 bg-white dark:bg-black overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f5f5f7] dark:to-[#1d1d1f] opacity-50" />

        <div className="relative z-10 max-w-[980px] mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-[56px] sm:text-[80px] lg:text-[96px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Tymes
          </h1>

          {/* Subheadline */}
          <p className="mt-2 text-[28px] sm:text-[32px] lg:text-[40px] font-semibold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Uma plataforma. Infinitas possibilidades.
          </p>

          {/* Description */}
          <p className="mt-6 text-[17px] sm:text-[21px] font-normal leading-[1.4] text-[#86868b] max-w-[600px] mx-auto">
            Vendas, educação, projetos e networking integrados. Escolha os módulos que você precisa.
          </p>

          {/* CTA Links - Apple Style */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => openAuth('signup')}
              className="group flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
            >
              Começar grátis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#shop"
              className="flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
            >
              Conhecer módulos
              <ChevronDown size={20} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-[#86868b]" />
        </div>
      </section>

      {/* Module Sections - Apple Product Style */}
      {modules.map((module, index) => (
        <section
          key={module.id}
          id={module.id}
          className={`relative min-h-screen flex flex-col items-center justify-center px-6 py-24 ${
            index % 2 === 0 ? 'bg-[#f5f5f7] dark:bg-[#1d1d1f]' : 'bg-white dark:bg-black'
          }`}
        >
          <div className="max-w-[980px] mx-auto text-center">
            {/* Module Icon */}
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-[22px] bg-gradient-to-br ${module.gradient} text-white shadow-lg mb-6`}
            >
              <module.icon size={40} strokeWidth={1.5} />
            </div>

            {/* Module Title */}
            <p className="text-[17px] font-semibold text-[#86868b] uppercase tracking-wide mb-2">
              {module.title}
            </p>

            {/* Headline */}
            <h2 className="text-[48px] sm:text-[56px] lg:text-[64px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
              {module.headline}
            </h2>

            {/* Subheadline */}
            <p className="mt-2 text-[24px] sm:text-[28px] font-semibold tracking-tight leading-[1.1] text-[#1d1d1f] dark:text-[#f5f5f7]">
              {module.subheadline}
            </p>

            {/* Description */}
            <p className="mt-6 text-[17px] sm:text-[21px] font-normal leading-[1.4] text-[#86868b] max-w-[600px] mx-auto">
              {module.description}
            </p>

            {/* CTA Links */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => openAuth('signup')}
                className="group flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
              >
                Começar com {module.title}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate(`/${module.id}`)}
                className="flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
              >
                Saiba mais
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* Account Types Section */}
      <AccountTypesSection onSignup={() => openAuth('signup')} />

      {/* Pricing Section - Apple Style */}
      <section id="pricing" className="py-24 px-6 bg-[#f5f5f7] dark:bg-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Preços simples.
            </h2>
            <p className="mt-2 text-[24px] sm:text-[28px] font-semibold tracking-tight text-[#86868b]">
              Comece grátis. Escale quando precisar.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'Grátis',
                period: '',
                description: 'Para começar',
                features: ['1 módulo ativo', 'Até 100 itens', 'Suporte por email'],
                highlighted: false,
              },
              {
                name: 'Pro',
                price: 'R$ 49',
                period: '/mês',
                description: 'Para profissionais',
                features: [
                  'Todos os módulos',
                  'Itens ilimitados',
                  'Suporte prioritário',
                  'Analytics avançado',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'R$ 199',
                period: '/mês',
                description: 'Para empresas',
                features: ['Tudo do Pro', 'Multi-usuários', 'SSO / SAML', 'Suporte 24/7'],
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-[20px] transition-all ${
                  plan.highlighted
                    ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-[#f5f5f7] dark:text-[#1d1d1f]'
                    : 'bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7]'
                }`}
              >
                <p className="text-[12px] font-semibold uppercase tracking-wide mb-2 text-[#86868b]">
                  {plan.name}
                </p>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[40px] font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-[17px] text-[#86868b]">{plan.period}</span>}
                </div>

                <p className="text-[14px] text-[#86868b] mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-[14px] flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          plan.highlighted
                            ? 'bg-[#f5f5f7] dark:bg-[#1d1d1f]'
                            : 'bg-[#1d1d1f] dark:bg-[#f5f5f7]'
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openAuth('signup')}
                  className="w-full py-3 rounded-full bg-[#0066cc] text-white text-[14px] font-semibold hover:bg-[#0055b3] transition-colors"
                >
                  {plan.price === 'Grátis' ? 'Começar grátis' : 'Assinar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Apple Style */}
      <section className="py-24 px-6 bg-white dark:bg-black">
        <div className="max-w-[980px] mx-auto text-center">
          <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-[21px] font-normal leading-[1.4] text-[#86868b] max-w-[600px] mx-auto">
            Junte-se a milhares de usuários que já estão transformando seus negócios com o Tymes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="px-8 py-3 rounded-full bg-[#0066cc] text-white text-[17px] font-normal hover:bg-[#0055b3] transition-colors"
            >
              Criar conta grátis
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-8 py-3 rounded-full text-[#0066cc] text-[17px] font-normal hover:underline transition-all"
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />

      {/* Auth Modal */}
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
