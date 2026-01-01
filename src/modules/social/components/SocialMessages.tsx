import React, { useState, useRef, useEffect } from 'react';
import { useMessages, ConversationWithDetails, MessageWithSender } from '../useMessages';
import { useConnections, ProfileRow } from '../useConnections';
import { useAuth } from '../../../lib/AuthContext';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Loader2,
  Smile,
  Paperclip,
  ArrowLeft,
  CheckCheck,
  Clock,
  Trash2,
  Copy,
  Reply,
  Users,
  X,
  UserPlus,
  Building2,
  User,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

function formatMessageTime(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatConversationTime(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000) return formatMessageTime(dateString);
  if (diff < 604800000) return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export const SocialMessages: React.FC = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    typingUsers,
    sendMessage,
    uploadChatMedia,
    selectConversation,
    deleteMessage,
    setTyping,
    startDirectConversation,
    refreshConversations,
  } = useMessages();
  const { followers, following } = useConnections();

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [replyingTo, setReplyingTo] = useState<MessageWithSender | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageMenuPosition, setMessageMenuPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setTyping(true);
    const timeout = setTimeout(() => setTyping(false), 2000);
    return () => clearTimeout(timeout);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !isUploading) || sending) return;
    try {
      await sendMessage(newMessage, 'text', undefined, replyingTo?.id);
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const url = await uploadChatMedia(file);
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        await sendMessage(type === 'image' ? 'Imagem' : file.name, type, url, replyingTo?.id);
      } catch (error) {
        console.error('Failed to upload file:', error);
        alert('Erro ao enviar arquivo.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleStartChat = async (userId: string) => {
    setStartingChat(userId);
    try {
      await startDirectConversation(userId);
      setShowMobileChat(true);
      setSearchQuery('');
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Erro ao iniciar conversa');
    } finally {
      setStartingChat(null);
    }
  };

  const handleConversationClick = (convId: string) => {
    selectConversation(convId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleMessageContextMenu = (e: React.MouseEvent, msgId: string) => {
    e.preventDefault();
    setSelectedMessageId(msgId);
    setMessageMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setSelectedMessageId(null);
    setMessageMenuPosition(null);
  };

  // Get other participant for direct chats
  const getOtherParticipant = (conv: ConversationWithDetails) => {
    return conv.participants.find(p => p.user_id !== user?.id)?.profiles;
  };

  // Combine followers and following for contacts
  const allContacts = [...followers, ...following].reduce((acc, contact) => {
    if (!acc.find(c => c.id === contact.id)) acc.push(contact);
    return acc;
  }, [] as ProfileRow[]);

  // Filter contacts by search
  const filteredContacts = searchQuery.trim()
    ? allContacts.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : allContacts;

  // Get conversation IDs that already exist with contacts
  const existingConvUserIds = new Set(
    conversations
      .filter(c => c.type === 'direct')
      .map(c => getOtherParticipant(c)?.id)
      .filter(Boolean)
  );

  // Contacts without existing conversations
  const contactsWithoutConv = filteredContacts.filter(c => !existingConvUserIds.has(c.id));

  // Filter existing conversations
  const filteredConversations = conversations.filter(
    c =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participants.some(p => p.profiles.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Contact item component
  const ContactItem: React.FC<{ contact: ProfileRow }> = ({ contact }) => (
    <button
      onClick={() => handleStartChat(contact.id)}
      disabled={startingChat === contact.id}
      className="w-full p-3 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors text-left rounded-lg"
    >
      <div className="relative">
        {contact.avatar_url ? (
          <img src={contact.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {contact.name?.[0] || '?'}
          </div>
        )}
        {contact.type === 'BUSINESS' && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white p-0.5 rounded-full border border-white dark:border-zinc-900">
            <Building2 size={8} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
          {contact.name}
        </h4>
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          {contact.type === 'BUSINESS' ? <Building2 size={10} /> : <User size={10} />}
          {contact.type === 'BUSINESS' ? 'Empresa' : 'Pessoal'}
        </p>
      </div>
      {startingChat === contact.id ? (
        <Loader2 size={16} className="animate-spin text-indigo-600" />
      ) : (
        <MessageSquare size={16} className="text-indigo-500" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div
      className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500"
      onClick={closeContextMenu}
    >
      <SectionHeader title="Mensagens" subtitle="Converse com suas conexões" />

      <div className="flex-1 flex bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-4 shadow-sm relative">
        {/* Sidebar - Contacts & Conversations */}
        <div
          className={`w-full md:w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col absolute md:relative inset-0 bg-white dark:bg-zinc-900 z-10 transition-transform duration-300 ${showMobileChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}
        >
          {/* Search */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar contatos ou conversas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Contacts Section - Show when searching or no conversations */}
            {(searchQuery.trim() || conversations.length === 0) &&
              contactsWithoutConv.length > 0 && (
                <div className="border-b border-zinc-100 dark:border-zinc-800">
                  <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <Users size={12} />
                      {searchQuery.trim() ? 'Contatos encontrados' : 'Suas conexões'}
                    </h3>
                  </div>
                  <div className="p-2">
                    {contactsWithoutConv.slice(0, searchQuery.trim() ? 10 : 5).map(contact => (
                      <ContactItem key={contact.id} contact={contact} />
                    ))}
                  </div>
                </div>
              )}

            {/* Existing Conversations */}
            {filteredConversations.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={12} />
                    Conversas
                  </h3>
                </div>
                {filteredConversations.map(conv => {
                  const otherUser = getOtherParticipant(conv);
                  const isSelected = activeConversation?.id === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleConversationClick(conv.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-50 dark:border-zinc-800/50 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}
                    >
                      <div className="relative">
                        {conv.type === 'group' ? (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Users size={20} />
                          </div>
                        ) : otherUser?.avatar_url ? (
                          <img
                            src={otherUser.avatar_url}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {otherUser?.name?.[0] || '?'}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                            {conv.type === 'group' ? conv.name : otherUser?.name}
                          </h4>
                          <span
                            className={`text-[10px] whitespace-nowrap ${conv.unreadCount > 0 ? 'text-indigo-600 font-bold' : 'text-zinc-400'}`}
                          >
                            {formatConversationTime(conv.updated_at)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-sm truncate max-w-[140px] ${conv.unreadCount > 0 ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500'}`}
                          >
                            {conv.lastMessage?.sender_id === user?.id && (
                              <span className="text-zinc-400">Você: </span>
                            )}
                            {conv.lastMessage?.content || 'Inicie uma conversa'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredConversations.length === 0 && contactsWithoutConv.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">
                  {searchQuery.trim() ? 'Nenhum resultado' : 'Nenhuma conversa'}
                </p>
                <p className="text-xs mt-1">
                  {searchQuery.trim() ? 'Tente outro termo' : 'Siga pessoas para conversar'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col absolute md:relative inset-0 bg-white dark:bg-zinc-900 z-20 transition-transform duration-300 ${showMobileChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  {activeConversation.type === 'group' ? (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Users size={18} />
                    </div>
                  ) : (
                    (() => {
                      const otherUser = getOtherParticipant(activeConversation);
                      return otherUser?.avatar_url ? (
                        <img
                          src={otherUser.avatar_url}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {otherUser?.name?.[0] || '?'}
                        </div>
                      );
                    })()
                  )}
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                      {activeConversation.type === 'group'
                        ? activeConversation.name
                        : getOtherParticipant(activeConversation)?.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {typingUsers.length > 0 ? `${typingUsers.join(', ')} digitando...` : 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-indigo-600">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-indigo-600">
                    <Video size={18} />
                  </button>
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-indigo-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">Nenhuma mensagem ainda</p>
                    <p className="text-xs">Envie a primeira mensagem!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.sender_id === user?.id;
                    const showAvatar =
                      !isMe && (index === 0 || messages[index - 1].sender_id !== msg.sender_id);
                    const showDate =
                      index === 0 ||
                      new Date(msg.created_at || '').getDate() !==
                        new Date(messages[index - 1].created_at || '').getDate();

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-wider">
                              {new Date(msg.created_at || '').toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex gap-3 group ${isMe ? 'justify-end' : 'justify-start'}`}
                          onContextMenu={e => handleMessageContextMenu(e, msg.id)}
                        >
                          {!isMe && (
                            <div className="w-8 shrink-0 flex flex-col justify-end">
                              {showAvatar &&
                                (msg.profiles?.avatar_url ? (
                                  <img
                                    src={msg.profiles.avatar_url}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                    {msg.profiles?.name?.[0]}
                                  </div>
                                ))}
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            {msg.message_type === 'image' && msg.media_url && (
                              <img
                                src={msg.media_url}
                                alt="Attachment"
                                className="max-w-full rounded-lg max-h-60 object-cover mb-1"
                              />
                            )}
                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-sm border border-zinc-100 dark:border-zinc-700'}`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <div
                                className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-indigo-200' : 'text-zinc-400'}`}
                              >
                                {msg.is_edited && <span>(editado)</span>}
                                <span>{formatMessageTime(msg.created_at)}</span>
                                {isMe &&
                                  (msg.created_at ? <CheckCheck size={12} /> : <Clock size={12} />)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg mb-2 border-l-4 border-indigo-500">
                    <div className="text-sm">
                      <p className="font-bold text-indigo-600 text-xs">
                        Respondendo a {replyingTo.profiles?.name}
                      </p>
                      <p className="text-zinc-500 truncate max-w-xs text-xs">
                        {replyingTo.content}
                      </p>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                  <div className="flex gap-1 pb-2">
                    <button
                      type="button"
                      className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                    <label className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*,audio/*,.pdf"
                      />
                      <Paperclip size={20} />
                    </label>
                  </div>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-700 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/20 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Digite sua mensagem..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 placeholder:text-zinc-400"
                      disabled={sending || isUploading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !isUploading) || sending}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none min-h-[44px] min-w-[44px] flex items-center justify-center transform active:scale-95"
                  >
                    {sending || isUploading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} className="ml-0.5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/30 dark:bg-zinc-900/30">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                <MessageSquare className="w-10 h-10 text-indigo-500/50" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                Suas mensagens
              </h3>
              <p className="max-w-xs text-center text-sm mb-8">
                Selecione uma conversa ou busque um contato para começar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {selectedMessageId && messageMenuPosition && (
        <div
          className="fixed z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-1 min-w-[160px] animate-in fade-in zoom-in duration-100"
          style={{ top: messageMenuPosition.y, left: messageMenuPosition.x }}
        >
          <button
            onClick={() => {
              const msg = messages.find(m => m.id === selectedMessageId);
              if (msg) setReplyingTo(msg);
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
          >
            <Reply size={14} /> Responder
          </button>
          <button
            onClick={() => {
              const msg = messages.find(m => m.id === selectedMessageId);
              if (msg?.content) navigator.clipboard.writeText(msg.content);
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
          >
            <Copy size={14} /> Copiar
          </button>
          {messages.find(m => m.id === selectedMessageId)?.sender_id === user?.id && (
            <>
              <div className="h-px bg-zinc-100 dark:bg-zinc-700 my-1" />
              <button
                onClick={() => {
                  deleteMessage(selectedMessageId!);
                  closeContextMenu();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={14} /> Apagar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
