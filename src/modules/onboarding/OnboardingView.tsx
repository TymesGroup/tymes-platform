import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Check,
  ArrowRight,
  Sparkles,
  Package,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { usePlatform } from '../../lib/PlatformContext';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Package,
};

const GRADIENT_MAP: Record<string, string> = {
  '#f59e0b': 'from-amber-500 to-orange-600',
  '#3b82f6': 'from-blue-500 to-indigo-600',
  '#8b5cf6': 'from-purple-500 to-pink-600',
  '#22c55e': 'from-green-500 to-emerald-600',
  '#ec4899': 'from-pink-500 to-rose-600',
  '#6366f1': 'from-indigo-500 to-purple-600',
};

export const OnboardingView: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const { activeModules, updateUserModules, loading: platformLoading } = usePlatform();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // If coming from a specific module, pre-select it
    const preferredModule = location.state?.preferredModule;
    if (preferredModule && !selectedModules.includes(preferredModule)) {
      setSelectedModules([preferredModule]);
    }
  }, [user, location.state, navigate]);

  const toggleModule = (moduleSlug: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleSlug) ? prev.filter(m => m !== moduleSlug) : [...prev, moduleSlug]
    );
  };

  const handleContinue = async () => {
    if (selectedModules.length === 0) {
      alert('Selecione pelo menos um módulo');
      return;
    }

    setLoading(true);

    try {
      const result = await updateUserModules(selectedModules);

      if (!result.success) {
        console.error('Error saving modules:', result.error);
        alert('Erro ao salvar preferências');
        setLoading(false);
        return;
      }

      console.log('✅ Modules saved successfully:', selectedModules);

      // If coming from a specific module, open that module
      const preferredModule = location.state?.preferredModule;
      if (preferredModule && selectedModules.includes(preferredModule)) {
        navigate('/app', { state: { openModule: preferredModule.toUpperCase() } });
      } else {
        navigate('/app');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro inesperado');
      setLoading(false);
    }
  };

  if (platformLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 animate-pulse mx-auto mb-4">
            T
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      {!profile ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 animate-pulse">
              T
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Criando seu perfil...</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Aguarde um momento</p>
        </div>
      ) : (
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                T
              </div>
              <span className="text-2xl font-bold">Tymes</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-medium">Bem-vindo, {profile?.name}!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Escolha seus módulos</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Selecione os módulos que você deseja usar. Você pode ativar ou desativar módulos a
              qualquer momento.
            </p>
          </div>

          {/* Modules Grid - Dynamic from Platform */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {activeModules.map(module => {
              const Icon = ICON_MAP[module.icon] || Package;
              const gradient = GRADIENT_MAP[module.color] || 'from-indigo-500 to-purple-600';
              const isSelected = selectedModules.includes(module.slug);

              return (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.slug)}
                  className={`relative p-8 rounded-3xl text-left transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border-2 border-indigo-600 shadow-xl scale-105'
                      : 'bg-white/80 dark:bg-zinc-900/80 border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
                  >
                    <Icon size={32} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{module.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{module.description}</p>

                  {module.status === 'beta' && (
                    <span className="inline-block mt-3 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                      Beta
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeModules.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum módulo disponível no momento</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleContinue}
              disabled={loading || selectedModules.length === 0}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Continuar'}
              <ArrowRight size={20} />
            </button>

            {selectedModules.length > 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {selectedModules.length}{' '}
                {selectedModules.length === 1 ? 'módulo selecionado' : 'módulos selecionados'}
              </p>
            )}
          </div>

          {/* Skip */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/app')}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Pular por enquanto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
