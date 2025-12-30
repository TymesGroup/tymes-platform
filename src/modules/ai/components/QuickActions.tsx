import React from 'react';
import {
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  ShoppingCart,
  BookOpen,
  CheckSquare,
  Users,
  Megaphone,
  TrendingUp,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  prompt: string;
}

interface QuickActionsProps {
  profileType: string;
  onSelectAction: (prompt: string) => void;
}

const businessActions: QuickAction[] = [
  {
    id: 'sales',
    label: 'Análise de vendas',
    icon: BarChart3,
    prompt: 'Faça uma análise das minhas vendas recentes e sugira melhorias',
  },
  {
    id: 'report',
    label: 'Gerar relatório',
    icon: FileText,
    prompt: 'Gere um relatório resumido do meu negócio',
  },
  {
    id: 'marketing',
    label: 'Ideias de marketing',
    icon: Megaphone,
    prompt: 'Sugira estratégias de marketing para meu negócio',
  },
  {
    id: 'team',
    label: 'Gestão de equipe',
    icon: Users,
    prompt: 'Como posso melhorar a produtividade da minha equipe?',
  },
  {
    id: 'growth',
    label: 'Crescimento',
    icon: TrendingUp,
    prompt: 'Quais são as melhores estratégias para crescer meu negócio?',
  },
  {
    id: 'schedule',
    label: 'Agenda da semana',
    icon: Calendar,
    prompt: 'Organize minha agenda de compromissos da semana',
  },
];

const personalActions: QuickAction[] = [
  {
    id: 'tasks',
    label: 'Organizar tarefas',
    icon: CheckSquare,
    prompt: 'Me ajude a organizar minhas tarefas pendentes',
  },
  {
    id: 'study',
    label: 'Plano de estudos',
    icon: BookOpen,
    prompt: 'Crie um plano de estudos personalizado para mim',
  },
  {
    id: 'shopping',
    label: 'Lista de compras',
    icon: ShoppingCart,
    prompt: 'Me ajude a criar uma lista de compras inteligente',
  },
  {
    id: 'schedule',
    label: 'Agenda da semana',
    icon: Calendar,
    prompt: 'Organize minha agenda da semana',
  },
  {
    id: 'social',
    label: 'Dicas sociais',
    icon: MessageSquare,
    prompt: 'Sugira formas de expandir minha rede de contatos',
  },
  {
    id: 'goals',
    label: 'Metas pessoais',
    icon: TrendingUp,
    prompt: 'Me ajude a definir e acompanhar minhas metas pessoais',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ profileType, onSelectAction }) => {
  const actions = profileType === 'BUSINESS' ? businessActions : personalActions;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onSelectAction(action.prompt)}
          className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all text-left group"
        >
          <action.icon
            size={16}
            className="text-zinc-400 group-hover:text-indigo-500 transition-colors flex-shrink-0"
          />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};
