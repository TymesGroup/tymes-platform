import React from 'react';
import { MessageSquare, Trash2, Plus, Sparkles, Clock } from 'lucide-react';
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

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (groups, conv) => {
      const date = formatDate(conv.updated_at);
      if (!groups[date]) groups[date] = [];
      groups[date].push(conv);
      return groups;
    },
    {} as Record<string, AIConversation[]>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Histórico</h3>
            <p className="text-[11px] text-zinc-500">{conversations.length} conversas</p>
          </div>
        </div>

        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-500/20"
        >
          <Plus size={16} />
          Nova conversa
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-500 mb-1">Nenhuma conversa</p>
            <p className="text-xs text-zinc-400">Comece uma nova conversa</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Clock size={10} className="text-zinc-400" />
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    {date}
                  </span>
                </div>
                <div className="space-y-1">
                  {convs.map(conv => (
                    <div
                      key={conv.id}
                      className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        currentConversation?.id === conv.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent'
                      }`}
                      onClick={() => onSelect(conv)}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          currentConversation?.id === conv.id
                            ? 'bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                        }`}
                      >
                        <MessageSquare size={14} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate transition-colors ${
                            currentConversation?.id === conv.id
                              ? 'text-purple-900 dark:text-purple-100'
                              : 'text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {conv.title || 'Nova conversa'}
                        </p>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-all duration-200"
                        aria-label="Excluir conversa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
