/**
 * Module Landing Page - Premium Design
 * Página de landing específica para cada módulo com foco em conversão
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Menu,
  X,
  Star,
  Play,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  User,
  Building2,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  Award,
  Clock,
  Rocket,
  Globe,
} from 'lucide-react';
import { AuthModal } from '../../components/shared/AuthModal';

type ModuleType = 'shop' | 'class' | 'work' | 'social';
type AccountTab = 'personal' | 'business';

interface ModuleLandingProps {
  module: ModuleType;
}

const moduleConfig = {
  shop: {
    icon: ShoppingBag,
    title: 'Shop',
    tagline: 'Venda sem limites',
    subtitle: 'Marketplace Completo',
    description:
      'Transforme sua paixão em lucro. Venda produtos físicos ou digitais com uma vitrine profissional.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'from-emerald-50 to-teal-50',
    darkBg: 'from-emerald-950/20 to-teal-950/20',
    stats: [
      { value: '2.5M+', label: 'Produtos vendidos' },
      { value: '50K+', label: 'Vendedores ativos' },
      { value: '99.8%', label: 'Satisfação' },
    ],
    personalFeatures: [
      { icon: Shield, title: 'Compra Protegida', desc: 'Garantia em todas as transações' },
      { icon: Star, title: 'Avaliações Reais', desc: 'Feedback de compradores verificados' },
      { icon: Zap, title: 'Entrega Rápida', desc: 'Rastreamento em tempo real' },
      { icon: Target, title: 'Ofertas Exclusivas', desc: 'Descontos personalizados para você' },
    ],
    businessFeatures: [
      { icon: TrendingUp, title: 'Vitrine Pro', desc: 'Apresente seus produtos com estilo' },
      { icon: BarChart3, title: 'Analytics', desc: 'Insights de vendas em tempo real' },
      { icon: Globe, title: 'Alcance Global', desc: 'Venda para qualquer lugar' },
      { icon: Rocket, title: 'Escale Rápido', desc: 'Ferramentas para crescer' },
    ],
    testimonial: {
      text: 'Em 3 meses, tripliquei minhas vendas. O Tymes Shop mudou meu negócio.',
      author: 'Marina Silva',
      role: 'Empreendedora',
    },
  },
  class: {
    icon: GraduationCap,
    title: 'Class',
    tagline: 'Conhecimento que transforma',
    subtitle: 'Plataforma de Ensino',
    description:
      'Aprenda com os melhores ou compartilhe seu conhecimento. Cursos de qualidade para todos.',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'from-blue-50 to-indigo-50',
    darkBg: 'from-blue-950/20 to-indigo-950/20',
    stats: [
      { value: '50K+', label: 'Alunos ativos' },
      { value: '2K+', label: 'Cursos disponíveis' },
      { value: '4.9', label: 'Avaliação média' },
    ],
    personalFeatures: [
      { icon: Clock, title: 'Aprenda no seu ritmo', desc: 'Acesso vitalício aos cursos' },
      { icon: Award, title: 'Certificados', desc: 'Reconhecimento oficial' },
      { icon: Target, title: 'Trilhas de Aprendizado', desc: 'Caminhos personalizados' },
      { icon: Users, title: 'Comunidade', desc: 'Conecte-se com outros alunos' },
    ],
    businessFeatures: [
      { icon: TrendingUp, title: 'Monetize', desc: 'Ganhe com seu conhecimento' },
      { icon: BarChart3, title: 'Analytics', desc: 'Acompanhe o progresso dos alunos' },
      { icon: Sparkles, title: 'Ferramentas Pro', desc: 'Quiz, certificados e mais' },
      { icon: Globe, title: 'Alcance Global', desc: 'Alunos de todo o mundo' },
    ],
    testimonial: {
      text: 'Finalmente uma plataforma que entende as necessidades de quem ensina.',
      author: 'Carlos Mendes',
      role: 'Professor',
    },
  },
  work: {
    icon: Briefcase,
    title: 'Work',
    tagline: 'Conecte talento e oportunidade',
    subtitle: 'Marketplace de Serviços',
    description:
      'Encontre freelancers qualificados ou ofereça seus serviços. O marketplace que conecta profissionais a clientes.',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    lightBg: 'from-purple-50 to-pink-50',
    darkBg: 'from-purple-950/20 to-pink-950/20',
    stats: [
      { value: '25K+', label: 'Freelancers ativos' },
      { value: '100K+', label: 'Projetos concluídos' },
      { value: '4.8', label: 'Avaliação média' },
    ],
    personalFeatures: [
      {
        icon: Target,
        title: 'Encontre Profissionais',
        desc: 'Freelancers verificados para seu projeto',
      },
      { icon: Shield, title: 'Pagamento Seguro', desc: 'Só pague quando aprovar o trabalho' },
      { icon: Star, title: 'Avaliações Reais', desc: 'Escolha com base em feedback real' },
      { icon: Clock, title: 'Entrega Garantida', desc: 'Prazos definidos e acompanhados' },
    ],
    businessFeatures: [
      { icon: TrendingUp, title: 'Ofereça Serviços', desc: 'Crie seu portfólio profissional' },
      { icon: Users, title: 'Conquiste Clientes', desc: 'Acesso a milhares de oportunidades' },
      { icon: BarChart3, title: 'Gerencie Projetos', desc: 'Controle entregas e pagamentos' },
      { icon: Globe, title: 'Trabalhe Remoto', desc: 'Clientes de qualquer lugar do mundo' },
    ],
    testimonial: {
      text: 'Encontrei os melhores freelancers para minha startup. Qualidade e agilidade!',
      author: 'Ricardo Almeida',
      role: 'CEO de Startup',
    },
  },
  social: {
    icon: Users,
    title: 'Social',
    tagline: 'Conexões que importam',
    subtitle: 'Rede Profissional',
    description:
      'Construa sua rede, compartilhe conteúdo e alcance seu público. Networking inteligente.',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    lightBg: 'from-orange-50 to-red-50',
    darkBg: 'from-orange-950/20 to-red-950/20',
    stats: [
      { value: '100K+', label: 'Conexões feitas' },
      { value: '1M+', label: 'Posts por mês' },
      { value: '95%', label: 'Engajamento' },
    ],
    personalFeatures: [
      { icon: Users, title: 'Networking', desc: 'Conecte-se com profissionais' },
      { icon: Zap, title: 'Feed Inteligente', desc: 'Conteúdo relevante para você' },
      { icon: Target, title: 'Oportunidades', desc: 'Descubra novas possibilidades' },
      { icon: Star, title: 'Reputação', desc: 'Construa sua marca pessoal' },
    ],
    businessFeatures: [
      { icon: TrendingUp, title: 'Campanhas', desc: 'Marketing direcionado' },
      { icon: BarChart3, title: 'Analytics', desc: 'Métricas de engajamento' },
      { icon: Globe, title: 'Alcance', desc: 'Expanda sua audiência' },
      { icon: Sparkles, title: 'Automação', desc: 'Agende posts e mais' },
    ],
    testimonial: {
      text: 'Consegui dobrar minha rede de contatos em apenas 2 meses.',
      author: 'Pedro Santos',
      role: 'Consultor',
    },
  },
};

export const ModuleLanding: React.FC<ModuleLandingProps> = ({ module }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>('personal');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const config = moduleConfig[module];
  const Icon = config.icon;

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
    { id: 'shop', title: 'Shop', color: 'emerald' },
    { id: 'class', title: 'Class', color: 'blue' },
    { id: 'work', title: 'Work', color: 'purple' },
    { id: 'social', title: 'Social', color: 'orange' },
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
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                  T
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                Tymes
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {modules.map(m => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/${m.id}`)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    module === m.id
                      ? `text-${m.color}-600 dark:text-${m.color}-400 bg-${m.color}-50 dark:bg-${m.color}-950/30`
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {m.title}
                </button>
              ))}
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
                className={`group relative px-6 py-2.5 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold overflow-hidden transition-all hover:shadow-lg`}
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
              <button
                key={m.id}
                onClick={() => {
                  navigate(`/${m.id}`);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${module === m.id ? `bg-${m.color}-50 dark:bg-${m.color}-950/30 text-${m.color}-600` : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="font-medium">{m.title}</span>
              </button>
            ))}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  openAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  openAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold`}
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] bg-${config.color}-500/10 rounded-full blur-[120px]`}
          />
          <div
            className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-${config.color}-500/5 rounded-full blur-[100px]`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.lightBg} dark:${config.darkBg} border border-${config.color}-200 dark:border-${config.color}-900/50`}
              >
                <Icon
                  size={16}
                  className={`text-${config.color}-600 dark:text-${config.color}-400`}
                />
                <span
                  className={`text-sm font-semibold text-${config.color}-700 dark:text-${config.color}-300`}
                >
                  {config.tagline}
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
                  <span className="block text-zinc-900 dark:text-white">{config.title}</span>
                  <span
                    className={`block text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}
                  >
                    {config.subtitle}
                  </span>
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {config.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {config.stats.map((stat, i) => (
                  <div key={i}>
                    <div
                      className={`text-3xl font-bold text-${config.color}-600 dark:text-${config.color}-400`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => openAuth('signup')}
                  className={`group px-8 py-4 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all`}
                >
                  <Rocket size={20} />
                  Começar Agora
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={() => openAuth('login')}
                  className="px-8 py-4 rounded-full border-2 border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                >
                  <Play size={18} className={`text-${config.color}-600`} />
                  Ver Demo
                </button>
              </div>
            </div>

            {/* Right - Visual */}
            <div
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${config.lightBg} dark:${config.darkBg} border border-${config.color}-200/50 dark:border-${config.color}-900/30`}
            >
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-2xl mx-auto mb-8`}
              >
                <Icon size={48} />
              </div>

              {/* Testimonial */}
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-zinc-700 dark:text-zinc-300 italic mb-4">
                  "{config.testimonial.text}"
                </p>
                <div className="font-semibold text-zinc-900 dark:text-white">
                  {config.testimonial.author}
                </div>
                <div className="text-sm text-zinc-500">{config.testimonial.role}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features by Account Type */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${config.color}-100 dark:bg-${config.color}-900/30 text-${config.color}-700 dark:text-${config.color}-300 text-sm font-medium mb-4`}
            >
              <Target size={14} />
              Recursos para você
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Escolha seu{' '}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                perfil
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Recursos personalizados para cada tipo de usuário.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
              <button
                onClick={() => setActiveAccountTab('personal')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeAccountTab === 'personal'
                    ? `bg-white dark:bg-zinc-700 text-${config.color}-600 dark:text-white shadow-sm`
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <User size={18} />
                Pessoal
              </button>
              <button
                onClick={() => setActiveAccountTab('business')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeAccountTab === 'business'
                    ? `bg-white dark:bg-zinc-700 text-${config.color}-600 dark:text-white shadow-sm`
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Building2 size={18} />
                Negócios
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeAccountTab === 'personal'
              ? config.personalFeatures
              : config.businessFeatures
            ).map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${config.color}-100 dark:bg-${config.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    size={24}
                    className={`text-${config.color}-600 dark:text-${config.color}-400`}
                  />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => openAuth('signup')}
              className={`px-8 py-4 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold hover:shadow-xl transition-all`}
            >
              Criar Conta {activeAccountTab === 'personal' ? 'Pessoal' : 'Negócios'}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para começar com {config.title}?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão transformando seus resultados.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="group w-full sm:w-auto px-10 py-5 rounded-full bg-white text-zinc-900 font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
            >
              Começar Grátis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-10 py-5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Ver todos os módulos
            </button>
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
                    <button
                      onClick={() => navigate(`/${m.id}`)}
                      className="hover:text-white transition-colors"
                    >
                      {m.title}
                    </button>
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
        moduleName={config.title}
        moduleColor={config.gradient}
        redirectTo="/app"
        redirectState={{ openModule: module.toUpperCase() }}
      />
    </div>
  );
};
