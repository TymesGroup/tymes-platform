import React from 'react';
import {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
  Lock,
  Package,
} from 'lucide-react';
import { ProfileType } from '../../types';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { usePlatform } from '../../lib/PlatformContext';
import { useAuth } from '../../lib/AuthContext';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
};

const COLOR_MAP: Record<string, string> = {
  '#f59e0b': 'bg-amber-500',
  '#3b82f6': 'bg-blue-500',
  '#8b5cf6': 'bg-purple-500',
  '#22c55e': 'bg-green-500',
  '#ec4899': 'bg-pink-500',
  '#6366f1': 'bg-indigo-500',
};

export const ExploreView: React.FC<{
  profile: ProfileType;
  onOpenModule: (module: string) => void;
}> = ({ profile, onOpenModule }) => {
  const { activeModules, userEnabledModules, canAccessModule, loading } = usePlatform();
  const { profile: userProfile } = useAuth();

  // Map platform modules to display format
  const modules = activeModules.map(mod => {
    const Icon = ICON_MAP[mod.icon] || Package;
    const colorClass = COLOR_MAP[mod.color] || 'bg-indigo-500';
    const isEnabled = userEnabledModules.includes(mod.slug);
    const hasAccess = canAccessModule(mod.slug);

    return {
      id: mod.slug.toUpperCase(),
      slug: mod.slug,
      label: mod.name,
      icon: Icon,
      desc: mod.description,
      color: colorClass,
      isEnabled,
      hasAccess,
      tags: [mod.slug, mod.name.toLowerCase()],
    };
  });

  const filteredModules = modules;

  const handleModuleClick = (mod: (typeof modules)[0]) => {
    if (!mod.isEnabled) {
      // Redirect to enable the module in settings
      alert(`O módulo ${mod.label} não está ativado. Vá em Configurações para ativá-lo.`);
      return;
    }
    // Sempre abrir na página inicial do módulo (VITRINE para SHOP/CLASS/WORK, FEED para SOCIAL)
    const initialPage = mod.id === 'SOCIAL' ? 'feed' : 'vitrine';
    const accountType = userProfile?.type === ProfileType.BUSINESS ? 'business' : 'personal';
    window.location.href = `/${accountType}/${mod.slug}/${initialPage}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        title="Explorar Módulos"
        subtitle="Encontre todas as ferramentas e recursos que você precisa."
      />

      {/* Info about enabled modules */}
      {userEnabledModules.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Dica:</strong> Você ainda não ativou nenhum módulo. Clique em um módulo para
            começar a usar!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredModules.map(mod => {
          const Icon = mod.icon;
          const isLocked = !mod.isEnabled;

          return (
            <button
              key={mod.id}
              onClick={() => handleModuleClick(mod)}
              className={`relative flex flex-col text-left bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-300 group ${
                isLocked
                  ? 'opacity-75 hover:opacity-100'
                  : 'hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <Lock size={14} className="text-zinc-400" />
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-xl ${mod.color} flex items-center justify-center text-white mb-6 shadow-md ${isLocked ? 'opacity-50' : ''}`}
              >
                <Icon size={28} />
              </div>
              <h3
                className={`text-xl font-bold mb-2 transition-colors ${isLocked ? 'text-zinc-500' : 'group-hover:text-indigo-500'}`}
              >
                {mod.label}
              </h3>
              <p className="text-sm text-zinc-500 mb-6 flex-1">{mod.desc}</p>
              <div
                className={`flex items-center text-sm font-semibold ${isLocked ? 'text-zinc-400' : 'text-indigo-500'}`}
              >
                {isLocked ? 'Ativar Módulo' : 'Acessar Módulo'}
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          );
        })}
        {filteredModules.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum módulo encontrado</p>
            <p className="text-sm">Tente buscar por outras palavras-chave</p>
          </div>
        )}
      </div>

      {/* Module count */}
      <div className="mt-8 text-center text-sm text-zinc-500">
        {userEnabledModules.length} de {activeModules.length} módulos ativos
      </div>
    </div>
  );
};
