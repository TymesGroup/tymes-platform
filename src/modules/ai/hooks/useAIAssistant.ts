import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { dataCache, CACHE_KEYS } from '../../../lib/dataCache';

// Types based on database schema
interface AIConversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string | null;
}

interface AISuggestion {
  id: string;
  user_id: string;
  suggestion_type: string;
  title: string;
  description: string | null;
  action_data?: Record<string, unknown>;
  priority: number;
  is_dismissed: boolean;
  expires_at: string | null;
  created_at: string | null;
}

interface UserStats {
  totalPurchases: number;
  totalCourses: number;
  completedTasks: number;
  totalPosts: number;
  totalConnections: number;
}

export function useAIAssistant() {
  const { user, profile } = useAuth();
  const conversationsCacheKey = user?.id ? CACHE_KEYS.AI_CONVERSATIONS(user.id) : '';
  const suggestionsCacheKey = user?.id ? CACHE_KEYS.AI_SUGGESTIONS(user.id) : '';

  // Initialize from cache immediately
  const [conversations, setConversations] = useState<AIConversation[]>(() => {
    if (!user?.id) return [];
    return dataCache.get<AIConversation[]>(conversationsCacheKey) || [];
  });
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(() => {
    if (!user?.id) return [];
    return dataCache.get<AISuggestion[]>(suggestionsCacheKey) || [];
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(() => {
    if (!user?.id) return false;
    return !dataCache.has(conversationsCacheKey);
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch user statistics for personalized suggestions
  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [purchasesResult, coursesResult, tasksResult, postsResult] = await Promise.all([
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('created_by', user.id),
        supabase
          .from('course_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'done'),
        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('author_id', user.id),
      ]);

      setUserStats({
        totalPurchases: purchasesResult.count || 0,
        totalCourses: coursesResult.count || 0,
        completedTasks: tasksResult.count || 0,
        totalPosts: postsResult.count || 0,
        totalConnections: 0,
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }, [user?.id]);

  // Fetch conversations with cache
  const fetchConversations = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return;

      try {
        if (!dataCache.has(conversationsCacheKey)) {
          setLoading(true);
        }

        const data = await dataCache.getOrFetch<AIConversation[]>(
          conversationsCacheKey,
          async () => {
            const { data, error: fetchError } = await supabase
              .from('ai_conversations')
              .select('*')
              .eq('user_id', user.id)
              .order('updated_at', { ascending: false });

            if (fetchError) throw fetchError;
            return data || [];
          },
          { forceRefresh }
        );

        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Erro ao carregar conversas');
      } finally {
        setLoading(false);
      }
    },
    [user?.id, conversationsCacheKey]
  );

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Erro ao carregar mensagens');
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erro ao carregar mensagens');
    }
  }, []);

  // Fetch suggestions with cache
  const fetchSuggestions = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return;

      try {
        const data = await dataCache.getOrFetch<AISuggestion[]>(
          suggestionsCacheKey,
          async () => {
            const { data, error: fetchError } = await supabase
              .from('ai_suggestions')
              .select('*')
              .eq('user_id', user.id)
              .eq('is_dismissed', false)
              .order('priority', { ascending: false })
              .limit(6);

            if (fetchError) {
              console.log('Suggestions table not available:', fetchError.message);
              return [];
            }
            return data || [];
          },
          { forceRefresh }
        );

        setSuggestions(data);
      } catch (err) {
        console.log('Error fetching suggestions:', err);
      }
    },
    [user?.id, suggestionsCacheKey]
  );

  // Create new conversation
  const createConversation = useCallback(
    async (title?: string) => {
      if (!user?.id) return null;

      try {
        const { data, error: insertError } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            title: title || 'Nova conversa',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating conversation:', insertError);
          setError('Erro ao criar conversa');
          return null;
        }

        // Update cache
        dataCache.update<AIConversation[]>(conversationsCacheKey, current => [
          data,
          ...(current || []),
        ]);
        setConversations(prev => [data, ...prev]);
        setCurrentConversation(data);
        setMessages([]);
        return data;
      } catch (err) {
        console.error('Error creating conversation:', err);
        setError('Erro ao criar conversa');
        return null;
      }
    },
    [user?.id, conversationsCacheKey]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user?.id || !content.trim()) return;

      setError(null);
      let conversation = currentConversation;

      // Create conversation if none exists
      if (!conversation) {
        // Use first few words as title
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        conversation = await createConversation(title);
        if (!conversation) return;
      }

      // Optimistically add user message to UI
      const tempUserMessage: AIMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversation.id,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempUserMessage]);

      try {
        // Add user message to database
        const { data: userMessage, error: userError } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversation.id,
            role: 'user' as const,
            content,
          })
          .select()
          .single();

        if (userError) {
          console.error('Error saving user message:', userError);
          setError('Erro ao enviar mensagem');
          // Remove temp message on error
          setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
          return;
        }

        // Replace temp message with real one
        setMessages(prev => prev.map(m => (m.id === tempUserMessage.id ? userMessage : m)));

        // Generate AI response based on profile type and context
        const aiResponse = generateAIResponse(content, profile?.type || 'PERSONAL', userStats);

        // Add AI response to database
        const { data: assistantMessage, error: assistantError } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversation.id,
            role: 'assistant' as const,
            content: aiResponse,
          })
          .select()
          .single();

        if (assistantError) {
          console.error('Error saving assistant message:', assistantError);
          setError('Erro ao gerar resposta');
          return;
        }

        setMessages(prev => [...prev, assistantMessage]);

        // Update conversation title if it's the first message
        if (messages.length === 0) {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
          await supabase.from('ai_conversations').update({ title }).eq('id', conversation.id);

          setConversations(prev =>
            prev.map(c => (c.id === conversation!.id ? { ...c, title } : c))
          );
        }

        // Log activity
        await logActivity('ai_chat', 'ai_conversation', conversation.id);
      } catch (err) {
        console.error('Error in sendMessage:', err);
        setError('Erro ao processar mensagem');
        // Remove temp message on error
        setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      }
    },
    [currentConversation, createConversation, user?.id, profile?.type, userStats, messages.length]
  );

  // Dismiss suggestion
  const dismissSuggestion = useCallback(
    async (suggestionId: string) => {
      // Optimistic update
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      dataCache.update<AISuggestion[]>(suggestionsCacheKey, current =>
        (current || []).filter(s => s.id !== suggestionId)
      );

      try {
        await supabase.from('ai_suggestions').update({ is_dismissed: true }).eq('id', suggestionId);
      } catch (err) {
        console.error('Error dismissing suggestion:', err);
        fetchSuggestions(true); // Revert on error
      }
    },
    [suggestionsCacheKey, fetchSuggestions]
  );

  // Log user activity
  const logActivity = useCallback(
    async (
      activityType: string,
      entityType?: string,
      entityId?: string,
      metadata?: Record<string, unknown>
    ) => {
      if (!user?.id) return;

      try {
        await supabase.from('user_activity_log').insert({
          user_id: user.id,
          activity_type: activityType,
          entity_type: entityType,
          entity_id: entityId,
          metadata: metadata || {},
        });
      } catch (err) {
        // Silent fail for activity logging
        console.log('Activity log error:', err);
      }
    },
    [user?.id]
  );

  // Select conversation
  const selectConversation = useCallback(
    async (conversation: AIConversation) => {
      setCurrentConversation(conversation);
      setMessages([]);
      await fetchMessages(conversation.id);
    },
    [fetchMessages]
  );

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      // Optimistic update
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      dataCache.update<AIConversation[]>(conversationsCacheKey, current =>
        (current || []).filter(c => c.id !== conversationId)
      );

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      try {
        const { error: deleteError } = await supabase
          .from('ai_conversations')
          .delete()
          .eq('id', conversationId);

        if (deleteError) {
          console.error('Error deleting conversation:', deleteError);
          setError('Erro ao excluir conversa');
          fetchConversations(true); // Revert on error
        }
      } catch (err) {
        console.error('Error deleting conversation:', err);
        setError('Erro ao excluir conversa');
        fetchConversations(true); // Revert on error
      }
    },
    [currentConversation?.id, conversationsCacheKey, fetchConversations]
  );

  // Clear current conversation (start new chat)
  const clearConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      // Only show loading if no cached data
      if (!dataCache.has(conversationsCacheKey)) {
        setLoading(true);
      }
      setError(null);
      Promise.all([fetchConversations(), fetchSuggestions(), fetchUserStats()]).finally(() =>
        setLoading(false)
      );

      // Subscribe to cache updates
      const unsubConv = dataCache.subscribe<AIConversation[]>(
        conversationsCacheKey,
        setConversations
      );
      const unsubSugg = dataCache.subscribe<AISuggestion[]>(suggestionsCacheKey, setSuggestions);

      return () => {
        unsubConv();
        unsubSugg();
      };
    } else {
      setLoading(false);
    }
  }, [
    user?.id,
    fetchConversations,
    fetchSuggestions,
    fetchUserStats,
    conversationsCacheKey,
    suggestionsCacheKey,
  ]);

  // Subscribe to realtime updates for messages
  useEffect(() => {
    if (!currentConversation?.id) return;

    const channel = supabase
      .channel(`ai_messages:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        payload => {
          const newMessage = payload.new as AIMessage;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation?.id]);

  return {
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
    logActivity,
    profile,
  };
}

// Helper function to generate contextual AI responses
function generateAIResponse(
  userMessage: string,
  profileType: string,
  stats: UserStats | null
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Business-specific responses
  if (profileType === 'BUSINESS') {
    if (lowerMessage.includes('venda') || lowerMessage.includes('produto')) {
      return `Analisando seus dados de vendas... ${stats?.totalPurchases ? `Você tem ${stats.totalPurchases} produtos cadastrados.` : ''} Posso ajudar com estratégias de precificação, análise de mercado ou otimização do seu catálogo. O que prefere explorar?`;
    }
    if (lowerMessage.includes('equipe') || lowerMessage.includes('funcionário')) {
      return 'Para gestão de equipe, recomendo utilizar o módulo Work. Lá você pode atribuir tarefas, acompanhar produtividade e gerenciar projetos. Quer que eu explique como configurar?';
    }
    if (lowerMessage.includes('marketing') || lowerMessage.includes('campanha')) {
      return 'No módulo Social, você tem acesso a ferramentas de campanhas e analytics. Posso ajudar a criar uma estratégia de conteúdo ou analisar o engajamento das suas publicações.';
    }
    if (lowerMessage.includes('relatório') || lowerMessage.includes('dashboard')) {
      return 'Posso gerar relatórios personalizados sobre vendas, engajamento e performance. Qual período você gostaria de analisar?';
    }
  }

  // Personal-specific responses
  if (profileType === 'PERSONAL') {
    if (
      lowerMessage.includes('curso') ||
      lowerMessage.includes('aprender') ||
      lowerMessage.includes('estudar')
    ) {
      return `${stats?.totalCourses ? `Você está matriculado em ${stats.totalCourses} cursos.` : 'Você ainda não começou nenhum curso.'} Posso recomendar cursos baseados nos seus interesses ou ajudar a organizar seu plano de estudos. O que te interessa aprender?`;
    }
    if (
      lowerMessage.includes('tarefa') ||
      lowerMessage.includes('organizar') ||
      lowerMessage.includes('agenda')
    ) {
      return `${stats?.completedTasks ? `Parabéns! Você já completou ${stats.completedTasks} tarefas.` : ''} Posso ajudar a priorizar suas atividades ou criar um cronograma personalizado. Quer começar?`;
    }
    if (
      lowerMessage.includes('comprar') ||
      lowerMessage.includes('loja') ||
      lowerMessage.includes('produto')
    ) {
      return 'Posso ajudar você a encontrar os melhores produtos na nossa loja! Está procurando algo específico ou quer ver as novidades?';
    }
  }

  // Generic responses
  if (
    lowerMessage.includes('ajuda') ||
    lowerMessage.includes('help') ||
    lowerMessage.includes('o que você pode')
  ) {
    return profileType === 'BUSINESS'
      ? 'Posso ajudar com: 📊 Análise de vendas e métricas\n👥 Gestão de equipe e tarefas\n📱 Estratégias de marketing\n📈 Relatórios e dashboards\n🛒 Gestão de produtos\n\nSobre o que gostaria de saber mais?'
      : 'Posso ajudar com: ✅ Organização de tarefas\n📚 Recomendações de cursos\n🛍️ Dicas de compras\n📅 Gestão de agenda\n💡 Sugestões personalizadas\n\nComo posso ser útil?';
  }

  if (
    lowerMessage.includes('olá') ||
    lowerMessage.includes('oi') ||
    lowerMessage.includes('bom dia') ||
    lowerMessage.includes('boa tarde') ||
    lowerMessage.includes('boa noite')
  ) {
    const greeting =
      profileType === 'BUSINESS'
        ? `Olá! 👋 Sou seu assistente de negócios. ${stats?.totalPurchases ? `Vi que você tem ${stats.totalPurchases} produtos na loja.` : ''} Como posso ajudar a impulsionar seu negócio hoje?`
        : `Olá! 👋 Sou seu assistente pessoal. ${stats?.totalCourses ? `Você está progredindo bem nos seus ${stats.totalCourses} cursos!` : ''} Em que posso ajudar?`;
    return greeting;
  }

  if (
    lowerMessage.includes('obrigado') ||
    lowerMessage.includes('valeu') ||
    lowerMessage.includes('thanks')
  ) {
    return 'Por nada! 😊 Estou aqui sempre que precisar. Tem mais alguma dúvida?';
  }

  // Default response with context
  const contextualHint =
    profileType === 'BUSINESS'
      ? 'Posso ajudar com vendas, marketing, gestão de equipe ou análise de dados.'
      : 'Posso ajudar com estudos, organização, compras ou recomendações.';

  return `Entendi sua mensagem! ${contextualHint}\n\n💡 Dica: Em breve terei integração com IA avançada para respostas ainda mais personalizadas. Por enquanto, posso ajudar com as funcionalidades básicas da plataforma.`;
}
