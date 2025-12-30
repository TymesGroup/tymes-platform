/**
 * Landing Page Premium - Tymes Platform
 * Design moderno, sofisticado e focado em conversão
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Check,
  Menu,
  X,
  Play,
  Star,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Building2,
  User,
  Rocket,
  Target,
  BarChart3,
  Lock,
} from 'lucide-react';
import { AuthModal } from '../../components/shared/AuthModal';

interface LandingProps {
  onEnter: () => void;
}

type ModuleType = 'shop' | 'class' | 'work' | 'social';
type AccountTab = 'personal' | 'business';

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>('personal');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const modules = [
    {
      id: 'shop' as ModuleType,
      icon: ShoppingBag,
      title: 'Shop',
      tagline: 'Venda sem limites',
      description:
        'Marketplace completo com vitrine profissional, gestão de pedidos e pagamentos integrados.',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      stats: { value: '2.5M+', label: 'produtos vendidos' },
      personalBenefit: 'Compre de vendedores verificados com proteção total',
      businessBenefit: 'Escale suas vendas com ferramentas profissionais',
    },
    {
      id: 'class' as ModuleType,
      icon: GraduationCap,
      title: 'Class',
      tagline: 'Conhecimento que transforma',
      description: 'Plataforma de ensino com cursos, certificados e área completa do professor.',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      stats: { value: '50K+', label: 'alunos ativos' },
      personalBenefit: 'Aprenda no seu ritmo com os melhores instrutores',
      businessBenefit: 'Monetize seu conhecimento e construa sua audiência',
    },
    {
      id: 'work' as ModuleType,
      icon: Briefcase,
      title: 'Work',
      tagline: 'Produtividade elevada',
      description:
        'Gestão de projetos ágil com tarefas, colaboração em equipe e controle de horas.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      stats: { value: '10K+', label: 'projetos gerenciados' },
      personalBenefit: 'Organize suas tarefas e aumente sua produtividade',
      businessBenefit: 'Gerencie equipes e projetos com visibilidade total',
    },
    {
      id: 'social' as ModuleType,
      icon: Users,
      title: 'Social',
      tagline: 'Conexões que importam',
      description: 'Rede profissional com feed, mensagens em tempo real e campanhas de marketing.',
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      stats: { value: '100K+', label: 'conexões feitas' },
      personalBenefit: 'Expanda sua rede e descubra oportunidades',
      businessBenefit: 'Alcance seu público com campanhas direcionadas',
    },
  ];

  const testimonials = [
    {
      name: 'Marina Silva',
      role: 'Empreendedora',
      avatar: 'M',
      text: 'O Tymes transformou meu negócio. Em 3 meses, tripliquei minhas vendas.',
      rating: 5,
    },
    {
      name: 'Carlos Mendes',
      role: 'Professor',
      avatar: 'C',
      text: 'Finalmente uma plataforma que entende as necessidades de quem ensina.',
      rating: 5,
    },
    {
      name: 'Ana Beatriz',
      role: 'Freelancer',
      avatar: 'A',
      text: 'Organização e produtividade em um só lugar. Recomendo demais!',
      rating: 5,
    },
  ];

  const metrics = [
    { value: '500K+', label: 'Usuários ativos', icon: Users },
    { value: '99.9%', label: 'Uptime garantido', icon: Shield },
    { value: '< 100ms', label: 'Tempo de resposta', icon: Zap },
    { value: '150+', label: 'Países atendidos', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-x-hidden">
      {/* Premium Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                  T
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-20 blur transition-opacity" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                Tymes
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {modules.map(m => (
                <a
                  key={m.id}
                  href={`#${m.id}`}
                  className={`px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-${m.color}-600 dark:hover:text-${m.color}-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all`}
                >
                  {m.title}
                </a>
              ))}
              <a
                href="#pricing"
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              >
                Preços
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => openAuth('login')}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="group relative px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar Grátis
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xl transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="px-6 py-6 space-y-2">
            {modules.map(m => (
              <a
                key={m.id}
                href={`#${m.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <m.icon size={20} className={`text-${m.color}-500`} />
                <span className="font-medium">{m.title}</span>
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  openAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  openAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Design */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[150px]" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Plataforma All-in-One para o Futuro
              </span>
              <ChevronRight size={14} className="text-indigo-500" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="block text-zinc-900 dark:text-white">Uma plataforma.</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Infinitas possibilidades.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Vendas, educação, projetos e networking integrados.
              <span className="text-zinc-900 dark:text-white font-medium">
                {' '}
                Escolha os módulos que você precisa
              </span>{' '}
              e escale sem limites.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openAuth('signup')}
                className="group w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Rocket size={20} />
                Começar Gratuitamente
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() =>
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group w-full sm:w-auto px-8 py-4 rounded-full border-2 border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
              >
                <Play size={18} className="text-indigo-600" />
                Ver demonstração
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check size={12} className="text-green-600 dark:text-green-400" />
                </div>
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check size={12} className="text-green-600 dark:text-green-400" />
                </div>
                <span>14 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check size={12} className="text-green-600 dark:text-green-400" />
                </div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 mb-3 group-hover:scale-110 transition-transform">
                  <metric.icon size={22} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Type Section - Marketing Focus */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <Target size={14} />
              Feito para você
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Escolha seu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                caminho
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Seja você um profissional independente ou uma empresa em crescimento, temos a solução
              perfeita.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
              <button
                onClick={() => setActiveAccountTab('personal')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeAccountTab === 'personal'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <User size={18} />
                Conta Pessoal
              </button>
              <button
                onClick={() => setActiveAccountTab('business')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeAccountTab === 'business'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Building2 size={18} />
                Conta Negócios
              </button>
            </div>
          </div>

          {/* Account Type Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Benefits */}
            <div
              className={`p-8 lg:p-10 rounded-3xl border transition-all duration-500 ${
                activeAccountTab === 'personal'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900/50'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900/50'
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  activeAccountTab === 'personal'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-br from-purple-500 to-pink-600'
                } text-white shadow-lg`}
              >
                {activeAccountTab === 'personal' ? <User size={28} /> : <Building2 size={28} />}
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                {activeAccountTab === 'personal' ? 'Para Você' : 'Para Seu Negócio'}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
                {activeAccountTab === 'personal'
                  ? 'Organize sua vida, aprenda novas habilidades e conecte-se com pessoas que importam.'
                  : 'Escale suas operações, alcance mais clientes e gerencie tudo em um só lugar.'}
              </p>

              <div className="space-y-4">
                {(activeAccountTab === 'personal'
                  ? [
                      { icon: ShoppingBag, text: 'Compre com segurança e proteção total' },
                      { icon: GraduationCap, text: 'Acesse cursos de qualidade no seu ritmo' },
                      { icon: Briefcase, text: 'Organize projetos pessoais e freelance' },
                      { icon: Users, text: 'Construa sua rede profissional' },
                    ]
                  : [
                      { icon: TrendingUp, text: 'Venda produtos e serviços sem limites' },
                      { icon: Award, text: 'Crie e monetize cursos online' },
                      { icon: BarChart3, text: 'Analytics avançado e relatórios' },
                      { icon: Target, text: 'Campanhas de marketing integradas' },
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeAccountTab === 'personal'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      <item.icon size={20} />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openAuth('signup')}
                className={`mt-8 w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg ${
                  activeAccountTab === 'personal'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Criar Conta {activeAccountTab === 'personal' ? 'Pessoal' : 'Negócios'}
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right - Visual/Stats */}
            <div className="space-y-6">
              {modules.map(module => (
                <div
                  key={module.id}
                  className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() =>
                    document.getElementById(module.id)?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                    >
                      <module.icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white">{module.title}</h4>
                        <ArrowUpRight
                          size={16}
                          className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                        />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {activeAccountTab === 'personal'
                          ? module.personalBenefit
                          : module.businessBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section - Premium Cards */}
      <section id="demo" className="py-24 px-6 lg:px-8 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
              <Sparkles size={14} />
              Módulos Poderosos
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Tudo que você precisa,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                integrado
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Cada módulo foi projetado para funcionar perfeitamente sozinho ou em conjunto com os
              outros.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <div
                key={module.id}
                id={module.id}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 hover:shadow-2xl"
              >
                {/* Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                <div className="relative p-8 lg:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      <module.icon size={30} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {module.stats.value}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {module.stats.label}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {module.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${module.color}-100 dark:bg-${module.color}-900/30 text-${module.color}-700 dark:text-${module.color}-300`}
                      >
                        {module.tagline}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Features Preview */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {(module.id === 'shop'
                      ? ['Vitrine Pro', 'Pagamentos', 'Estoque', 'Analytics']
                      : module.id === 'class'
                        ? ['Cursos HD', 'Certificados', 'Quiz', 'Progresso']
                        : module.id === 'work'
                          ? ['Projetos', 'Tarefas', 'Equipe', 'Timeline']
                          : ['Feed', 'Mensagens', 'Conexões', 'Campanhas']
                    ).map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${module.color}-500`} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openAuth('signup')}
                    className={`w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all`}
                  >
                    Explorar {module.title}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
              <Star size={14} />
              Histórias de Sucesso
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Amado por{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                milhares
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Veja o que nossos usuários estão dizendo sobre a transformação que o Tymes trouxe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed mb-8">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Logos */}
          <div className="mt-16 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              Empresas que confiam no Tymes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
              {['TechCorp', 'StartupX', 'EduPro', 'WorkFlow', 'SocialHub'].map((company, i) => (
                <div key={i} className="text-xl font-bold text-zinc-400 dark:text-zinc-600">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-8 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <Shield size={14} />
              Por que Tymes?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Tecnologia de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ponta
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Construído com as melhores práticas de segurança, performance e experiência do
              usuário.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Design Premium',
                desc: 'Interface moderna e intuitiva que você vai amar usar',
                color: 'indigo',
              },
              {
                icon: Shield,
                title: 'Segurança Total',
                desc: 'Criptografia de ponta a ponta e proteção de dados',
                color: 'emerald',
              },
              {
                icon: Zap,
                title: 'Ultra Rápido',
                desc: 'Carregamento instantâneo e experiência fluida',
                color: 'amber',
              },
              {
                icon: Globe,
                title: 'Escala Global',
                desc: 'Infraestrutura distribuída em múltiplas regiões',
                color: 'blue',
              },
              {
                icon: Lock,
                title: 'Privacidade',
                desc: 'Seus dados são seus. Conformidade com LGPD',
                color: 'purple',
              },
              {
                icon: Clock,
                title: 'Suporte 24/7',
                desc: 'Equipe dedicada sempre pronta para ajudar',
                color: 'pink',
              },
              {
                icon: TrendingUp,
                title: 'Analytics',
                desc: 'Insights poderosos para tomar decisões',
                color: 'orange',
              },
              {
                icon: Rocket,
                title: 'Inovação',
                desc: 'Novas funcionalidades toda semana',
                color: 'teal',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    size={24}
                    className={`text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
              <TrendingUp size={14} />
              Preços Transparentes
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Planos que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                crescem
              </span>{' '}
              com você
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Comece grátis e faça upgrade quando precisar. Sem surpresas, sem taxas escondidas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Grátis',
                period: 'para sempre',
                description: 'Perfeito para começar',
                features: [
                  '1 módulo ativo',
                  'Até 100 itens',
                  'Suporte por email',
                  'Atualizações básicas',
                  'Comunidade',
                ],
                cta: 'Começar Grátis',
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
                  'Integrações',
                  'API completa',
                  "Sem marca d'água",
                ],
                cta: 'Começar Trial Grátis',
                highlighted: true,
                badge: 'Mais Popular',
              },
              {
                name: 'Enterprise',
                price: 'R$ 199',
                period: '/mês',
                description: 'Para empresas',
                features: [
                  'Tudo do Pro',
                  'Multi-usuários ilimitados',
                  'SSO / SAML',
                  'Suporte 24/7 dedicado',
                  'SLA garantido',
                  'Customizações',
                  'Onboarding VIP',
                ],
                cta: 'Falar com Vendas',
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-3xl transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/25 scale-105 z-10'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3
                    className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${plan.highlighted ? 'text-indigo-200' : 'text-zinc-500 dark:text-zinc-400'}`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span
                      className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm mb-2 ${plan.highlighted ? 'text-indigo-200' : 'text-zinc-500 dark:text-zinc-400'}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        <Check
                          size={12}
                          className={
                            plan.highlighted ? 'text-white' : 'text-green-600 dark:text-green-400'
                          }
                        />
                      </div>
                      <span
                        className={`text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-zinc-600 dark:text-zinc-400'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openAuth('signup')}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg'
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50">
              <Shield size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Garantia de 30 dias ou seu dinheiro de volta
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
            <Rocket size={16} />
            Comece sua jornada hoje
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Pronto para transformar
            <br />
            seu negócio?
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a mais de 500.000 usuários que já estão crescendo com o Tymes. Comece grátis,
            sem compromisso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="group w-full sm:w-auto px-10 py-5 rounded-full bg-white text-indigo-600 font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-white/25 transition-all hover:-translate-y-1"
            >
              Criar Conta Grátis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="w-full sm:w-auto px-10 py-5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Já tenho conta
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} />
              <span>Conformidade LGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>Suporte premiado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  T
                </div>
                <span className="text-2xl font-bold text-white">Tymes</span>
              </div>
              <p className="text-zinc-500 leading-relaxed mb-6 max-w-sm">
                A plataforma all-in-one que une vendas, educação, projetos e networking. Construa o
                futuro do seu negócio conosco.
              </p>
              <div className="flex items-center gap-3">
                {['twitter', 'linkedin', 'instagram', 'youtube'].map(social => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 rounded bg-current opacity-50" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Módulos</h4>
              <ul className="space-y-3">
                {modules.map(m => (
                  <li key={m.id}>
                    <a href={`#${m.id}`} className="hover:text-white transition-colors">
                      {m.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Imprensa
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2025 Tymes Platform. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
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
        moduleColor="from-indigo-600 to-purple-600"
        redirectTo="/app"
      />
    </div>
  );
};
