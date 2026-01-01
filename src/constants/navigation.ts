import {
  LayoutDashboard,
  Compass,
  Settings,
  Bot,
  ShoppingBag,
  Tag,
  GraduationCap,
  Library,
  Award,
  Briefcase,
  CheckSquare,
  Users,
  MessageSquare,
  PieChart,
  Sliders,
  Package,
  Megaphone,
  BarChart3,
  Target,
  BookOpen,
  FileText,
  CreditCard,
  TrendingUp,
  Database,
} from 'lucide-react';
import { ModuleType, ProfileType, NavItem } from '../types';

export const ROOT_NAV_ITEMS: NavItem[] = [
  {
    id: ModuleType.DASHBOARD,
    label: 'Visão Geral',
    icon: LayoutDashboard,
    allowedProfiles: [ProfileType.SUPERADMIN, ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.EXPLORE,
    label: 'Explorar',
    icon: Compass,
    allowedProfiles: [ProfileType.SUPERADMIN, ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.AI_AGENT,
    label: 'Tymes AI',
    icon: Bot,
    allowedProfiles: [ProfileType.SUPERADMIN, ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
  {
    id: ModuleType.SETTINGS,
    label: 'Configurações',
    icon: Settings,
    allowedProfiles: [ProfileType.SUPERADMIN, ProfileType.PERSONAL, ProfileType.BUSINESS],
  },
];

interface SubMenuItem {
  id: string;
  label: string;
  icon: any;
  allowedProfiles?: ProfileType[];
  description?: string; // Descrição contextual para o tipo de conta
}

export const MODULE_MENUS: Record<string, { title: string; items: SubMenuItem[] }> = {
  SHOP: {
    title: 'Shop',
    items: [
      { id: 'VITRINE', label: 'Inicial', icon: ShoppingBag },
      {
        id: 'INVENTORY',
        label: 'Meus Produtos',
        icon: Package,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      { id: 'OVERVIEW', label: 'Visão Geral', icon: PieChart },
      { id: 'OFFERS', label: 'Ofertas', icon: Tag },
      { id: 'SETTINGS', label: 'Configurações', icon: Sliders },
    ],
  },
  CLASS: {
    title: 'Class',
    items: [
      { id: 'VITRINE', label: 'Inicial', icon: GraduationCap },
      { id: 'LIBRARY', label: 'Meus Cursos', icon: Library },
      { id: 'CERTIFICATES', label: 'Certificados', icon: Award },
      {
        id: 'TEACHING',
        label: 'Área do Professor',
        icon: Briefcase,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      {
        id: 'CONTENT',
        label: 'Gerenciar Conteúdo',
        icon: FileText,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      { id: 'OVERVIEW', label: 'Visão Geral', icon: PieChart },
      { id: 'SETTINGS', label: 'Configurações', icon: Sliders },
    ],
  },
  WORK: {
    title: 'Work',
    items: [
      { id: 'VITRINE', label: 'Inicial', icon: Briefcase },
      { id: 'PROJECTS', label: 'Projetos', icon: BookOpen },
      { id: 'TASKS', label: 'Tarefas', icon: CheckSquare },
      {
        id: 'MY_SERVICES',
        label: 'Meus Serviços',
        icon: Package,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      { id: 'TEAM', label: 'Equipe', icon: Users, allowedProfiles: [ProfileType.BUSINESS] },
      { id: 'OVERVIEW', label: 'Visão Geral', icon: PieChart },
      { id: 'SETTINGS', label: 'Configurações', icon: Sliders },
    ],
  },
  SOCIAL: {
    title: 'Social',
    items: [
      { id: 'FEED', label: 'Feed', icon: Compass },
      { id: 'PROFILE', label: 'Meu Perfil', icon: Users },
      { id: 'CONNECTIONS', label: 'Conexões', icon: Users },
      { id: 'MESSAGES', label: 'Mensagens', icon: MessageSquare },
      {
        id: 'CAMPAIGNS',
        label: 'Campanhas',
        icon: Megaphone,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      {
        id: 'ANALYTICS',
        label: 'Analytics',
        icon: BarChart3,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      {
        id: 'PROMOTIONS',
        label: 'Promoções',
        icon: Target,
        allowedProfiles: [ProfileType.BUSINESS],
      },
      { id: 'OVERVIEW', label: 'Visão Geral', icon: PieChart },
      { id: 'SETTINGS', label: 'Configurações', icon: Sliders },
    ],
  },
  SUPERADMIN: {
    title: 'Administração',
    items: [
      {
        id: 'DASHBOARD',
        label: 'Dashboard',
        icon: PieChart,
        allowedProfiles: [ProfileType.SUPERADMIN],
      },
      { id: 'USERS', label: 'Usuários', icon: Users, allowedProfiles: [ProfileType.SUPERADMIN] },
      { id: 'MODULES', label: 'Módulos', icon: Package, allowedProfiles: [ProfileType.SUPERADMIN] },
      { id: 'PLANS', label: 'Planos', icon: CreditCard, allowedProfiles: [ProfileType.SUPERADMIN] },
      {
        id: 'ANALYTICS',
        label: 'Analytics',
        icon: TrendingUp,
        allowedProfiles: [ProfileType.SUPERADMIN],
      },
      {
        id: 'SYSTEM_SETTINGS',
        label: 'Sistema',
        icon: Database,
        allowedProfiles: [ProfileType.SUPERADMIN],
      },
    ],
  },
};
