import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, History, ChevronLeft, Loader2 } from 'lucide-react';
import { ProfileType } from '../../types';
import { useAIAssistant } from './hooks/useAIAssistant';
import { SuggestionCard } from './components/SuggestionCard';
import { QuickActions } from './components/QuickActions';
import { ConversationList } from './components/ConversationList';
import { StatsOverview } from './components/StatsOverview';

export const AIAgentView: React.FC<{ profile: ProfileType }> = ({ profile }) => {
  const {
    conversations,
    currentConversation,
    messages,
    suggestions,
    userStats,
    loading,
    error,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    dismissSuggestion,
    clearConversation,
    profile: userProfile,
  } = useAIAssistant();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    const message = input;
    setInput('');

    await sendMessage(message);
    setSending(false);
    inputRef.current?.focus();
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const profileType = userProfile?.type || profile;
  const isNewChat = !currentConversation && messages.length === 0;

  // Default suggestions based on profile type
  const defaultSuggestions =
    profileType === 'BUSINESS'
      ? [
          {
            id: '1',
            type: 'growth',
            title: 'Aumente suas vendas',
            description: 'Descubra estratégias para impulsionar seu negócio',
          },
          {
            id: '2',
            type: 'insight',
            title: 'Análise de mercado',
            description: 'Entenda as tendências do seu setor',
          },
          {
            id: '3',
            type: 'social',
            title: 'Expanda sua rede',
            description: 'Conecte-se com potenciais parceiros',
          },
        ]
      : [
          {
            id: '1',
            type: 'learning',
            title: 'Continue aprendendo',
            description: 'Recomendações de cursos para você',
          },
          {
            id: '2',
            type: 'goal',
            title: 'Defina suas metas',
            description: 'Organize seus objetivos pessoais',
          },
          {
            id: '3',
            type: 'insight',
            title: 'Dicas do dia',
            description: 'Sugestões personalizadas para você',
          },
        ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Sidebar - Conversation History */}
      <div
        className={`${showHistory ? 'w-72' : 'w-0'} transition-all duration-300 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50`}
      >
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelect={selectConversation}
          onDelete={deleteConversation}
          onNew={clearConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label={showHistory ? 'Ocultar histórico' : 'Mostrar histórico'}
          >
            {showHistory ? <ChevronLeft size={20} /> : <History size={20} />}
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Bot size={20} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Tymes AI</h3>
            <p className="text-xs text-zinc-500">
              {profileType === 'BUSINESS' ? 'Business Intelligence' : 'Personal Assistant'}
            </p>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isNewChat ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl mb-4">
                  <Sparkles size={28} />
                </div>

                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                  Olá{userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : ''}!
                </h2>

                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
                  {profileType === 'BUSINESS'
                    ? 'Sou seu assistente de negócios. Posso ajudar com análises, estratégias e gestão do seu empreendimento.'
                    : 'Sou seu assistente pessoal. Posso ajudar com organização, estudos e recomendações personalizadas.'}
                </p>

                {/* Stats Overview */}
                <div className="w-full max-w-sm mb-6">
                  <StatsOverview stats={userStats} profileType={profileType} />
                </div>

                {/* Suggestions */}
                <div className="w-full mb-6">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-500" />
                    Sugestões para você
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {displaySuggestions.slice(0, 3).map(suggestion => (
                      <SuggestionCard
                        key={suggestion.id}
                        id={suggestion.id}
                        type={suggestion.suggestion_type || suggestion.type}
                        title={suggestion.title}
                        description={suggestion.description}
                        onDismiss={dismissSuggestion}
                        onAction={() =>
                          handleQuickAction(`Me fale mais sobre: ${suggestion.title}`)
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    Ações rápidas
                  </h3>
                  <QuickActions profileType={profileType} onSelectAction={handleQuickAction} />
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2">
                    <Bot size={14} />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm p-4">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Digite sua mensagem..."
                disabled={sending}
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Enviar mensagem"
              >
                {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>

            <p className="text-xs text-zinc-400 text-center mt-2">
              Tymes AI pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
