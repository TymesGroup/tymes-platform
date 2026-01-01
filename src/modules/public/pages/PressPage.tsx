/**
 * PressPage - Página de Imprensa da Tymes
 */

import React from 'react';
import { Download, ExternalLink, Mail, Calendar, FileText } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const pressReleases = [
  {
    id: 1,
    title: 'Tymes atinge marca de 50 mil usuários ativos',
    date: '20 Dez 2024',
    excerpt: 'Plataforma celebra crescimento expressivo e anuncia novos recursos para 2025.',
  },
  {
    id: 2,
    title: 'Lançamento do módulo Social',
    date: '15 Nov 2024',
    excerpt: 'Novo módulo permite que usuários compartilhem conteúdo e interajam na comunidade.',
  },
  {
    id: 3,
    title: 'Tymes recebe investimento Série A',
    date: '01 Out 2024',
    excerpt: 'Rodada de investimento de R$ 10 milhões para expansão da plataforma.',
  },
  {
    id: 4,
    title: 'Parceria com instituições de ensino',
    date: '15 Set 2024',
    excerpt: 'Tymes Class firma parceria com universidades para oferecer cursos certificados.',
  },
];

const mediaKit = [
  { name: 'Logo Tymes (PNG)', size: '2.4 MB', type: 'ZIP' },
  { name: 'Logo Tymes (SVG)', size: '156 KB', type: 'ZIP' },
  { name: 'Guia de Marca', size: '5.8 MB', type: 'PDF' },
  { name: 'Fotos da Equipe', size: '12 MB', type: 'ZIP' },
  { name: 'Screenshots da Plataforma', size: '8.5 MB', type: 'ZIP' },
];

const coverage = [
  {
    outlet: 'TechCrunch Brasil',
    title: 'Tymes: a plataforma que unifica comércio e educação',
    date: '18 Dez 2024',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100',
  },
  {
    outlet: 'Exame',
    title: 'Startup brasileira revoluciona marketplace digital',
    date: '10 Dez 2024',
    logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100',
  },
  {
    outlet: 'Valor Econômico',
    title: 'Tymes capta R$ 10 milhões em rodada Série A',
    date: '02 Out 2024',
    logo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100',
  },
];

export const PressPage: React.FC = () => {
  return (
    <PublicLayout title="Imprensa">
      <div className="space-y-16">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-[#424245] dark:text-[#86868b] leading-relaxed">
            Bem-vindo à sala de imprensa da Tymes. Aqui você encontra comunicados, materiais para
            download e informações para cobertura jornalística.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contato para Imprensa</h2>
          <p className="text-white/80 mb-6">
            Para entrevistas, informações ou solicitações de mídia, entre em contato com nossa
            equipe.
          </p>
          <a
            href="mailto:imprensa@tymes.com.br"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            <Mail size={18} /> imprensa@tymes.com.br
          </a>
        </section>

        {/* Press Releases */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
            Comunicados de Imprensa
          </h2>
          <div className="space-y-4">
            {pressReleases.map(release => (
              <div
                key={release.id}
                className="p-6 bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl hover:border-indigo-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#86868b] mb-2">
                      <Calendar size={14} />
                      {release.date}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-indigo-600 transition-colors mb-2">
                      {release.title}
                    </h3>
                    <p className="text-[#424245] dark:text-[#86868b]">{release.excerpt}</p>
                  </div>
                  <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap">
                    Ler mais <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">Na Mídia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverage.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#2d2d2f] flex items-center justify-center overflow-hidden">
                    <FileText className="w-5 h-5 text-[#86868b]" />
                  </div>
                  <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {item.outlet}
                  </span>
                </div>
                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#86868b]">{item.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
            Kit de Mídia
          </h2>
          <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-6">
            <p className="text-[#424245] dark:text-[#86868b] mb-6">
              Baixe nossos materiais oficiais para uso em publicações e reportagens.
            </p>
            <div className="space-y-3">
              {mediaKit.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#2d2d2f] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{item.name}</p>
                      <p className="text-sm text-[#86868b]">
                        {item.type} • {item.size}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    <Download size={18} /> Baixar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Facts */}
        <section className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Dados da Empresa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Fundação', value: '2024' },
              { label: 'Sede', value: 'São Paulo, BR' },
              { label: 'Funcionários', value: '50+' },
              { label: 'Usuários', value: '50K+' },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-sm text-[#86868b] mb-1">{item.label}</p>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PressPage;
