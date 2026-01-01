/**
 * AboutPage - Página Sobre a Tymes
 */

import React from 'react';
import { Users, Target, Lightbulb, Heart, Globe, Rocket } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const values = [
  {
    icon: Lightbulb,
    title: 'Inovação',
    description: 'Buscamos constantemente novas formas de conectar pessoas e oportunidades.',
  },
  {
    icon: Heart,
    title: 'Comunidade',
    description: 'Acreditamos no poder das conexões humanas e do trabalho colaborativo.',
  },
  {
    icon: Target,
    title: 'Excelência',
    description: 'Comprometidos em entregar a melhor experiência para nossos usuários.',
  },
  {
    icon: Globe,
    title: 'Acessibilidade',
    description: 'Democratizamos o acesso a produtos, serviços e conhecimento.',
  },
];

const team = [
  {
    name: 'Jean Maciel',
    role: 'CEO & Fundador',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  },
  {
    name: 'Ana Silva',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  },
  {
    name: 'Carlos Santos',
    role: 'Head de Produto',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    name: 'Marina Costa',
    role: 'Head de Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <PublicLayout title="Sobre a Tymes">
      <div className="space-y-16">
        {/* Mission */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-[#424245] dark:text-[#86868b] leading-relaxed">
            A Tymes é uma plataforma integrada que conecta pessoas, produtos, serviços e
            conhecimento em um único ecossistema digital. Nossa missão é democratizar o acesso a
            oportunidades e facilitar conexões significativas.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50K+', label: 'Usuários ativos' },
            { value: '10K+', label: 'Produtos listados' },
            { value: '5K+', label: 'Cursos disponíveis' },
            { value: '2K+', label: 'Freelancers' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-sm text-[#86868b] mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div key={i} className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {value.title}
                </h3>
                <p className="text-[#424245] dark:text-[#86868b]">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Nossa História
            </h2>
          </div>
          <div className="space-y-4 text-[#424245] dark:text-[#86868b]">
            <p>
              Fundada em 2024, a Tymes nasceu da visão de criar uma plataforma que unificasse
              diferentes aspectos do comércio digital e da economia criativa em um único lugar.
            </p>
            <p>
              Começamos com o módulo Shop, permitindo que empreendedores vendessem seus produtos.
              Logo expandimos para Class, democratizando o acesso à educação, e Work, conectando
              freelancers a oportunidades.
            </p>
            <p>
              Hoje, a Tymes é uma comunidade vibrante onde pessoas compram, vendem, aprendem,
              ensinam e colaboram, tudo em um ambiente seguro e intuitivo.
            </p>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Nossa Equipe
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{member.name}</h3>
                <p className="text-sm text-[#86868b]">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Faça parte da Tymes</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Junte-se a milhares de pessoas que já estão transformando suas vidas através da nossa
            plataforma.
          </p>
          <a
            href="#/auth/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Criar conta gratuita
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
