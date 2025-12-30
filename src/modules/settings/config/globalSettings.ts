import { ProfileType } from '../../../types';
import { GlobalSettingsConfig, SettingSection } from '../types';

// Configurações comuns a todos os tipos de conta
const commonSettings: SettingSection[] = [
  {
    id: 'appearance',
    title: 'Aparência',
    icon: 'Palette',
    settings: [
      {
        id: 'theme',
        label: 'Tema',
        description: 'Escolha o tema da interface',
        type: 'select',
        defaultValue: 'system',
        options: [
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Escuro' },
          { value: 'system', label: 'Sistema' },
        ],
      },
      {
        id: 'language',
        label: 'Idioma',
        description: 'Idioma da plataforma',
        type: 'select',
        defaultValue: 'pt-BR',
        options: [
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en-US', label: 'English (US)' },
          { value: 'es', label: 'Español' },
        ],
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: 'Bell',
    settings: [
      {
        id: 'email_notifications',
        label: 'Notificações por Email',
        description: 'Receba atualizações importantes por email',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'push_notifications',
        label: 'Notificações Push',
        description: 'Receba notificações no navegador',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'notification_sound',
        label: 'Som de Notificação',
        description: 'Tocar som ao receber notificações',
        type: 'toggle',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'security',
    title: 'Segurança',
    icon: 'Shield',
    settings: [
      {
        id: 'two_factor_auth',
        label: 'Autenticação de Dois Fatores',
        description: 'Adicione uma camada extra de segurança',
        type: 'toggle',
        defaultValue: false,
      },
      {
        id: 'session_timeout',
        label: 'Tempo de Sessão',
        description: 'Tempo até logout automático por inatividade',
        type: 'select',
        defaultValue: '30',
        options: [
          { value: '15', label: '15 minutos' },
          { value: '30', label: '30 minutos' },
          { value: '60', label: '1 hora' },
          { value: '120', label: '2 horas' },
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacidade',
    icon: 'Eye',
    settings: [
      {
        id: 'profile_visibility',
        label: 'Visibilidade do Perfil',
        description: 'Quem pode ver seu perfil',
        type: 'select',
        defaultValue: 'public',
        options: [
          { value: 'public', label: 'Público' },
          { value: 'connections', label: 'Apenas Conexões' },
          { value: 'private', label: 'Privado' },
        ],
      },
      {
        id: 'show_online_status',
        label: 'Mostrar Status Online',
        description: 'Permitir que outros vejam quando você está online',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
];

// Configurações específicas para SUPERADMIN
const superadminSettings: SettingSection[] = [
  {
    id: 'admin_platform',
    title: 'Administração da Plataforma',
    icon: 'Settings2',
    settings: [
      {
        id: 'maintenance_mode',
        label: 'Modo de Manutenção',
        description: 'Ativar modo de manutenção para todos os usuários',
        type: 'toggle',
        defaultValue: false,
      },
      {
        id: 'new_registrations',
        label: 'Novos Cadastros',
        description: 'Permitir novos cadastros na plataforma',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'default_user_type',
        label: 'Tipo de Usuário Padrão',
        description: 'Tipo de conta para novos usuários',
        type: 'select',
        defaultValue: 'PERSONAL',
        options: [
          { value: 'PERSONAL', label: 'Pessoal' },
          { value: 'BUSINESS', label: 'Empresarial' },
        ],
      },
    ],
  },
  {
    id: 'admin_modules',
    title: 'Gerenciamento de Módulos',
    icon: 'Boxes',
    settings: [
      {
        id: 'enable_shop',
        label: 'Módulo Shop',
        description: 'Habilitar módulo de loja para a plataforma',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'enable_social',
        label: 'Módulo Social',
        description: 'Habilitar módulo social para a plataforma',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'enable_ai',
        label: 'Módulo IA',
        description: 'Habilitar assistente de IA para a plataforma',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'enable_class',
        label: 'Módulo Aulas',
        description: 'Habilitar módulo de aulas para a plataforma',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'admin_analytics',
    title: 'Analytics e Relatórios',
    icon: 'BarChart3',
    settings: [
      {
        id: 'collect_analytics',
        label: 'Coletar Analytics',
        description: 'Coletar dados de uso da plataforma',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'report_frequency',
        label: 'Frequência de Relatórios',
        description: 'Com que frequência gerar relatórios automáticos',
        type: 'select',
        defaultValue: 'weekly',
        options: [
          { value: 'daily', label: 'Diário' },
          { value: 'weekly', label: 'Semanal' },
          { value: 'monthly', label: 'Mensal' },
        ],
      },
    ],
  },
];

// Configurações específicas para PERSONAL
const personalSettings: SettingSection[] = [
  {
    id: 'personal_preferences',
    title: 'Preferências Pessoais',
    icon: 'User',
    settings: [
      {
        id: 'content_recommendations',
        label: 'Recomendações de Conteúdo',
        description: 'Receber sugestões personalizadas de conteúdo',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'weekly_digest',
        label: 'Resumo Semanal',
        description: 'Receber resumo semanal de atividades',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'personal_social',
    title: 'Configurações Sociais',
    icon: 'Users',
    settings: [
      {
        id: 'allow_messages',
        label: 'Permitir Mensagens',
        description: 'Quem pode enviar mensagens diretas',
        type: 'select',
        defaultValue: 'connections',
        options: [
          { value: 'everyone', label: 'Todos' },
          { value: 'connections', label: 'Apenas Conexões' },
          { value: 'none', label: 'Ninguém' },
        ],
      },
      {
        id: 'show_activity',
        label: 'Mostrar Atividade',
        description: 'Exibir suas atividades recentes no perfil',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
];

// Configurações específicas para BUSINESS
const businessSettings: SettingSection[] = [
  {
    id: 'business_profile',
    title: 'Perfil Empresarial',
    icon: 'Building2',
    settings: [
      {
        id: 'company_name',
        label: 'Nome da Empresa',
        description: 'Nome exibido publicamente',
        type: 'text',
        defaultValue: '',
      },
      {
        id: 'business_category',
        label: 'Categoria do Negócio',
        description: 'Tipo de negócio',
        type: 'select',
        defaultValue: 'retail',
        options: [
          { value: 'retail', label: 'Varejo' },
          { value: 'services', label: 'Serviços' },
          { value: 'technology', label: 'Tecnologia' },
          { value: 'education', label: 'Educação' },
          { value: 'other', label: 'Outro' },
        ],
      },
    ],
  },
  {
    id: 'business_commerce',
    title: 'Configurações de Comércio',
    icon: 'ShoppingBag',
    settings: [
      {
        id: 'accept_orders',
        label: 'Aceitar Pedidos',
        description: 'Permitir que clientes façam pedidos',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'order_notifications',
        label: 'Notificações de Pedidos',
        description: 'Receber alertas de novos pedidos',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'auto_confirm_orders',
        label: 'Confirmar Pedidos Automaticamente',
        description: 'Confirmar pedidos sem revisão manual',
        type: 'toggle',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'business_analytics',
    title: 'Analytics do Negócio',
    icon: 'TrendingUp',
    settings: [
      {
        id: 'sales_reports',
        label: 'Relatórios de Vendas',
        description: 'Frequência dos relatórios de vendas',
        type: 'select',
        defaultValue: 'weekly',
        options: [
          { value: 'daily', label: 'Diário' },
          { value: 'weekly', label: 'Semanal' },
          { value: 'monthly', label: 'Mensal' },
        ],
      },
      {
        id: 'competitor_insights',
        label: 'Insights de Mercado',
        description: 'Receber análises de mercado e concorrência',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
];

export const globalSettingsConfig: GlobalSettingsConfig = {
  common: commonSettings,
  [ProfileType.SUPERADMIN]: superadminSettings,
  [ProfileType.PERSONAL]: personalSettings,
  [ProfileType.BUSINESS]: businessSettings,
};
