/**
 * PrivacyPage - Política de Privacidade
 */

import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Bell } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const sections = [
  {
    icon: Database,
    title: 'Dados que Coletamos',
    content: `Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone e dados de pagamento ao criar uma conta ou realizar transações. Também coletamos dados de uso automaticamente, incluindo endereço IP, tipo de navegador, páginas visitadas e tempo de permanência.`,
  },
  {
    icon: Eye,
    title: 'Como Usamos seus Dados',
    content: `Utilizamos seus dados para: fornecer e melhorar nossos serviços; processar transações e enviar confirmações; personalizar sua experiência na plataforma; enviar comunicações sobre atualizações e ofertas (com seu consentimento); garantir a segurança da plataforma e prevenir fraudes.`,
  },
  {
    icon: Lock,
    title: 'Proteção de Dados',
    content: `Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia SSL/TLS, controles de acesso rigorosos, monitoramento contínuo de segurança e backups regulares. Nossos servidores estão localizados em data centers seguros com certificações de segurança reconhecidas.`,
  },
  {
    icon: UserCheck,
    title: 'Compartilhamento de Dados',
    content: `Não vendemos seus dados pessoais. Compartilhamos informações apenas com: prestadores de serviços que nos auxiliam (processadores de pagamento, serviços de hospedagem); quando exigido por lei ou ordem judicial; para proteger direitos, propriedade ou segurança da Tymes e seus usuários.`,
  },
  {
    icon: Bell,
    title: 'Seus Direitos',
    content: `Você tem direito a: acessar seus dados pessoais; corrigir dados incorretos; solicitar exclusão de dados; revogar consentimentos; exportar seus dados em formato portável; opor-se ao processamento de dados para marketing. Para exercer esses direitos, entre em contato conosco.`,
  },
];

export const PrivacyPage: React.FC = () => {
  return (
    <PublicLayout title="Política de Privacidade">
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-lg text-[#424245] dark:text-[#86868b] leading-relaxed">
            Na Tymes, a privacidade dos nossos usuários é prioridade. Esta política descreve como
            coletamos, usamos e protegemos suas informações pessoais.
          </p>
          <p className="text-sm text-[#86868b] mt-4">Última atualização: 31 de dezembro de 2025</p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i} className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                    {section.title}
                  </h2>
                  <p className="text-[#424245] dark:text-[#86868b] leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Cookies Reference */}
        <section className="border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            Cookies e Tecnologias Similares
          </h2>
          <p className="text-[#424245] dark:text-[#86868b] mb-4">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência. Para mais
            detalhes sobre como usamos cookies, consulte nossa{' '}
            <a href="/cookies" className="text-indigo-600 hover:underline">
              Política de Cookies
            </a>
            .
          </p>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Dúvidas sobre Privacidade?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Nossa equipe de proteção de dados está disponível para esclarecer qualquer dúvida.
          </p>
          <a
            href="mailto:privacidade@tymes.com.br"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            privacidade@tymes.com.br
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPage;
