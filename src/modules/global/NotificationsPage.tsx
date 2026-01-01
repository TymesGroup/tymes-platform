/**
 * NotificationsPage - Global Notifications Page
 * Página global de notificações acessível de qualquer módulo
 */

import React, { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
  Megaphone,
  AlertCircle,
} from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface NotificationsPageProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'order' | 'course' | 'work' | 'social' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  order: ShoppingBag,
  course: GraduationCap,
  work: Briefcase,
  social: Users,
  promo: Megaphone,
  system: AlertCircle,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  order: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  course: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  work: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  social: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  promo: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  system: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
};

const MODULE_FILTERS = [
  { id: 'all', label: 'Todos', icon: Bell },
  { id: 'order', label: 'Shop', icon: ShoppingBag },
  { id: 'course', label: 'Class', icon: GraduationCap },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'social', label: 'Social', icon: Users },
];

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Pedido confirmado',
      message: 'Seu pedido #12345 foi confirmado e está sendo preparado para envio.',
      time: '2 min atrás',
      read: false,
    },
    {
      id: '2',
      type: 'promo',
      title: 'Oferta especial para você!',
      message: 'Aproveite 20% de desconto em todos os cursos este fim de semana.',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: '3',
      type: 'course',
      title: 'Novo conteúdo disponível',
      message: 'O módulo 5 do curso "React Avançado" já está disponível.',
      time: '3 horas atrás',
      read: false,
    },
    {
      id: '4',
      type: 'social',
      title: 'Nova conexão',
      message: 'Maria Silva começou a seguir você.',
      time: '5 horas atrás',
      read: true,
    },
    {
      id: '5',
      type: 'work',
      title: 'Proposta recebida',
      message: 'Você recebeu uma nova proposta para o projeto "Design de Landing Page".',
      time: '1 dia atrás',
      read: true,
    },
  ]);

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter(
          n => n.type === activeFilter || (activeFilter === 'order' && n.type === 'promo')
        );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader
        title="Notificações"
        subtitle={`${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}`}
      />

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {MODULE_FILTERS.map(filter => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </button>
            );
          })}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <CheckCheck size={14} />
                Marcar lidas
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredNotifications.map(notification => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
              const colorClass = NOTIFICATION_COLORS[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`group p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                    !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5 line-clamp-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-zinc-400 mt-1 block">{notification.time}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              title="Nenhuma notificação"
              description="Você está em dia! Novas notificações aparecerão aqui."
              icon={Bell}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
