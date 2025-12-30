/**
 * Account Types Section - Apple-inspired Design
 * Seção que explica os tipos de conta Pessoal e Business
 */

import React, { useState } from 'react';
import {
  User,
  Building2,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

interface AccountTypesSectionProps {
  onSignup: () => void;
}

export const AccountTypesSection: React.FC<AccountTypesSectionProps> = ({ onSignup }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');

  const personalBenefits = [
    { icon: ShoppingBag, text: 'Compre com segurança e proteção total' },
    { icon: GraduationCap, text: 'Acesse cursos de qualidade no seu ritmo' },
    { icon: Briefcase, text: 'Organize projetos pessoais e freelance' },
    { icon: Users, text: 'Construa sua rede profissional' },
  ];

  const businessBenefits = [
    { icon: ShoppingBag, text: 'Venda produtos e serviços sem limites' },
    { icon: GraduationCap, text: 'Crie e monetize cursos online' },
    { icon: Briefcase, text: 'Gerencie equipes e projetos com visibilidade total' },
    { icon: Users, text: 'Alcance seu público com campanhas direcionadas' },
  ];

  const benefits = activeTab === 'personal' ? personalBenefits : businessBenefits;

  return (
    <section className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-[980px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Escolha seu perfil.
          </h2>
          <p className="mt-2 text-[24px] sm:text-[28px] font-semibold tracking-tight text-[#86868b]">
            Recursos personalizados para você.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-full">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all ${
                activeTab === 'personal'
                  ? 'bg-white dark:bg-[#2d2d2d] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
            >
              <User size={18} />
              Pessoal
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all ${
                activeTab === 'business'
                  ? 'bg-white dark:bg-[#2d2d2d] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
            >
              <Building2 size={18} />
              Negócios
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info Card */}
          <div className="p-10 rounded-[28px] bg-[#f5f5f7] dark:bg-[#1d1d1f]">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                activeTab === 'personal'
                  ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  : 'bg-gradient-to-br from-purple-400 to-pink-500'
              } text-white`}
            >
              {activeTab === 'personal' ? <User size={32} /> : <Building2 size={32} />}
            </div>

            <h3 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
              {activeTab === 'personal' ? 'Conta Pessoal' : 'Conta Negócios'}
            </h3>

            <p className="text-[17px] text-[#86868b] mb-8 leading-relaxed">
              {activeTab === 'personal'
                ? 'Organize sua vida, aprenda novas habilidades e conecte-se com pessoas que importam. Tudo em um só lugar.'
                : 'Escale suas operações, alcance mais clientes e gerencie tudo em um só lugar. Ferramentas profissionais para seu negócio.'}
            </p>

            <button
              onClick={onSignup}
              className="group flex items-center gap-2 text-[17px] font-normal text-[#0066cc] hover:underline transition-all"
            >
              Criar conta {activeTab === 'personal' ? 'pessoal' : 'negócios'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right - Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-5 p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1d1d1f] transition-all hover:scale-[1.02]"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeTab === 'personal'
                      ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                      : 'bg-gradient-to-br from-purple-400 to-pink-500'
                  } text-white`}
                >
                  <benefit.icon size={24} />
                </div>
                <span className="text-[17px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Note */}
        <div className="mt-16 text-center">
          <p className="text-[14px] text-[#86868b]">
            Você pode alterar o tipo de conta a qualquer momento nas configurações.
          </p>
        </div>
      </div>
    </section>
  );
};
