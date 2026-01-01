/**
 * CareersPage - Página de Carreiras da Tymes
 */

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Coffee,
  Laptop,
  Users,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const benefits = [
  {
    icon: Laptop,
    title: 'Trabalho Remoto',
    description: 'Trabalhe de onde quiser, com flexibilidade total.',
  },
  {
    icon: Heart,
    title: 'Plano de Saúde',
    description: 'Cobertura completa para você e sua família.',
  },
  {
    icon: Coffee,
    title: 'Horário Flexível',
    description: 'Organize seu tempo da forma que funciona melhor.',
  },
  { icon: Users, title: 'Cultura Incrível', description: 'Ambiente colaborativo e diverso.' },
  { icon: Zap, title: 'Crescimento', description: 'Oportunidades de desenvolvimento contínuo.' },
  { icon: Briefcase, title: 'Stock Options', description: 'Participe do sucesso da empresa.' },
];

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'Tempo Integral',
    description:
      'Buscamos um desenvolvedor frontend experiente para liderar projetos em React e TypeScript.',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remoto',
    type: 'Tempo Integral',
    description:
      'Procuramos um designer de produto para criar experiências incríveis para nossos usuários.',
  },
  {
    id: 3,
    title: 'Backend Engineer',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'Tempo Integral',
    description:
      'Desenvolvedor backend para trabalhar com Node.js, PostgreSQL e arquitetura de microsserviços.',
  },
  {
    id: 4,
    title: 'Customer Success Manager',
    department: 'Operações',
    location: 'São Paulo, SP',
    type: 'Tempo Integral',
    description: 'Responsável por garantir o sucesso e satisfação dos nossos clientes enterprise.',
  },
  {
    id: 5,
    title: 'Marketing Analyst',
    department: 'Marketing',
    location: 'Remoto',
    type: 'Tempo Integral',
    description: 'Analista de marketing para estratégias de growth e aquisição de usuários.',
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'Tempo Integral',
    description: 'Engenheiro DevOps para gerenciar nossa infraestrutura em cloud e CI/CD.',
  },
];

const departments = ['Todos', 'Engenharia', 'Design', 'Marketing', 'Operações'];

export const CareersPage: React.FC = () => {
  const [activeDepartment, setActiveDepartment] = useState('Todos');

  const filteredJobs = jobs.filter(
    job => activeDepartment === 'Todos' || job.department === activeDepartment
  );

  return (
    <PublicLayout title="Carreiras">
      <div className="space-y-16">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-[#424245] dark:text-[#86868b] leading-relaxed">
            Junte-se a uma equipe apaixonada por criar produtos que impactam milhares de pessoas. Na
            Tymes, você terá a oportunidade de crescer, aprender e fazer a diferença.
          </p>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Por que trabalhar na Tymes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#424245] dark:text-[#86868b]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Culture */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Nossa Cultura</h2>
              <p className="text-white/80 mb-6">
                Acreditamos que grandes produtos são feitos por pessoas felizes. Por isso,
                cultivamos um ambiente onde a criatividade, colaboração e bem-estar são prioridades.
              </p>
              <ul className="space-y-3">
                {[
                  'Transparência em tudo',
                  'Feedback constante',
                  'Autonomia e confiança',
                  'Diversidade e inclusão',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300"
                alt="Team"
                className="rounded-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300"
                alt="Office"
                className="rounded-xl mt-8"
              />
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Vagas Abertas
          </h2>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeDepartment === dept
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#424245] dark:text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2f]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="p-6 bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl hover:border-indigo-500 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#424245] dark:text-[#86868b] mt-1">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#86868b]">
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
                    Candidatar <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#86868b]">
                Nenhuma vaga disponível neste departamento no momento.
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            Não encontrou sua vaga?
          </h2>
          <p className="text-[#424245] dark:text-[#86868b] mb-6 max-w-xl mx-auto">
            Envie seu currículo para nosso banco de talentos. Entraremos em contato quando surgir
            uma oportunidade que combine com seu perfil.
          </p>
          <a
            href="mailto:carreiras@tymes.com.br"
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
          >
            Enviar currículo
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default CareersPage;
