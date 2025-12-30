import React from 'react';
import { useNotifications } from '../useNotifications';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Heart, MessageSquare, UserPlus, Share2, Bell, Loader2, Check } from 'lucide-react';

function timeAgo(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('pt-BR');
}

export const SocialNotifications: React.FC = () => {
  const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" fill="currentColor" />;
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" fill="currentColor" />;
      case 'follow':
        return <UserPlus size={16} className="text-emerald-500" />;
      case 'share':
        return <Share2 size={16} className="text-indigo-500" />;
      case 'message':
        return <MessageSquare size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} className="text-zinc-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'comment':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'follow':
        return 'bg-emerald-100 dark:bg-emerald-900/20';
      case 'share':
        return 'bg-indigo-100 dark:bg-indigo-900/20';
      case 'message':
        return 'bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          title="Notificações"
          subtitle="Fique por dentro do que acontece na sua rede"
        />
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            <Check size={16} /> Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                notification.is_read
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  : 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30'
              }`}
            >
              <div className="relative shrink-0">
                {notification.actor?.avatar_url ? (
                  <img
                    src={notification.actor.avatar_url}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {notification.actor?.name?.[0] || '?'}
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 ${getBgColor(notification.type)}`}
                >
                  {getIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-900 dark:text-white">
                  <span className="font-bold">{notification.actor?.name}</span> {notification.body}
                </p>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                  {timeAgo(notification.created_at)}
                  {notification.title && (
                    <>
                      <span>•</span>
                      <span>{notification.title}</span>
                    </>
                  )}
                </p>
              </div>

              {!notification.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Nenhuma notificação</p>
            <p className="text-sm">Você está atualizado!</p>
          </div>
        )}
      </div>
    </div>
  );
};
