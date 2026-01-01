import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import type { Database } from '../../types/database.types';

// Types
export type ConversationRow = Database['public']['Tables']['conversations']['Row'];
export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ParticipantRow = Database['public']['Tables']['conversation_participants']['Row'];

export type ConversationWithDetails = {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  participants: ParticipantWithProfile[];
  lastMessage: MessageWithSender | null;
  unreadCount: number;
  updated_at: string | null;
};

export type ParticipantWithProfile = ParticipantRow & {
  profiles: Pick<ProfileRow, 'id' | 'name' | 'avatar_url' | 'type' | 'email'>;
};

export type MessageWithSender = MessageRow & {
  profiles: Pick<ProfileRow, 'id' | 'name' | 'avatar_url' | 'type'> | null;
  reply_to?: MessageWithSender | null;
};

export function useMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationWithDetails | null>(
    null
  );
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const presenceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get conversations where user is a participant
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select(
          `
                    *,
                    conversations (
                        id,
                        type,
                        name,
                        created_at,
                        updated_at
                    )
                `
        )
        .eq('user_id', user.id);

      if (partError) throw partError;

      // For each conversation, get participants and last message
      const conversationsWithDetails: ConversationWithDetails[] = await Promise.all(
        (participations || []).map(async part => {
          const conv = part.conversations as any;

          // Get all participants
          const { data: allParticipants } = await supabase
            .from('conversation_participants')
            .select(
              `
                            *,
                            profiles (
                                id,
                                name,
                                avatar_url,
                                type,
                                email
                            )
                        `
            )
            .eq('conversation_id', conv.id);

          // Get last message
          const { data: lastMessages } = await supabase
            .from('messages')
            .select(
              `
                            *,
                            profiles (
                                id,
                                name,
                                avatar_url,
                                type
                            )
                        `
            )
            .eq('conversation_id', conv.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(1);

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .gt('created_at', part.last_read_at || '1970-01-01');

          return {
            id: conv.id,
            type: conv.type,
            name: conv.name,
            participants: (allParticipants || []) as ParticipantWithProfile[],
            lastMessage: (lastMessages?.[0] as MessageWithSender) || null,
            unreadCount: unreadCount || 0,
            updated_at: lastMessages?.[0]?.created_at || conv.updated_at,
          };
        })
      );

      // Sort by last message time
      conversationsWithDetails.sort((a, b) => {
        const aTime = new Date(a.updated_at || 0).getTime();
        const bTime = new Date(b.updated_at || 0).getTime();
        return bTime - aTime;
      });

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!user) return;

      try {
        setMessagesLoading(true);

        const { data, error } = await supabase
          .from('messages')
          .select(
            `
                    *,
                    profiles (
                        id,
                        name,
                        avatar_url,
                        type
                    )
                `
          )
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;

        setMessages((data || []) as MessageWithSender[]);

        // Mark messages as read
        await supabase
          .from('conversation_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id);

        // Update unread count in local state
        setConversations(prev =>
          prev.map(conv => {
            if (conv.id === conversationId) {
              return { ...conv, unreadCount: 0 };
            }
            return conv;
          })
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setMessagesLoading(false);
      }
    },
    [user]
  );

  // Select a conversation
  const selectConversation = useCallback(
    async (conversationId: string) => {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setActiveConversation(conv);
        await fetchMessages(conversationId);

        // Subscribe to messages for this conversation
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }

        channelRef.current = supabase
          .channel(`messages:${conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            payload => {
              const newMessage = payload.new as MessageRow;
              // Fetch full message with profile
              supabase
                .from('messages')
                .select(
                  `
                            *,
                            profiles (
                                id,
                                name,
                                avatar_url,
                                type
                            )
                        `
                )
                .eq('id', newMessage.id)
                .single()
                .then(({ data }) => {
                  if (data) {
                    setMessages(prev => [...prev, data as MessageWithSender]);
                  }
                });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            payload => {
              const updatedMessage = payload.new as MessageRow;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
                )
              );
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            payload => {
              const deletedMessage = payload.old as MessageRow;
              setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
            }
          )
          .subscribe();

        // Set up presence channel for typing indicators
        if (presenceChannelRef.current) {
          supabase.removeChannel(presenceChannelRef.current);
        }

        presenceChannelRef.current = supabase
          .channel(`presence:${conversationId}`)
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannelRef.current?.presenceState() || {};
            const typing: string[] = [];
            Object.values(state).forEach((presences: any) => {
              presences.forEach((presence: any) => {
                if (presence.isTyping && presence.userId !== user?.id) {
                  typing.push(presence.userName || 'Alguém');
                }
              });
            });
            setTypingUsers(typing);
          })
          .subscribe();
      }
    },
    [conversations, fetchMessages, user]
  );

  // Send a message
  async function sendMessage(
    content: string,
    messageType: 'text' | 'image' | 'video' | 'file' | 'audio' = 'text',
    mediaUrl?: string,
    replyToId?: string
  ) {
    if (!user || !activeConversation) throw new Error('Conversa não selecionada');

    try {
      setSending(true);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation.id,
          sender_id: user.id,
          content,
          message_type: messageType,
          media_url: mediaUrl,
          reply_to_id: replyToId,
        })
        .select(
          `
                    *,
                    profiles (
                        id,
                        name,
                        avatar_url,
                        type
                    )
                `
        )
        .single();

      if (error) throw error;

      // Message will be added via real-time subscription
      // But also add optimistically
      setMessages(prev => [...prev, data as MessageWithSender]);

      // Notify other participants
      const otherParticipants = activeConversation.participants.filter(p => p.user_id !== user.id);
      for (const participant of otherParticipants) {
        await supabase.from('notifications').insert({
          user_id: participant.user_id,
          type: 'message',
          title: 'Nova mensagem',
          body: content.substring(0, 100),
          actor_id: user.id,
          entity_type: 'conversation',
          entity_id: activeConversation.id,
        });
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  }

  // Upload media for chat
  async function uploadChatMedia(file: File): Promise<string> {
    if (!user) throw new Error('Usuário não autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      // Fallback to posts bucket
      const { error: fallbackError } = await supabase.storage
        .from('posts')
        .upload(`chat/${fileName}`, file);

      if (fallbackError) throw fallbackError;

      const { data } = supabase.storage.from('posts').getPublicUrl(`chat/${fileName}`);
      return data.publicUrl;
    }

    const { data } = supabase.storage.from('chat-attachments').getPublicUrl(fileName);
    return data.publicUrl;
  }

  // Create or get a direct conversation with another user
  async function startDirectConversation(otherUserId: string): Promise<string> {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => {
        if (conv.type !== 'direct') return false;
        return conv.participants.some(p => p.user_id === otherUserId);
      });

      if (existingConv) {
        await selectConversation(existingConv.id);
        return existingConv.id;
      }

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'direct',
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: partError } = await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: user.id, role: 'admin' },
        { conversation_id: newConv.id, user_id: otherUserId, role: 'member' },
      ]);

      if (partError) throw partError;

      // Refresh conversations and select the new one
      await fetchConversations();
      await selectConversation(newConv.id);

      return newConv.id;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  // Create a group conversation
  async function createGroupConversation(name: string, participantIds: string[]): Promise<string> {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'group',
          name,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add creator as admin and others as members
      const participants = [
        { conversation_id: newConv.id, user_id: user.id, role: 'admin' as const },
        ...participantIds.map(id => ({
          conversation_id: newConv.id,
          user_id: id,
          role: 'member' as const,
        })),
      ];

      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (partError) throw partError;

      await fetchConversations();
      await selectConversation(newConv.id);

      return newConv.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  // Delete a message (soft delete)
  async function deleteMessage(messageId: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true, content: '[Mensagem apagada]' })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, is_deleted: true, content: '[Mensagem apagada]' } : msg
        )
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Edit a message
  async function editMessage(messageId: string, newContent: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, content: newContent, is_edited: true } : msg
        )
      );
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Broadcast typing status
  async function setTyping(isTyping: boolean) {
    if (!activeConversation || !user || !presenceChannelRef.current) return;

    try {
      await presenceChannelRef.current.track({
        userId: user.id,
        userName: user.user_metadata?.name || 'Usuário',
        isTyping,
      });
    } catch (error) {
      console.error('Error broadcasting typing status:', error);
    }
  }

  // Get total unread count
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchConversations();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
      }
    };
  }, [user?.id]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    typingUsers,
    totalUnreadCount,
    sendMessage,
    uploadChatMedia,
    selectConversation,
    startDirectConversation,
    createGroupConversation,
    deleteMessage,
    editMessage,
    setTyping,
    refreshConversations: fetchConversations,
  };
}
