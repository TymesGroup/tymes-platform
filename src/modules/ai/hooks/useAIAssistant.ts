import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

// Types
export interface AIConversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string | null;
}

interface UserStats {
  totalProducts: number;
  totalCourses: number;
  completedTasks: number;
  totalPosts: number;
  totalOrders: number;
}

export interface ModuleAction {
  id: string;
  moduleSlug: string;
  moduleName: string;
  icon: string;
  label: string;
  prompt: string;
  color: string;
}

export function useAIAssistant() {
  const { user, profile } = useAuth();

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userModules, setUserModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's enabled modules
  const fetchUserModules = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('enabled_modules')
        .eq('id', user.id)
        .single();
      if (data?.enabled_modules) {
        setUserModules(data.enabled_modules);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  }, [user?.id]);

  // Fetch user statistics
  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [products, courses, tasks, posts, orders] = await Promise.all([
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
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      setUserStats({
        totalProducts: products.count || 0,
        totalCourses: courses.count || 0,
        completedTasks: tasks.count || 0,
        totalPosts: posts.count || 0,
        totalOrders: orders.count || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [user?.id]);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  }, [user?.id]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erro ao carregar mensagens');
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(
    async (title: string): Promise<AIConversation | null> => {
      if (!user?.id) return null;
      try {
        const { data, error: insertError } = await supabase
          .from('ai_conversations')
          .insert({ user_id: user.id, title })
          .select()
          .single();

        if (insertError) throw insertError;

        setConversations(prev => [data, ...prev]);
        setCurrentConversation(data);
        return data;
      } catch (err) {
        console.error('Error creating conversation:', err);
        setError('Erro ao criar conversa');
        return null;
      }
    },
    [user?.id]
  );

  // Upload file to Supabase storage
  const uploadFile = useCallback(
    async (file: File, conversationId: string): Promise<string | null> => {
      if (!user?.id) return null;
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${conversationId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('ai-attachments')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return null;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('ai-attachments').getPublicUrl(fileName);

        return publicUrl;
      } catch (err) {
        console.error('Error uploading file:', err);
        return null;
      }
    },
    [user?.id]
  );

  // Send message - main function
  const sendMessage = useCallback(
    async (content: string, attachments: File[] = []) => {
      if (!user?.id || !content.trim()) return;

      setError(null);
      let conv = currentConversation;

      // Create conversation if needed
      if (!conv) {
        const title = content.length > 50 ? content.slice(0, 50) + '...' : content;
        conv = await createConversation(title);
        if (!conv) return;
      }

      const conversationId = conv.id;

      // Upload attachments if any
      const uploadedUrls: string[] = [];
      for (const file of attachments) {
        const url = await uploadFile(file, conversationId);
        if (url) uploadedUrls.push(url);
      }

      // Build message content with attachments
      let fullContent = content;
      if (uploadedUrls.length > 0) {
        fullContent +=
          '\n\n📎 Anexos: ' + uploadedUrls.map((_, i) => `Arquivo ${i + 1}`).join(', ');
      }

      // Add user message to UI immediately
      const userMsg: AIMessage = {
        id: `user-${Date.now()}`,
        conversation_id: conversationId,
        role: 'user',
        content: fullContent,
        metadata: uploadedUrls.length > 0 ? { attachments: uploadedUrls } : undefined,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);

      try {
        // Save user message to database
        const { data: savedUserMsg, error: userErr } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            role: 'user',
            content: fullContent,
            metadata: uploadedUrls.length > 0 ? { attachments: uploadedUrls } : {},
          })
          .select()
          .single();

        if (userErr) {
          console.error('Error saving user message:', userErr);
          setError('Erro ao enviar mensagem');
          // Remove optimistic message on error
          setMessages(prev => prev.filter(m => m.id !== userMsg.id));
          return;
        }

        // Update user message with real ID
        setMessages(prev => prev.map(m => (m.id === userMsg.id ? savedUserMsg : m)));

        // Generate AI response
        const aiContent = generateAIResponse(
          content,
          profile?.type || 'PERSONAL',
          userStats,
          userModules
        );

        // Add AI message to UI
        const aiMsg: AIMessage = {
          id: `ai-${Date.now()}`,
          conversation_id: conversationId,
          role: 'assistant',
          content: aiContent,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);

        // Save AI message to database
        const { data: savedAiMsg, error: aiErr } = await supabase
          .from('ai_messages')
          .insert({ conversation_id: conversationId, role: 'assistant', content: aiContent })
          .select()
          .single();

        if (!aiErr && savedAiMsg) {
          setMessages(prev => prev.map(m => (m.id === aiMsg.id ? savedAiMsg : m)));
        }

        // Update conversation timestamp
        await supabase
          .from('ai_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);

        // Refresh conversations list
        fetchConversations();
      } catch (err) {
        console.error('Error in sendMessage:', err);
        setError('Erro ao processar mensagem');
      }
    },
    [
      user?.id,
      currentConversation,
      createConversation,
      profile?.type,
      userStats,
      userModules,
      fetchConversations,
      uploadFile,
    ]
  );

  // Select a conversation from history
  const selectConversation = useCallback(
    async (conversation: AIConversation) => {
      setCurrentConversation(conversation);
      setMessages([]);
      setError(null);
      await fetchMessages(conversation.id);
    },
    [fetchMessages]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        // Delete messages first
        await supabase.from('ai_messages').delete().eq('conversation_id', conversationId);
        // Delete conversation
        await supabase.from('ai_conversations').delete().eq('id', conversationId);

        // Update local state
        setConversations(prev => prev.filter(c => c.id !== conversationId));
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      } catch (err) {
        console.error('Error deleting conversation:', err);
        setError('Erro ao excluir conversa');
      }
    },
    [currentConversation?.id]
  );

  // Save feedback for a message
  const saveFeedback = useCallback(async (messageId: string, feedback: 'up' | 'down' | null) => {
    try {
      await supabase.from('ai_messages').update({ metadata: { feedback } }).eq('id', messageId);
    } catch (err) {
      console.error('Error saving feedback:', err);
    }
  }, []);

  // Clear current conversation (start new)
  const clearConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
    setError(null);
  }, []);

  // Get module-based actions
  const getModuleActions = useCallback((): ModuleAction[] => {
    const actions: ModuleAction[] = [];

    if (userModules.includes('shop')) {
      actions.push({
        id: 'shop',
        moduleSlug: 'shop',
        moduleName: 'Shop',
        icon: 'ShoppingBag',
        label: 'Vendas',
        prompt: 'Analise minhas vendas e me dê insights',
        color: '#8b5cf6',
      });
    }
    if (userModules.includes('class')) {
      actions.push({
        id: 'class',
        moduleSlug: 'class',
        moduleName: 'Class',
        icon: 'GraduationCap',
        label: 'Estudar',
        prompt: 'Crie um plano de estudos para mim',
        color: '#10b981',
      });
    }
    if (userModules.includes('work')) {
      actions.push({
        id: 'work',
        moduleSlug: 'work',
        moduleName: 'Work',
        icon: 'CheckSquare',
        label: 'Tarefas',
        prompt: 'Me ajude a organizar minhas tarefas',
        color: '#f59e0b',
      });
    }
    if (userModules.includes('social')) {
      actions.push({
        id: 'social',
        moduleSlug: 'social',
        moduleName: 'Social',
        icon: 'Users',
        label: 'Social',
        prompt: 'Me ajude a criar conteúdo',
        color: '#ec4899',
      });
    }

    // Always add help
    actions.push({
      id: 'help',
      moduleSlug: 'general',
      moduleName: 'Geral',
      icon: 'HelpCircle',
      label: 'Ajuda',
      prompt: 'O que você pode fazer?',
      color: '#6366f1',
    });

    return actions.slice(0, 4);
  }, [userModules]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([fetchConversations(), fetchUserStats(), fetchUserModules()]).finally(() =>
        setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchConversations, fetchUserStats, fetchUserModules]);

  return {
    conversations,
    currentConversation,
    messages,
    userStats,
    userModules,
    loading,
    error,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    clearConversation,
    saveFeedback,
    getModuleActions,
    profile,
  };
}

