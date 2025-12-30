/**
 * Landing Footer - Apple-inspired Design
 * Componente de rodapé reutilizável para todas as páginas da landing
 */

import React from 'react';

const modules = [
  { id: 'shop', title: 'Shop' },
  { id: 'class', title: 'Class' },
  { id: 'work', title: 'Work' },
  { id: 'social', title: 'Social' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#1d1d1f] border-t border-[#d2d2d7] dark:border-[#424245]">
      <div className="max-w-[980px] mx-auto px-6 py-12">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
              Módulos
            </h4>
            <ul className="space-y-2">
              {modules.map(m => (
                <li key={m.id}>
                  <a
                    href={`/${m.id}`}
                    className="text-[12px] text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
                  >
                    {m.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
              Empresa
            </h4>
            <ul className="space-y-2">
              {['Sobre', 'Blog', 'Carreiras', 'Imprensa'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[12px] text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
              Suporte
            </h4>
            <ul className="space-y-2">
              {['Central de Ajuda', 'Documentação', 'API', 'Status'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[12px] text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Termos de Uso', 'Privacidade', 'Cookies', 'LGPD'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[12px] text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[#d2d2d7] dark:border-[#424245]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#86868b]">
              © 2025 Tymes Platform. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#86868b]">Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
