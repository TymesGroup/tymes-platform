/**
 * HelpCenterPage - Central de Ajuda da Tymes
 */

import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  CreditCard,
  Shield,
  Settings,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const categories = [
  {
    id: 'shop',
    icon: ShoppingBag,
    title: 'Shop',
    description: 'Compras, vendas e entregas',
    articles: 24,
  },
  {
    id: 'class',
    icon: GraduationCap,
    title: 'Class',
    description: 'Cursos e aprendizado',
    articles: 18,
  },
  {
    id: 'work',
    icon: Briefcase,
    title: 'Work',
    description: 'Serviços e freelancers',
    articles: 15,
  },
  { id: 'social', icon: Users, title: 'Social', description: 'Comunidade e posts', articles: 12 },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Transações e reembolsos',
    articles: 20,
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Segurança',
    description: 'Conta e privacidade',
    articles: 16,
  },
  {
    id: 'account',
    icon: Settings,
    title: 'Conta',
    description: 'Configurações e perfil',
    articles: 22,
  },
  {
    id: 'general',
    icon: HelpCircle,
    title: 'Geral',
    description: 'Dúvidas frequentes',
    articles: 30,
  },
];

const popularArticles = [
  { id: 1, title: 'Como criar uma conta na Tymes?', category: 'Conta', views: 15420 },
  { id: 2, title: 'Como vender meus produtos no Shop?', category: 'Shop', views: 12350 },
  { id: 3, title: 'Métodos de pagamento aceitos', category: 'Pagamentos', views: 10890 },
  { id: 4, title: 'Como criar um curso no Class?', category: 'Class', views: 9540 },
  { id: 5, title: 'Política de reembolso', category: 'Pagamentos', views: 8720 },
  { id: 6, title: 'Como oferecer serviços no Work?', category: 'Work', views: 7650 },
];

const faqs = [
  {
    question: 'Como faço para criar uma conta?',
    answer:
      'Clique em "Criar conta" na página inicial, escolha entre conta Pessoal ou Empresarial, preencha seus dados e confirme seu email.',
  },
  {
    question: 'Quais são as taxas da plataforma?',
    answer:
      'A Tymes cobra uma taxa de 5% sobre vendas no Shop, 10% sobre cursos no Class e 8% sobre serviços no Work. Não há mensalidade.',
  },
  {
    question: 'Como recebo meus pagamentos?',
    answer:
      'Os pagamentos são processados automaticamente e transferidos para sua conta bancária cadastrada em até 14 dias após a confirmação da entrega.',
  },
  {
    question: 'Posso cancelar uma compra?',
    answer:
      'Sim, você pode solicitar cancelamento em até 7 dias após a compra para produtos físicos não entregues, ou em até 7 dias após o início para cursos e serviços.',
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer:
      'Você pode usar o chat ao vivo disponível na plataforma, enviar email para suporte@tymes.com.br ou abrir um ticket através desta Central de Ajuda.',
  },
];

export const HelpCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <PublicLayout title="Central de Ajuda">
      <div className="space-y-12">
        {/* Search */}
        <section className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
            <input
              type="text"
              placeholder="Como podemos ajudar?"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl text-lg text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-6 bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl hover:border-indigo-500 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <cat.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-[#86868b] mb-2">{cat.description}</p>
                <p className="text-xs text-indigo-600">{cat.articles} artigos</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
            Artigos Populares
          </h2>
          <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl divide-y divide-[#d2d2d7] dark:divide-[#424245]">
            {popularArticles.map(article => (
              <div
                key={article.id}
                className="p-4 flex items-center justify-between hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2f] transition-colors cursor-pointer group"
              >
                <div>
                  <h3 className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#86868b]">{article.category}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#86868b] group-hover:text-indigo-600 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-[#86868b] transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 text-[#424245] dark:text-[#86868b]">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ainda precisa de ajuda?</h2>
          <p className="text-white/80 mb-6">
            Nossa equipe de suporte está disponível 24/7 para ajudar você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">
              <MessageCircle size={18} /> Chat ao vivo
            </button>
            <a
              href="mailto:suporte@tymes.com.br"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-colors"
            >
              Enviar email
            </a>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default HelpCenterPage;
