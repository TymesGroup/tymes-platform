import React from 'react';
import { Check, CreditCard, Calendar, Package, ArrowRight } from 'lucide-react';
import { usePlatform } from '../../../lib/PlatformContext';

export const SubscriptionSettings: React.FC = () => {
  const { plans, userPlan, userSubscription, loading } = usePlatform();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentPlan = userPlan || plans.find(p => p.slug === 'free');

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
          Seu Plano Atual
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          Gerencie sua assinatura e veja os planos disponíveis
        </p>

        {currentPlan && (
          <div
            className={`p-6 rounded-xl border-2 ${
              currentPlan.is_highlighted
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {currentPlan.name}
                  </h4>
                  {currentPlan.is_highlighted && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 mt-1">{currentPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {currentPlan.price === 0 ? 'Grátis' : `R$ ${currentPlan.price.toFixed(2)}`}
                </p>
                {currentPlan.price > 0 && <p className="text-sm text-zinc-500">/mês</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Package className="w-4 h-4" />
                <span>{currentPlan.modules_included?.length || 0} módulos incluídos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <CreditCard className="w-4 h-4" />
                <span>{currentPlan.max_storage_gb}GB de armazenamento</span>
              </div>
            </div>

            {userSubscription && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Ativo desde {new Date(userSubscription.started_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      {currentPlan && (
        <div>
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Recursos incluídos
          </h4>
          <div className="grid gap-2">
            {(currentPlan.features || []).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Planos Disponíveis
        </h3>
        <div className="grid gap-4">
          {plans
            .filter(p => p.id !== currentPlan?.id)
            .map(plan => (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  plan.is_highlighted
                    ? 'border-indigo-300 dark:border-indigo-700'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-zinc-900 dark:text-white">{plan.name}</h4>
                      {plan.is_highlighted && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">{plan.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}/mês`}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                      {plan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Mudar'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Cancel Subscription */}
      {userSubscription && currentPlan && currentPlan.price > 0 && (
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
            Cancelar assinatura
          </button>
        </div>
      )}
    </div>
  );
};
