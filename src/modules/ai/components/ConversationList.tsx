import React from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import type { Tables } from '../../../lib/database.types';

type AIConversation = Tables<'ai_conversations'>;

interface ConversationListProps {
  conversations: AIConversation[];
  currentConversation: AIConversation | null;
  onSelect: (conversation: AIConversation) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversation,
  onSelect,
  onDelete,
  onNew,
}) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          Nova conversa
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-sm">Nenhuma conversa ainda</div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                currentConversation?.id === conv.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent'
              }`}
              onClick={() => onSelect(conv)}
            >
              <div
                className={`p-2 rounded-lg ${
                  currentConversation?.id === conv.id
                    ? 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                <MessageSquare size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {conv.title || 'Nova conversa'}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{formatDate(conv.updated_at)}</p>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-all"
                aria-label="Excluir conversa"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
