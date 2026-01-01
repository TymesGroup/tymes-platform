/**
 * ApiPage - Página da API da Tymes
 */

import React, { useState } from 'react';
import { Code, Key, Shield, Zap, Copy, Check, ExternalLink, Book } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const features = [
  { icon: Zap, title: 'Alta Performance', description: 'Respostas em menos de 100ms' },
  { icon: Shield, title: 'Segura', description: 'Autenticação OAuth 2.0 e HTTPS' },
  { icon: Code, title: 'RESTful', description: 'API REST bem documentada' },
  { icon: Key, title: 'Rate Limiting', description: '1000 requests/minuto' },
];

const endpoints = [
  {
    category: 'Produtos',
    items: [
      { method: 'GET', path: '/products', description: 'Lista produtos' },
      { method: 'GET', path: '/products/:id', description: 'Detalhes do produto' },
      { method: 'POST', path: '/products', description: 'Criar produto' },
      { method: 'PUT', path: '/products/:id', description: 'Atualizar produto' },
      { method: 'DELETE', path: '/products/:id', description: 'Remover produto' },
    ],
  },
  {
    category: 'Cursos',
    items: [
      { method: 'GET', path: '/courses', description: 'Lista cursos' },
      { method: 'GET', path: '/courses/:id', description: 'Detalhes do curso' },
      { method: 'POST', path: '/courses', description: 'Criar curso' },
      { method: 'GET', path: '/courses/:id/lessons', description: 'Lista aulas' },
    ],
  },
  {
    category: 'Pedidos',
    items: [
      { method: 'GET', path: '/orders', description: 'Lista pedidos' },
      { method: 'GET', path: '/orders/:id', description: 'Detalhes do pedido' },
      { method: 'POST', path: '/orders', description: 'Criar pedido' },
      { method: 'PUT', path: '/orders/:id/status', description: 'Atualizar status' },
    ],
  },
  {
    category: 'Usuários',
    items: [
      { method: 'GET', path: '/users/me', description: 'Usuário atual' },
      { method: 'PUT', path: '/users/me', description: 'Atualizar perfil' },
      { method: 'GET', path: '/users/:id', description: 'Perfil público' },
    ],
  },
];

const codeExample = `// Exemplo de uso da API
const response = await fetch('https://api.tymes.com.br/v1/products', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const products = await response.json();
console.log(products);`;

export const ApiPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PublicLayout title="API">
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-[#424245] dark:text-[#86868b] leading-relaxed">
            Integre sua aplicação com a Tymes através da nossa API RESTful. Acesse produtos, cursos,
            pedidos e muito mais de forma programática.
          </p>
        </section>

        {/* Features */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[#86868b]">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Quick Start */}
        <section className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#d2d2d7] dark:border-[#424245]">
            <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Quick Start</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-[#86868b] mb-2">Base URL</p>
              <code className="block p-3 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-lg text-indigo-600 font-mono">
                https://api.tymes.com.br/v1
              </code>
            </div>
            <div className="relative">
              <p className="text-sm text-[#86868b] mb-2">Exemplo</p>
              <div className="bg-[#1d1d1f] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <pre>{codeExample}</pre>
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-8 right-2 p-2 bg-[#2d2d2f] rounded-lg hover:bg-[#3d3d3f] transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#86868b]" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Autenticação</h2>
              <p className="text-[#86868b]">Todas as requisições requerem autenticação</p>
            </div>
          </div>
          <div className="space-y-4 text-[#424245] dark:text-[#86868b]">
            <p>
              A API usa autenticação via Bearer Token. Inclua seu token no header de todas as
              requisições:
            </p>
            <code className="block p-3 bg-white dark:bg-[#2d2d2f] rounded-lg font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
            <p>Para obter sua API Key, acesse as configurações da sua conta na plataforma.</p>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((group, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl overflow-hidden"
              >
                <div className="p-4 bg-[#f5f5f7] dark:bg-[#2d2d2f] border-b border-[#d2d2d7] dark:border-[#424245]">
                  <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {group.category}
                  </h3>
                </div>
                <div className="divide-y divide-[#d2d2d7] dark:divide-[#424245]">
                  {group.items.map((endpoint, j) => (
                    <div
                      key={j}
                      className="p-4 flex items-center gap-4 hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f] transition-colors cursor-pointer"
                    >
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-bold min-w-[60px] text-center ${
                          endpoint.method === 'GET'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : endpoint.method === 'POST'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : endpoint.method === 'PUT'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] font-mono flex-1">
                        {endpoint.path}
                      </code>
                      <span className="text-sm text-[#86868b]">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: 'Free', limit: '100 req/min', color: 'text-[#86868b]' },
              { plan: 'Pro', limit: '1.000 req/min', color: 'text-indigo-600' },
              { plan: 'Enterprise', limit: 'Ilimitado', color: 'text-purple-600' },
            ].map((tier, i) => (
              <div key={i} className="p-4 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-xl text-center">
                <p className="text-sm text-[#86868b] mb-1">{tier.plan}</p>
                <p className={`text-2xl font-bold ${tier.color}`}>{tier.limit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-white/80 mb-6">Crie sua conta e obtenha sua API Key gratuitamente.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/auth/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Criar conta
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-colors"
            >
              <Book size={18} /> Ver documentação
            </a>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ApiPage;
