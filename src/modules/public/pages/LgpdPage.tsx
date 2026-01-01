/**
 * LgpdPage - Conformidade com a LGPD
 */

import React from 'react';
import { Scale, FileText, UserCheck, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const rights = [
  {
    title: 'Confirmação e Acesso',
    description: 'Confirmar a existência de tratamento e acessar seus dados.',
  },
  {
    title: 'Correção',
    description: 'Solicitar a correção de dados incompletos, inexatos ou desatualizados.',
  },
  {
    title: 'Anonimização ou Bloqueio',
    description: 'Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.',
  },
  {
    title: 'Portabilidade',
    description: 'Solicitar a portabilidade dos dados a outro fornecedor de serviço.',
  },
  {
    title: 'Eliminação',
    description: 'Solicitar a eliminação dos dados tratados com seu consentimento.',
  },
  { title: 'Revogação', description: 'Revogar o consentimento a qualquer momento.' },
];

const bases = [
  { title: 'Consentimento', description: 'Quando você autoriza expressamente o tratamento.' },
  { title: 'Execução de Contrato', description: 'Para cumprir obrigações contratuais com você.' },
  { title: 'Obrigação Legal', description: 'Quando exigido por lei ou regulamentação.' },
  { title: 'Interesse Legítimo', description: 'Para fins legítimos, respeitando seus direitos.' },
];

export const LgpdPage: React.FC = () => {
  return (
    <PublicLayout title="LGPD">
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            Lei Geral de Proteção de Dados
          </h2>
          <p className="text-lg text-[#424245] dark:text-[#86868b] leading-relaxed">
            A Tymes está comprometida com a conformidade à Lei nº 13.709/2018 (LGPD), garantindo
            transparência e segurança no tratamento de dados pessoais.
          </p>
        </section>

        {/* What is LGPD */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                O que é a LGPD?
              </h2>
              <p className="text-[#424245] dark:text-[#86868b] leading-relaxed">
                A Lei Geral de Proteção de Dados (LGPD) é a legislação brasileira que regula o
                tratamento de dados pessoais por pessoas físicas e jurídicas. Ela estabelece regras
                sobre coleta, armazenamento, tratamento e compartilhamento de dados pessoais,
                garantindo mais proteção e penalidades para o não cumprimento.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Seus Direitos como Titular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rights.map((right, i) => (
              <div key={i} className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {right.title}
                  </h3>
                </div>
                <p className="text-sm text-[#424245] dark:text-[#86868b]">{right.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Bases */}
        <section>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center mb-8">
            Bases Legais para Tratamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bases.map((base, i) => (
              <div key={i} className="border border-[#d2d2d7] dark:border-[#424245] rounded-xl p-5">
                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  {base.title}
                </h3>
                <p className="text-sm text-[#424245] dark:text-[#86868b]">{base.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DPO */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                Encarregado de Dados (DPO)
              </h2>
              <p className="text-[#424245] dark:text-[#86868b] leading-relaxed mb-4">
                A Tymes possui um Encarregado de Proteção de Dados (DPO) responsável por garantir a
                conformidade com a LGPD e atender às solicitações dos titulares.
              </p>
              <div className="text-sm text-[#424245] dark:text-[#86868b]">
                <p>
                  <strong>Contato:</strong> dpo@tymes.com.br
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to exercise rights */}
        <section className="border border-[#d2d2d7] dark:border-[#424245] rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                Como Exercer seus Direitos
              </h2>
              <div className="space-y-3 text-[#424245] dark:text-[#86868b]">
                <p>Para exercer qualquer um dos seus direitos previstos na LGPD, você pode:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acessar as configurações de privacidade na sua conta</li>
                  <li>Enviar um e-mail para dpo@tymes.com.br</li>
                  <li>Utilizar nosso formulário de solicitação de dados</li>
                </ul>
                <p className="text-sm mt-4">
                  Responderemos sua solicitação em até 15 dias úteis, conforme previsto em lei.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Fale com nosso DPO</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Tem dúvidas sobre como tratamos seus dados? Entre em contato com nosso Encarregado de
            Proteção de Dados.
          </p>
          <a
            href="mailto:dpo@tymes.com.br"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            dpo@tymes.com.br
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};

export default LgpdPage;
