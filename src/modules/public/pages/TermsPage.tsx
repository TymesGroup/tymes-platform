/**
 * TermsPage - Termos de Uso da Tymes
 */

import React from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle, Scale } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const sections = [
  {
    title: '1. Aceitação dos Termos',
    content: `Ao acessar e usar a plataforma Tymes, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços. Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam a plataforma.`,
  },
  {
    title: '2. Descrição dos Serviços',
    content: `A Tymes é uma plataforma integrada que oferece: Shop (marketplace para compra e venda de produtos), Class (plataforma de cursos e educação online), Work (marketplace de serviços e freelancers) e Social (rede social para a comunidade). Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento.`,
  },
  {
    title: '3. Cadastro e Conta',
    content: `Para usar determinados recursos da plataforma, você deve criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta. Você concorda em notificar imediatamente a Tymes sobre qualquer uso não autorizado de sua conta. Você deve ter pelo menos 18 anos para criar uma conta.`,
  },
  {
    title: '4. Conduta do Usuário',
    content: `Você concorda em não usar a plataforma para: publicar conteúdo ilegal, difamatório ou ofensivo; violar direitos de propriedade intelectual; transmitir vírus ou código malicioso; coletar informações de outros usuários sem consentimento; usar a plataforma para spam ou publicidade não autorizada; tentar acessar áreas restritas do sistema.`,
  },
  {
    title: '5. Conteúdo do Usuário',
    content: `Você mantém a propriedade de todo conteúdo que publica na plataforma. Ao publicar conteúdo, você concede à Tymes uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, modificar e exibir esse conteúdo em conexão com a operação da plataforma. Você é responsável pelo conteúdo que publica.`,
  },
  {
    title: '6. Transações e Pagamentos',
    content: `A Tymes atua como intermediária nas transações entre compradores e vendedores. Cobramos taxas sobre transações conforme nossa tabela de preços. Os pagamentos são processados por parceiros de pagamento terceirizados. Não nos responsabilizamos por disputas entre usuários, mas oferecemos suporte para mediação.`,
  },
  {
    title: '7. Política de Reembolso',
    content: `Reembolsos são processados conforme nossa política específica para cada módulo. Para produtos físicos, o prazo é de 7 dias após o recebimento. Para cursos e serviços digitais, o prazo é de 7 dias após a compra, desde que menos de 30% do conteúdo tenha sido consumido. Casos especiais são analisados individualmente.`,
  },
  {
    title: '8. Propriedade Intelectual',
    content: `A plataforma Tymes, incluindo seu design, código, logos e conteúdo original, é protegida por direitos autorais e outras leis de propriedade intelectual. Você não pode copiar, modificar, distribuir ou criar obras derivadas sem nossa autorização expressa por escrito.`,
  },
  {
    title: '9. Limitação de Responsabilidade',
    content: `A Tymes não se responsabiliza por danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar a plataforma. Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses. Não garantimos que a plataforma estará sempre disponível ou livre de erros.`,
  },
  {
    title: '10. Modificações dos Termos',
    content: `Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre mudanças significativas por email ou através da plataforma. O uso continuado após as modificações constitui aceitação dos novos termos. Recomendamos revisar periodicamente esta página.`,
  },
];

const highlights = [
  {
    icon: CheckCircle,
    title: 'Permitido',
    items: [
      'Vender produtos legais',
      'Criar e vender cursos',
      'Oferecer serviços profissionais',
      'Interagir respeitosamente',
    ],
  },
  {
    icon: XCircle,
    title: 'Proibido',
    items: [
      'Conteúdo ilegal ou ofensivo',
      'Fraude ou golpes',
      'Spam e publicidade invasiva',
      'Violação de direitos autorais',
    ],
  },
];

export const TermsPage: React.FC = () => {
  return (
    <PublicLayout title="Termos de Uso">
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-lg text-[#424245] dark:text-[#86868b] leading-relaxed">
            Estes Termos de Uso regem o acesso e uso da plataforma Tymes. Leia atentamente antes de
            utilizar nossos serviços.
          </p>
          <p className="text-sm text-[#86868b] mt-4">Última atualização: 31 de dezembro de 2025</p>
        </section>

        {/* Quick Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((highlight, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl ${
                highlight.title === 'Permitido'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <highlight.icon
                  className={`w-6 h-6 ${
                    highlight.title === 'Permitido' ? 'text-green-600' : 'text-red-600'
                  }`}
                />
                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {highlight.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {highlight.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm text-[#424245] dark:text-[#86868b] flex items-center gap-2"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        highlight.title === 'Permitido' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <section key={i} className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                {section.title}
              </h2>
              <p className="text-[#424245] dark:text-[#86868b] leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Important Notice */}
        <section className="border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Aviso Importante
              </h3>
              <p className="text-sm text-[#424245] dark:text-[#86868b]">
                O descumprimento destes termos pode resultar em suspensão ou encerramento permanente
                da sua conta, sem direito a reembolso de valores pendentes. Em casos de atividades
                ilegais, as autoridades competentes serão notificadas.
              </p>
            </div>
          </div>
        </section>

        {/* Jurisdiction */}
        <section className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Lei Aplicável e Jurisdição
              </h3>
              <p className="text-sm text-[#424245] dark:text-[#86868b]">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer
                disputa será resolvida no foro da comarca de São Paulo, SP, com exclusão de qualquer
                outro, por mais privilegiado que seja.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Dúvidas sobre os Termos?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Se você tiver qualquer dúvida sobre estes Termos de Uso, entre em contato conosco.
          </p>
          <a
            href="mailto:juridico@tymes.com.br"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            juridico@tymes.com.br
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default TermsPage;
