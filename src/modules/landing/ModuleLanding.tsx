/**
 * Module Landing Page - Apple-inspired Design
 * Página de landing específica para cada módulo
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
  Shield,
  Zap,
  Globe,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Clock,
  Rocket,
  Star,
} from 'lucide-react';
import { AuthModal } from '../../components/shared/AuthModal';

type ModuleType = 'shop' | 'class' | 'work' | 'social';

interface ModuleLandingProps {
  module: ModuleType;
}

const moduleConfig = {
  shop: {
    icon: ShoppingBag,
    title: 'Shop',
    headline: 'Venda sem limites.',
    subheadline: 'Marketplace completo para seus produtos.',
    description:
      'Transforme sua paixão em lucro. Venda produtos físicos ou digitais com uma vitrine profissional.',
    gradient: 'from-emerald-400 to-teal-500',
    features: [
      { icon: Shield, title: 'Compra Protegida', desc: 'Garantia em todas as transações' },
      { icon: TrendingUp, title: 'Vitrine Pro', desc: 'Apresente seus produtos com estilo' },
      { icon: BarChart3, title: 'Analytics', desc: 'Insights de vendas em tempo real' },
      { icon: Globe, title: 'Alcance Global', desc: 'Venda para qualquer lugar' },
    ],
    stats: [
      { value: '2.5M+', label: 'Produtos vendidos' },
      { value: '50K+', label: 'Vendedores' },
      { value: '99.8%', label: 'Satisfação' },
    ],
  },
  class: {
    icon: GraduationCap,
    title: 'Class',
    headline: 'Conhecimento que transforma.',
    subheadline: 'Aprenda. Ensine. Cresça.',
    description:
      'Aprenda com os melhores ou compartilhe seu conhecimento. Cursos de qualidade para todos.',
    gradient: 'from-blue-400 to-indigo-500',
    features: [
      { icon: Clock, title: 'Seu Ritmo', desc: 'Acesso vitalício aos cursos' },
      { icon: Award, title: 'Certificados', desc: 'Reconhecimento oficial' },
      { icon: Target, title: 'Trilhas', desc: 'Caminhos personalizados' },
      { icon: Users, title: 'Comunidade', desc: 'Conecte-se com outros alunos' },
    ],
    stats: [
      { value: '50K+', label: 'Alunos ativos' },
      { value: '2K+', label: 'Cursos' },
      { value: '4.9', label: 'Avaliação' },
    ],
  },
  work: {
    icon: Briefcase,
    title: 'Work',
    headline: 'Produtividade elevada.',
    subheadline: 'Projetos. Tarefas. Resultados.',
    description:
      'Encontre freelancers qualificados ou ofereça seus serviços. O marketplace que conecta.',
    gradient: 'from-purple-400 to-pink-500',
    features: [
      { icon: Target, title: 'Profissionais', desc: 'Freelancers verificados' },
      { icon: Shield, title: 'Pagamento Seguro', desc: 'Só pague quando aprovar' },
      { icon: Star, title: 'Avaliações', desc: 'Feedback real' },
      { icon: Clock, title: 'Entrega', desc: 'Prazos garantidos' },
    ],
    stats: [
      { value: '25K+', label: 'Freelancers' },
      { value: '100K+', label: 'Projetos' },
      { value: '4.8', label: 'Avaliação' },
    ],
  },
  social: {
    icon: Users,
    title: 'Social',
    headline: 'Conexões que importam.',
    subheadline: 'Sua rede. Seu alcance.',
    description:
      'Construa sua rede, compartilhe conteúdo e alcance seu público. Networking inteligente.',
    gradient: 'from-orange-400 to-red-500',
    features: [
      { icon: Users, title: 'Networking', desc: 'Conecte-se com profissionais' },
      { icon: Zap, title: 'Feed Inteligente', desc: 'Conteúdo relevante' },
      { icon: Target, title: 'Oportunidades', desc: 'Descubra possibilidades' },
      { icon: Rocket, title: 'Crescimento', desc: 'Expanda sua audiência' },
    ],
    stats: [
      { value: '100K+', label: 'Conexões' },
      { value: '1M+', label: 'Posts/mês' },
      { value: '95%', label: 'Engajamento' },
    ],
  },
};

export const ModuleLanding: React.FC<ModuleLandingProps> = ({ module }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const config = moduleConfig[module];
  const Icon = config.icon;

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
    { id: 'shop', title: 'Shop' },
    { id: 'class', title: 'Class' },
    { id: 'work', title: 'Work' },
    { id: 'social', title: 'Social' },
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
              onClick={() => navigate('/')}
              className="text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                T
              </div>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {modules.map(m => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/${m.id}`)}
                  className={`text-xs font-normal transition-opacity ${
                    module === m.id
                      ? 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                  }`}
                >
                  {m.title}
                </button>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-12 bg-white dark:bg-black overflow-hidden">
        <div className="relative z-10 max-w-[980px] mx-auto text-center">
          {/* Module Icon */}
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-[28px] bg-gradient-to-br ${config.gradient} text-white shadow-2xl mb-8`}
          >
            <Icon size={48} strokeWidth={1.5} />
          </div>

          {/* Module Title */}
          <p className="text-[17px] font-semibold text-[#86868b] uppercase tracking-wide mb-4">
            Tymes {config.title}
          </p>

          {/* Main Headline */}
          <h1 className="text-[56px] sm:text-[80px] lg:text-[96px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
            {config.headline}
          </h1>

          {/* Subheadline */}
          <p className="mt-2 text-[28px] sm:text-[32px] lg:text-[40px] font-semibold tracking-tight leading-[1.1] text-[#1d1d1f] dark:text-[#f5f5f7]">
            {config.subheadline}
          </p>

          {/* Description */}
          <p className="mt-6 text-[17px] sm:text-[21px] font-normal leading-[1.4] text-[#86868b] max-w-[600px] mx-auto">
            {config.description}
          </p>

          {/* CTA Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => openAuth('signup')}
              className="group flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
            >
              Começar agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-1 text-[17px] sm:text-[21px] font-normal text-[#0066cc] hover:underline transition-all"
            >
              Saiba mais
              <ChevronDown size={20} />
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
            {config.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {stat.value}
                </div>
                <div className="text-[14px] text-[#86868b]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-[#86868b]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#f5f5f7] dark:bg-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Recursos poderosos.
            </h2>
            <p className="mt-2 text-[24px] sm:text-[28px] font-semibold tracking-tight text-[#86868b]">
              Tudo que você precisa em um só lugar.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {config.features.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-[20px] bg-white dark:bg-black transition-all hover:scale-[1.02]"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} text-white mb-6`}
                >
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[24px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[17px] text-[#86868b] leading-[1.4]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white dark:bg-black">
        <div className="max-w-[980px] mx-auto text-center">
          <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Pronto para começar com {config.title}?
          </h2>
          <p className="mt-4 text-[21px] font-normal leading-[1.4] text-[#86868b] max-w-[600px] mx-auto">
            Junte-se a milhares de usuários que já estão transformando seus resultados.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="px-8 py-3 rounded-full bg-[#0066cc] text-white text-[17px] font-normal hover:bg-[#0055b3] transition-colors"
            >
              Começar grátis
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-full text-[#0066cc] text-[17px] font-normal hover:underline transition-all"
            >
              Ver todos os módulos
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] dark:bg-[#1d1d1f] border-t border-[#d2d2d7] dark:border-[#424245]">
        <div className="max-w-[980px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#86868b]">
              © 2025 Tymes Platform. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-[12px]">
              <a
                href="#"
                className="text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                Termos
              </a>
              <a
                href="#"
                className="text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                Privacidade
              </a>
              <a
                href="#"
                className="text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        moduleName={config.title}
        moduleColor={config.gradient}
        redirectTo="/app"
        redirectState={{ openModule: module.toUpperCase() }}
      />
    </div>
  );
};
