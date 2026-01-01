import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  TrendingUp,
  Eye,
  Share2,
  Loader2,
  Target,
  Megaphone,
  BarChart3,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { ProfileType } from '../../../types';

interface SocialStats {
  totalPosts: number;
  totalLikes: number;
  totalConnections: number;
  recentViews: number;
}

interface SocialOverviewProps {
  profile?: ProfileType;
}

export const SocialOverview: React.FC<SocialOverviewProps> = ({ profile: profileType }) => {
  const { user, profile } = useAuth();
  const isBusiness = profileType === ProfileType.BUSINESS;
  const [stats, setStats] = useState<SocialStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalConnections: 0,
    recentViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    try {
      setLoading(true);

      // Fetch user's posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user?.id);

      // Fetch total likes on user's posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', user?.id);

      let totalLikes = 0;
      if (userPosts && userPosts.length > 0) {
        const postIds = userPosts.map(p => p.id);
        const { count: likesCount } = await supabase
          .from('post_likes')
          .select('*', { count: 'exact', head: true })
          .in('post_id', postIds);
        totalLikes = likesCount || 0;
      }

      // For now, connections and views are simulated since we don't have those tables yet
      // In a real app, you'd have a 'connections' or 'followers' table
      setStats({
        totalPosts: postsCount || 0,
        totalLikes,
        totalConnections: Math.floor(Math.random() * 50) + 10, // Simulated
        recentViews: Math.floor(Math.random() * 200) + 50, // Simulated
      });

      // Fetch recent posts for activity feed
      const { data: recent } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles (name, avatar_url)
        `
        )
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPosts(recent || []);
    } catch (error) {
      console.error('Error fetching social stats:', error);
    } finally {
      setLoading(false);
    }
  }

  // Cards de estatísticas - diferentes para cada tipo de conta
  const personalStatCards = [
    {
      title: 'Publicações',
      value: stats.totalPosts,
      icon: MessageSquare,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Curtidas Recebidas',
      value: stats.totalLikes,
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      title: 'Conexões',
      value: stats.totalConnections,
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Visualizações',
      value: stats.recentViews,
      icon: Eye,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  const businessStatCards = [
    {
      title: 'Seguidores',
      value: stats.totalConnections * 10,
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      change: '+12%',
    },
    {
      title: 'Engajamento',
      value: `${((stats.totalLikes / Math.max(stats.totalPosts, 1)) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      change: '+5.2%',
    },
    {
      title: 'Alcance Mensal',
      value: stats.recentViews * 15,
      icon: Eye,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      change: '+18%',
    },
    {
      title: 'Conversões',
      value: Math.floor(stats.totalLikes * 0.3),
      icon: Target,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      change: '+8%',
    },
  ];

  const statCards = isBusiness ? businessStatCards : personalStatCards;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader
        title={isBusiness ? 'Central de Marketing Social' : 'Visão Geral Social'}
        subtitle={
          isBusiness
            ? `Gerencie sua presença digital e alcance mais clientes`
            : `Olá, ${profile?.name?.split(' ')[0] || 'usuário'}! Veja como está sua presença social.`
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-bl-full opacity-50`}
            />
            <div className="relative z-10">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                {'change' in stat && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mb-1">
                    <ArrowUpRight size={12} />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Quick Actions */}
      {isBusiness && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Criar Campanha</h3>
                <p className="text-sm text-white/80">Promova sua marca</p>
              </div>
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Nova Campanha
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Impulsionar Post</h3>
                <p className="text-sm text-white/80">Aumente seu alcance</p>
              </div>
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Impulsionar
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Ver Relatório</h3>
                <p className="text-sm text-white/80">Métricas detalhadas</p>
              </div>
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Ver Analytics
            </button>
          </div>
        </div>
      )}

      {/* Personal User CTA */}
      {!isBusiness && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Conecte-se com Negócios</h3>
              <p className="text-sm text-white/80">
                Siga suas marcas favoritas e receba ofertas exclusivas
              </p>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Explorar
          </button>
        </div>
      )}

      {/* Account Type Badge - Business */}
      {isBusiness && (
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black rounded-xl p-5 text-white flex items-center justify-between border border-zinc-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Conta Business Pro</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                Você tem acesso a todos os recursos de marketing e analytics
              </p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
            Gerenciar Assinatura
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 dark:text-white">
            {isBusiness ? 'Interações Recentes' : 'Atividade Recente'}
          </h3>
          {isBusiness && <span className="text-xs text-zinc-500">Últimas 24 horas</span>}
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentPosts.length > 0 ? (
            recentPosts.map(post => (
              <div
                key={post.id}
                className="p-4 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
                    {post.profiles?.name?.[0] || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-900 dark:text-white">
                    <span className="font-medium">{post.profiles?.name || 'Usuário'}</span>
                    {isBusiness ? ' interagiu com seu conteúdo' : ' publicou: '}
                    {!isBusiness && (
                      <span className="text-zinc-500 truncate">
                        {post.content?.substring(0, 50)}...
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {isBusiness && (
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    Ver
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
