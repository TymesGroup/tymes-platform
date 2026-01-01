/**
 * CookiesPage - Política de Cookies
 */

import React from 'react';
import { Cookie, Settings, BarChart3, Target, Shield } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const cookieTypes = [
  {
    icon: Shield,
    title: 'Cookies Essenciais',
    description: 'Necessários para o funcionamento básico do site. Não podem ser desativados.',
    examples: ['Autenticação de usuário', 'Preferências de sessão', 'Segurança'],
    required: true,
  },
  {
    icon: Settings,
    title: 'Cookies de Preferências',
    description: 'Permitem que o site lembre suas escolhas e preferências.',
    examples: ['Idioma preferido', 'Tema (claro/escuro)', 'Região'],
    required: false,
  },
  {
    icon: BarChart3,
    title: 'Cookies de Análise',
    description: 'Nos ajudam a entender como os visitantes interagem com o site.',
    examples: ['Google Analytics', 'Páginas visitadas', 'Tempo de permanência'],
    required: false,
  },
  {
    icon: Target,
    title: 'Cookies de Marketing',
    description: 'Usados para exibir anúncios relevantes aos seus interesses.',
    examples: ['Remarketing', 'Redes sociais', 'Publicidade personalizada'],
    required: false,
  },
];

export const CookiesPage: React.FC = () => {
  return (
    <PublicLayout title="Política de Cookies">
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-lg text-[#424245] dark:text-[#86868b] leading-relaxed">
            Utilizamos cookies para melhorar sua experiência em nossa plataforma. Esta política
            explica o que são cookies, como os utilizamos e suas opções de controle.
          </p>
        </section>

        {/* What are cookies */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            O que são Cookies?
          </h2>
          <p className="text-[#424245] dark:text-[#86868b] leading-relaxed">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
            um site. Eles permitem que o site reconheça seu dispositivo e lembre informações sobre
            sua visita, como preferências de idioma e outras configurações. Isso torna sua próxima
            visita mais fácil e o site mais útil para você.
          </p>
        </section>

        {/* Cookie Types */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Tipos de Cookies que Utilizamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cookieTypes.map((type, i) => (
              <div key={i} className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {type.title}
                    </h3>
                    {type.required && <span className="text-xs text-indigo-600">Obrigatório</span>}
                  </div>
                </div>
                <p className="text-sm text-[#424245] dark:text-[#86868b] mb-3">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-1 bg-white dark:bg-[#2d2d2f] rounded-full text-[#86868b]"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to manage */}
        <section className="border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            Como Gerenciar Cookies
          </h2>
          <div className="space-y-4 text-[#424245] dark:text-[#86868b]">
            <p>Você pode controlar e gerenciar cookies de várias maneiras:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Configurações do navegador:</strong> A maioria dos navegadores permite
                bloquear ou excluir cookies através das configurações de privacidade.
              </li>
              <li>
                <strong>Banner de cookies:</strong> Ao visitar nosso site pela primeira vez, você
                pode escolher quais categorias de cookies aceitar.
              </li>
              <li>
                <strong>Opt-out de terceiros:</strong> Muitos serviços de análise e publicidade
                oferecem opções de opt-out em seus próprios sites.
              </li>
            </ul>
            <p className="text-sm mt-4">
              Nota: Desativar certos cookies pode afetar a funcionalidade do site.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Precisa de Ajuda?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Se tiver dúvidas sobre nossa política de cookies, entre em contato.
          </p>
          <a
            href="mailto:suporte@tymes.com.br"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Falar com Suporte
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default CookiesPage;
