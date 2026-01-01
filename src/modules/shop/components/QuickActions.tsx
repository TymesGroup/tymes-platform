import React from 'react';
import { Zap, Gift, Truck, Shield, Headphones, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onNavigate?: (page: string) => void;
}

const QUICK_ACTIONS = [
  {
    icon: Zap,
    title: 'Flash Sale',
    description: 'Ofertas relâmpago',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    action: 'OFFERS',
  },
  {
    icon: Gift,
    title: 'Cupons',
    description: 'Descontos exclusivos',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    action: 'OFFERS',
  },
  {
    icon: Truck,
    title: 'Frete Grátis',
    description: 'Acima de R$ 100',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    action: null,
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Proteção garantida',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    action: null,
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Atendimento rápido',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    action: null,
  },
  {
    icon: CreditCard,
    title: 'Parcelamento',
    description: 'Até 12x sem juros',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    action: null,
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const handleClick = (action: string | null) => {
    if (action && onNavigate) {
      onNavigate(action);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {QUICK_ACTIONS.map((action, idx) => {
        const Icon = action.icon;
        return (
          <button
            key={idx}
            onClick={() => handleClick(action.action)}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-pink-500/50 transition-all hover:shadow-lg"
          >
            <div
              className={`${action.bg} ${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
            >
              <Icon size={22} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                {action.title}
              </div>
              <div className="text-[10px] text-zinc-500">{action.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
