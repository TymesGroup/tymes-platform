import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  Plus,
  Paperclip,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  HelpCircle,
  CheckSquare,
  X,
  FileText,
} from 'lucide-react';
import { ProfileType } from '../../types';
import { useAIAssistant, ModuleAction } from './hooks/useAIAssistant';
import { SectionHeader } from '../../components/ui/SectionHeader';

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  HelpCircle,
  CheckSquare,
  MessageSquare,
  FileText,
};

// Typewriter hook
const useTypewriter = (text: string, speed: number = 10, enabled: boolean = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setIsTyping(true);
    setIsComplete(false);
    setDisplayedText('');

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isTyping, isComplete };
};

// Format message
const formatMessage = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
};

// AI Message - Left side
const AIMessage: React.FC<{
  content: string;
  messageId: string;
  isLatest: boolean;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: 'up' | 'down' | null) => void;
}> = ({ content, messageId, isLatest, onRegenerate, onFeedback }) => {
  const { displayedText, isTyping, isComplete } = useTypewriter(content, 8, isLatest);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    onFeedback(messageId, newFeedback);
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-3 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="group">
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-3">
            <p
              className="text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200"
              dangerouslySetInnerHTML={{
                __html:
                  formatMessage(displayedText) +
                  (isTyping
                    ? '<span class="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 animate-pulse align-middle"></span>'
                    : ''),
              }}
            />
          </div>

          {isComplete && (
            <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                title="Copiar"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button
                onClick={onRegenerate}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                title="Regenerar resposta"
              >
                <RefreshCw size={14} />
              </button>
              <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700 mx-0.5" />
              <button
                onClick={() => handleFeedback('up')}
                className={`p-1 rounded transition-all ${feedback === 'up' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Útil"
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={`p-1 rounded transition-all ${feedback === 'down' ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Não útil"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Message - Right side
const UserMessage: React.FC<{ content: string; metadata?: Record<string, unknown> }> = ({
  content,
  metadata,
}) => {
  const attachments = (metadata?.attachments as string[]) || [];

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%]">
        <div className="bg-violet-600 text-white rounded-2xl rounded-tr-md px-4 py-3">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
          {attachments.length > 0 && (
            <div className="mt-2 pt-2 border-t border-violet-500/30 flex flex-wrap gap-2">
              {attachments.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-violet-500/50 rounded text-xs hover:bg-violet-500/70 transition-colors"
                >
                  <FileText size={12} />
                  Arquivo {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Action Button
const ActionButton: React.FC<{ action: ModuleAction; onClick: () => void }> = ({
  action,
  onClick,
}) => {
  const Icon = ICON_MAP[action.icon] || HelpCircle;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-xs text-zinc-600 dark:text-zinc-400"
    >
      <Icon size={12} style={{ color: action.color }} />
      {action.label}
    </button>
  );
};

export const AIAgentView: React.FC<{ profile: ProfileType }> = ({ profile }) => {
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendMessage,
    selectConversation,
    deleteConversation,
    clearConversation,
    saveFeedback,
    getModuleActions,
    profile: userProfile,
  } = useAIAssistant();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [latestMessageId, setLatestMessageId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moduleActions = getModuleActions();

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Track latest AI message for typewriter
  useEffect(() => {
    const aiMsgs = messages.filter(m => m.role === 'assistant');
    if (aiMsgs.length > 0) {
      setLatestMessageId(aiMsgs[aiMsgs.length - 1].id);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const msg = input;
    setInput('');
    setAttachments([]);
    try {
      await sendMessage(msg, attachments);
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleRegenerate = async (originalPrompt: string) => {
    if (sending || !originalPrompt) return;
    setSending(true);
    try {
      await sendMessage(originalPrompt, []);
    } catch (err) {
      console.error('Error regenerating:', err);
    }
    setSending(false);
  };

  const handleActionClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files].slice(0, 5));
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleSelectConversation = async (conv: any) => {
    await selectConversation(conv);
    setShowHistory(false);
  };

  const isNewChat = messages.length === 0;
  const firstName = userProfile?.name?.split(' ')[0] || '';

  // Find last user message for regenerate
  const getLastUserMessage = () => {
    const userMsgs = messages.filter(m => m.role === 'user');
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].content : '';
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <SectionHeader title="Tymes AI" subtitle="Seu assistente inteligente" />
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-[calc(100vh-12rem)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader title="Tymes AI" subtitle="Seu assistente inteligente" />

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden h-[calc(100vh-12rem)] flex">
        {/* Sidebar - History */}
        <div
          className={`${showHistory ? 'w-72' : 'w-0'} transition-all duration-300 border-r border-zinc-100 dark:border-zinc-800 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 flex-shrink-0`}
        >
          <div className="w-72 h-full flex flex-col">
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
              <button
                onClick={clearConversation}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-sm font-medium"
              >
                <Plus size={16} />
                Nova conversa
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare
                    size={32}
                    className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2"
                  />
                  <p className="text-sm text-zinc-400">Nenhuma conversa</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        currentConversation?.id === conv.id
                          ? 'bg-violet-100 dark:bg-violet-900/30'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <MessageSquare
                        size={14}
                        className={
                          currentConversation?.id === conv.id ? 'text-violet-500' : 'text-zinc-400'
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{conv.title || 'Nova conversa'}</p>
                        <p className="text-[10px] text-zinc-400">{formatDate(conv.updated_at)}</p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500'}`}
              title="Histórico"
            >
              {showHistory ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
            <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate flex-1 font-medium">
              {currentConversation?.title || 'Histórico'}
            </span>
            <button
              onClick={clearConversation}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-500"
              title="Nova Conversa"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {isNewChat ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="max-w-md w-full text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 mb-6 shadow-lg shadow-violet-500/20">
                    <Sparkles size={32} className="text-white" />
                  </div>

                  <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {firstName ? `Olá, ${firstName}!` : 'Como posso ajudar?'}
                  </h1>
                  <p className="text-zinc-500 mb-8 text-sm">
                    Pergunte qualquer coisa sobre a plataforma
                  </p>

                  {/* Input */}
                  <div className="relative">
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus-within:border-violet-400 dark:focus-within:border-violet-500 transition-all">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Pergunte alguma coisa..."
                        rows={1}
                        className="w-full bg-transparent border-none resize-none text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none p-4 pb-14 max-h-32"
                      />

                      {attachments.length > 0 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                          {attachments.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-xs"
                            >
                              <FileText size={12} />
                              <span className="truncate max-w-[80px]">{file.name}</span>
                              <button
                                onClick={() => removeAttachment(i)}
                                className="hover:text-red-500"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-wrap">
                          {moduleActions.map(action => (
                            <ActionButton
                              key={action.id}
                              action={action}
                              onClick={() => handleActionClick(action.prompt)}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                            title="Anexar"
                          >
                            <Paperclip size={16} />
                          </button>
                          <button
                            onClick={handleSend}
                            disabled={!input.trim() || sending}
                            className="p-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            {sending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ArrowUp size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-4">
                    Tymes AI pode cometer erros. Verifique informações importantes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto pb-32">
                {messages.map(msg =>
                  msg.role === 'user' ? (
                    <UserMessage key={msg.id} content={msg.content} metadata={msg.metadata} />
                  ) : (
                    <AIMessage
                      key={msg.id}
                      content={msg.content}
                      messageId={msg.id}
                      isLatest={msg.id === latestMessageId}
                      onRegenerate={() => handleRegenerate(getLastUserMessage())}
                      onFeedback={saveFeedback}
                    />
                  )
                )}

                {sending && (
                  <div className="flex justify-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                        <Sparkles size={14} className="text-white animate-pulse" />
                      </div>
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <span
                            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Input */}
          {!isNewChat && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-zinc-900 via-white dark:via-zinc-900 to-transparent pt-6 pb-4 px-4">
              <div className="max-w-3xl mx-auto">
                {error && (
                  <div className="mb-2 p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700"
                      >
                        <FileText size={12} />
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <button onClick={() => removeAttachment(i)} className="hover:text-red-500">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus-within:border-violet-400 dark:focus-within:border-violet-500 transition-all">
                  <div className="flex items-end gap-2 p-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                      title="Anexar"
                    >
                      <Paperclip size={18} />
                    </button>

                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Envie uma mensagem..."
                      disabled={sending}
                      rows={1}
                      className="flex-1 bg-transparent border-none resize-none text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none py-2 max-h-32"
                    />

                    <button
                      onClick={handleSend}
                      disabled={sending || !input.trim()}
                      className="p-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      {sending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ArrowUp size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 text-center mt-2">
                  Tymes AI pode cometer erros. Verifique informações importantes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