// Generate AI responses
function generateAIResponse(
  message: string,
  profileType: string,
  stats: UserStats | null,
  modules: string[]
): string {
  const lower = message.toLowerCase();
  const isBusiness = profileType === 'BUSINESS';

  // Shop
  if (lower.includes('venda') || lower.includes('produto') || lower.includes('loja')) {
    if (modules.includes('shop')) {
      return `📊 **Análise da Loja**\n\n${stats?.totalProducts ? `Você tem ${stats.totalProducts} produtos cadastrados.` : 'Nenhum produto cadastrado ainda.'}\n${stats?.totalOrders ? `${stats.totalOrders} pedidos realizados.` : ''}\n\n**Sugestões:**\n• Adicione fotos de qualidade\n• Revise os preços\n• Crie promoções\n\nPosso ajudar com algo específico?`;
    }
    return 'Ative o módulo Shop nas configurações para gerenciar produtos e vendas.';
  }

  // Class
  if (lower.includes('curso') || lower.includes('estudar') || lower.includes('aprender')) {
    if (modules.includes('class')) {
      return `📚 **Estudos**\n\n${stats?.totalCourses ? `Você está em ${stats.totalCourses} cursos.` : 'Nenhum curso iniciado.'}\n\n**Dicas:**\n• Defina metas diárias\n• Faça anotações\n• Pratique regularmente\n\nQuer recomendações de cursos?`;
    }
    return 'Ative o módulo Class para acessar cursos.';
  }

  // Work
  if (lower.includes('tarefa') || lower.includes('projeto') || lower.includes('organizar')) {
    if (modules.includes('work')) {
      return `✅ **Tarefas**\n\n${stats?.completedTasks ? `${stats.completedTasks} tarefas concluídas!` : 'Comece organizando suas tarefas.'}\n\n**Dicas:**\n• Priorize por urgência\n• Divida em etapas menores\n• Use a técnica Pomodoro\n\nPosso criar um plano?`;
    }
    return 'Ative o módulo Work para gerenciar tarefas.';
  }

  // Social
  if (lower.includes('social') || lower.includes('conteúdo') || lower.includes('post')) {
    if (modules.includes('social')) {
      return `💬 **Social**\n\n${stats?.totalPosts ? `${stats.totalPosts} publicações.` : 'Comece a publicar!'}\n\n**Estratégias:**\n• Publique regularmente\n• Interaja com a comunidade\n• Compartilhe conhecimento\n\nQuer ideias de conteúdo?`;
    }
    return 'Ative o módulo Social para conectar-se.';
  }

  // Help
  if (lower.includes('ajuda') || lower.includes('o que você pode') || lower.includes('help')) {
    const mods = modules.length > 0 ? modules.join(', ') : 'nenhum ativo';
    return `👋 **Olá! Sou a Tymes AI**\n\nPosso ajudar com:\n${modules.includes('shop') ? '• 🛒 Vendas e produtos\n' : ''}${modules.includes('class') ? '• 📚 Cursos e estudos\n' : ''}${modules.includes('work') ? '• ✅ Tarefas e projetos\n' : ''}${modules.includes('social') ? '• 💬 Conteúdo e conexões\n' : ''}• 📊 Análises gerais\n\n**Módulos ativos:** ${mods}\n\nComo posso ajudar?`;
  }

  // Greetings
  if (lower.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/)) {
    return isBusiness
      ? `Olá! 👋 Sou a Tymes AI.\n\n${stats?.totalProducts ? `Vi que você tem ${stats.totalProducts} produtos.` : ''} Como posso ajudar seu negócio?`
      : `Olá! 👋 Sou a Tymes AI.\n\nEstou aqui para ajudar. O que precisa?`;
  }

  // Thanks
  if (lower.match(/(obrigad|valeu|thanks)/)) {
    return 'Por nada! 😊 Precisa de mais alguma coisa?';
  }

  // Default
  return `Entendi! Posso ajudar com ${modules.length > 0 ? modules.join(', ') : 'diversas funcionalidades'}.\n\n💡 Seja mais específico para eu ajudar melhor. Exemplos:\n• "Analise minhas vendas"\n• "Organize minhas tarefas"\n• "Sugira cursos"`;
}
