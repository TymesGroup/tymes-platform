/**
 * DocumentationPage - Documentação da Tymes
 */

import React, { useState } from 'react';
import {
  Book,
  Code,
  Zap,
  Shield,
  Database,
  Globe,
  ChevronRight,
  Search,
  ExternalLink,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const sections = [
  {
    id: 'getting-started',
    icon: Zap,
    title: 'Primeiros Passos',
    description: 'Comece a usar a plataforma',
  },
  { id: 'shop', icon: Book, title: 'Shop', description: 'Documentação do módulo de vendas' },
  { id: 'class', icon: Book, title: 'Class', description: 'Documentação do módulo de cursos' },
  { id: 'work', icon: Book, title: 'Work', description: 'Documentação do módulo de serviços' },
  { id: 'api', icon: Code, title: 'API Reference', description: 'Referência completa da API' },
  { id: 'webhooks', icon: Globe, title: 'Webhooks', description: 'Integração via webhooks' },
  { id: 'security', icon: Shield, title: 'Segurança', description: 'Práticas de segurança' },
  { id: 'database', icon: Database, title: 'Banco de Dados', description: 'Estrutura e modelos' },
];

const guides = [
  { title: 'Criando sua primeira loja', time: '10 min', level: 'Iniciante' },
  { title: 'Configurando pagamentos', time: '15 min', level: 'Iniciante' },
  { title: 'Publicando um curso', time: '20 min', level: 'Intermediário' },
  { title: 'Integrando via API', time: '30 min', level: 'Avançado' },
  { title: 'Configurando webhooks', time: '25 min', level: 'Avançado' },
  { title: 'Autenticação OAuth', time: '20 min', level: 'Avançado' },
];

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/products', description: 'Lista todos os produtos' },
  { method: 'POST', path: '/api/v1/products', description: 'Cria um novo produto' },
  { method: 'GET', path: '/api/v1/courses', description: 'Lista todos os cursos' },
  { method: 'POST', path: '/api/v1/orders', description: 'Cria um novo pedido' },
  { method: 'GET', path: '/api/v1/users/me', description: 'Retorna usuário autenticado' },
];

export const DocumentationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <PublicLayout title="Documentação">
      <div className="space-y-12">
        {/* Search */}
        <section className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
            <input
              type="text"
              placeholder="Buscar na documentação..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl text-lg text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-2xl text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#f5f5f7] dark:bg-[#1d1d1f] hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2f]'
              }`}
            >
              <section.icon
                className={`w-6 h-6 mb-2 ${activeSection === section.id ? 'text-white' : 'text-indigo-600'}`}
              />
              <h3
                className={`font-semibold ${activeSection === section.id ? 'text-white' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}
              >
                {section.title}
              </h3>
              <p
                className={`text-sm ${activeSection === section.id ? 'text-white/80' : 'text-[#86868b]'}`}
              >
                {section.description}
              </p>
            </button>
          ))}
        </section>

        {/* Getting Started */}
        <section className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Primeiros Passos
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#424245] dark:text-[#86868b]">
              Bem-vindo à documentação da Tymes! Aqui você encontrará tudo o que precisa para
              começar a usar nossa plataforma, seja como vendedor, instrutor ou desenvolvedor.
            </p>

            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-6 mb-4">
              Instalação Rápida
            </h3>
            <div className="bg-[#1d1d1f] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <code>npm install @tymes/sdk</code>
            </div>

            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-6 mb-4">
              Configuração Básica
            </h3>
            <div className="bg-[#1d1d1f] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`import { TymesClient } from '@tymes/sdk';

const client = new TymesClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Listar produtos
const products = await client.products.list();`}</pre>
            </div>
          </div>
        </section>

        {/* Guides */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Guias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide, i) => (
              <div
                key={i}
                className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-indigo-600 transition-colors">
                    {guide.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-[#86868b] group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#86868b]">
                  <span>{guide.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      guide.level === 'Iniciante'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : guide.level === 'Intermediário'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {guide.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            API Reference
          </h2>
          <div className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#d2d2d7] dark:border-[#424245]">
              <p className="text-sm text-[#86868b]">
                Base URL: <code className="text-indigo-600">https://api.tymes.com.br</code>
              </p>
            </div>
            <div className="divide-y divide-[#d2d2d7] dark:divide-[#424245]">
              {apiEndpoints.map((endpoint, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-4 hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f] transition-colors cursor-pointer"
                >
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                      endpoint.method === 'GET'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] font-mono">
                    {endpoint.path}
                  </code>
                  <span className="text-sm text-[#86868b] flex-1">{endpoint.description}</span>
                  <ExternalLink className="w-4 h-4 text-[#86868b]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SDKs */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">SDKs Oficiais</h2>
          <p className="text-white/80 mb-6">
            Use nossos SDKs para integrar rapidamente com a plataforma.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['JavaScript', 'Python', 'PHP', 'Ruby'].map(lang => (
              <div
                key={lang}
                className="p-4 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-white">{lang}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default DocumentationPage;
