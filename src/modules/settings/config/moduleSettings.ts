import { ProfileType } from '../../../types';
import { ModuleSettingsConfig, SettingSection } from '../types';

// Configurações do módulo Shop
export const shopSettingsConfig: ModuleSettingsConfig = {
  moduleId: 'shop',
  moduleName: 'Shop',
  sections: {
    common: [
      {
        id: 'shop_notifications',
        title: 'Notificações',
        icon: 'Bell',
        settings: [
          {
            id: 'order_updates',
            label: 'Atualizações de Pedidos',
            description: 'Receber notificações sobre status de pedidos',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'price_alerts',
            label: 'Alertas de Preço',
            description: 'Notificar quando produtos favoritados baixarem de preço',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
    ],
    [ProfileType.BUSINESS]: [
      {
        id: 'shop_inventory',
        title: 'Inventário',
        icon: 'Package',
        settings: [
          {
            id: 'low_stock_alert',
            label: 'Alerta de Estoque Baixo',
            description: 'Notificar quando estoque estiver baixo',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'low_stock_threshold',
            label: 'Limite de Estoque Baixo',
            description: 'Quantidade mínima para alerta',
            type: 'number',
            defaultValue: 10,
          },
          {
            id: 'auto_hide_out_of_stock',
            label: 'Ocultar Produtos Sem Estoque',
            description: 'Esconder automaticamente produtos esgotados',
            type: 'toggle',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'shop_sales',
        title: 'Vendas',
        icon: 'DollarSign',
        settings: [
          {
            id: 'instant_checkout',
            label: 'Checkout Instantâneo',
            description: 'Permitir compra com um clique',
            type: 'toggle',
            defaultValue: false,
          },
          {
            id: 'allow_offers',
            label: 'Permitir Ofertas',
            description: 'Clientes podem fazer ofertas em produtos',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
    ],
    [ProfileType.PERSONAL]: [
      {
        id: 'shop_preferences',
        title: 'Preferências de Compra',
        icon: 'Heart',
        settings: [
          {
            id: 'save_payment_info',
            label: 'Salvar Informações de Pagamento',
            description: 'Lembrar dados de pagamento para compras futuras',
            type: 'toggle',
            defaultValue: false,
          },
          {
            id: 'wishlist_public',
            label: 'Lista de Desejos Pública',
            description: 'Permitir que outros vejam sua lista de desejos',
            type: 'toggle',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

// Configurações do módulo Social
export const socialSettingsConfig: ModuleSettingsConfig = {
  moduleId: 'social',
  moduleName: 'Social',
  sections: {
    common: [
      {
        id: 'social_privacy',
        title: 'Privacidade',
        icon: 'Lock',
        settings: [
          {
            id: 'default_post_visibility',
            label: 'Visibilidade Padrão de Posts',
            description: 'Quem pode ver seus posts por padrão',
            type: 'select',
            defaultValue: 'public',
            options: [
              { value: 'public', label: 'Público' },
              { value: 'connections', label: 'Apenas Conexões' },
              { value: 'private', label: 'Privado' },
            ],
          },
          {
            id: 'allow_comments',
            label: 'Permitir Comentários',
            description: 'Permitir comentários em seus posts',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'allow_shares',
            label: 'Permitir Compartilhamentos',
            description: 'Permitir que outros compartilhem seus posts',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'social_notifications',
        title: 'Notificações',
        icon: 'Bell',
        settings: [
          {
            id: 'notify_likes',
            label: 'Curtidas',
            description: 'Notificar quando curtirem seus posts',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'notify_comments',
            label: 'Comentários',
            description: 'Notificar quando comentarem em seus posts',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'notify_follows',
            label: 'Novos Seguidores',
            description: 'Notificar quando alguém começar a seguir você',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'notify_mentions',
            label: 'Menções',
            description: 'Notificar quando for mencionado',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
    ],
    [ProfileType.BUSINESS]: [
      {
        id: 'social_business',
        title: 'Configurações de Negócio',
        icon: 'Building2',
        settings: [
          {
            id: 'auto_reply',
            label: 'Resposta Automática',
            description: 'Enviar resposta automática para mensagens',
            type: 'toggle',
            defaultValue: false,
          },
          {
            id: 'business_hours_only',
            label: 'Apenas Horário Comercial',
            description: 'Mostrar online apenas em horário comercial',
            type: 'toggle',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

// Configurações do módulo AI
export const aiSettingsConfig: ModuleSettingsConfig = {
  moduleId: 'ai',
  moduleName: 'Assistente IA',
  sections: {
    common: [
      {
        id: 'ai_behavior',
        title: 'Comportamento',
        icon: 'Bot',
        settings: [
          {
            id: 'ai_personality',
            label: 'Personalidade',
            description: 'Estilo de comunicação do assistente',
            type: 'select',
            defaultValue: 'friendly',
            options: [
              { value: 'professional', label: 'Profissional' },
              { value: 'friendly', label: 'Amigável' },
              { value: 'concise', label: 'Conciso' },
            ],
          },
          {
            id: 'save_history',
            label: 'Salvar Histórico',
            description: 'Manter histórico de conversas',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'context_awareness',
            label: 'Consciência de Contexto',
            description: 'IA considera conversas anteriores',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'ai_suggestions',
        title: 'Sugestões',
        icon: 'Lightbulb',
        settings: [
          {
            id: 'proactive_suggestions',
            label: 'Sugestões Proativas',
            description: 'IA oferece sugestões sem ser perguntada',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'suggestion_frequency',
            label: 'Frequência de Sugestões',
            description: 'Com que frequência receber sugestões',
            type: 'select',
            defaultValue: 'moderate',
            options: [
              { value: 'low', label: 'Baixa' },
              { value: 'moderate', label: 'Moderada' },
              { value: 'high', label: 'Alta' },
            ],
          },
        ],
      },
    ],
  },
};

// Configurações do módulo Class
export const classSettingsConfig: ModuleSettingsConfig = {
  moduleId: 'class',
  moduleName: 'Aulas',
  sections: {
    common: [
      {
        id: 'class_learning',
        title: 'Aprendizado',
        icon: 'GraduationCap',
        settings: [
          {
            id: 'auto_play_next',
            label: 'Reprodução Automática',
            description: 'Iniciar próxima aula automaticamente',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'playback_speed',
            label: 'Velocidade Padrão',
            description: 'Velocidade de reprodução dos vídeos',
            type: 'select',
            defaultValue: '1',
            options: [
              { value: '0.5', label: '0.5x' },
              { value: '0.75', label: '0.75x' },
              { value: '1', label: '1x' },
              { value: '1.25', label: '1.25x' },
              { value: '1.5', label: '1.5x' },
              { value: '2', label: '2x' },
            ],
          },
          {
            id: 'show_subtitles',
            label: 'Legendas',
            description: 'Exibir legendas quando disponíveis',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'class_reminders',
        title: 'Lembretes',
        icon: 'Clock',
        settings: [
          {
            id: 'study_reminders',
            label: 'Lembretes de Estudo',
            description: 'Receber lembretes para estudar',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'reminder_time',
            label: 'Horário do Lembrete',
            description: 'Horário preferido para lembretes',
            type: 'select',
            defaultValue: '19:00',
            options: [
              { value: '08:00', label: '08:00' },
              { value: '12:00', label: '12:00' },
              { value: '19:00', label: '19:00' },
              { value: '21:00', label: '21:00' },
            ],
          },
        ],
      },
    ],
    [ProfileType.BUSINESS]: [
      {
        id: 'class_instructor',
        title: 'Instrutor',
        icon: 'UserCheck',
        settings: [
          {
            id: 'allow_questions',
            label: 'Permitir Perguntas',
            description: 'Alunos podem fazer perguntas nas aulas',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'certificate_enabled',
            label: 'Emitir Certificados',
            description: 'Gerar certificados ao concluir cursos',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
    ],
  },
};

// Configurações do módulo Work
export const workSettingsConfig: ModuleSettingsConfig = {
  moduleId: 'work',
  moduleName: 'Trabalho',
  sections: {
    common: [
      {
        id: 'work_tasks',
        title: 'Tarefas',
        icon: 'CheckSquare',
        settings: [
          {
            id: 'default_view',
            label: 'Visualização Padrão',
            description: 'Como exibir tarefas por padrão',
            type: 'select',
            defaultValue: 'kanban',
            options: [
              { value: 'list', label: 'Lista' },
              { value: 'kanban', label: 'Kanban' },
              { value: 'calendar', label: 'Calendário' },
            ],
          },
          {
            id: 'show_completed',
            label: 'Mostrar Concluídas',
            description: 'Exibir tarefas concluídas',
            type: 'toggle',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'work_reminders',
        title: 'Lembretes',
        icon: 'Bell',
        settings: [
          {
            id: 'deadline_reminders',
            label: 'Lembretes de Prazo',
            description: 'Notificar antes do vencimento de tarefas',
            type: 'toggle',
            defaultValue: true,
          },
          {
            id: 'reminder_advance',
            label: 'Antecedência do Lembrete',
            description: 'Quanto tempo antes do prazo notificar',
            type: 'select',
            defaultValue: '1d',
            options: [
              { value: '1h', label: '1 hora' },
              { value: '3h', label: '3 horas' },
              { value: '1d', label: '1 dia' },
              { value: '3d', label: '3 dias' },
            ],
          },
        ],
      },
    ],
  },
};

// Mapa de configurações por módulo
export const moduleSettingsMap: Record<string, ModuleSettingsConfig> = {
  shop: shopSettingsConfig,
  social: socialSettingsConfig,
  ai: aiSettingsConfig,
  class: classSettingsConfig,
  work: workSettingsConfig,
};
