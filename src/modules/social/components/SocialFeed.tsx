import React from 'react';
import { useSocial } from '../useSocial';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { Loader2, TrendingUp, Megaphone, Sparkles, Target, AlertCircle } from 'lucide-react';
import { ProfileType } from '../../../types';

interface SocialFeedProps {
  profile?: ProfileType;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ profile = ProfileType.PERSONAL }) => {
  const { posts, loading, error, createPost, toggleLike, refreshPosts } = useSocial();
  const isBusiness = profile === ProfileType.BUSINESS;

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-zinc-500 text-sm">Carregando feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3 text-center px-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle size={24} />
        </div>
        <h3 className="font-medium text-zinc-900 dark:text-white">Erro ao carregar feed</h3>
        <p className="text-zinc-500 text-sm max-w-xs">{error}</p>
        <button
          onClick={refreshPosts}
          className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Business Promo Banner */}
      {isBusiness && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Alcance mais pessoas</h3>
                <p className="text-white/90 text-sm">
                  Impulsione suas publicações e atraia novos clientes
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center transition-all border border-white/10 hover:border-white/30">
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">Impulsionar</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center transition-all border border-white/10 hover:border-white/30">
                <Target className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">Público Alvo</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center transition-all border border-white/10 hover:border-white/30">
                <Sparkles className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">IA Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post */}
      <CreatePost onPost={createPost} isBusiness={isBusiness} />

      {/* Feed Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onLike={toggleLike} isBusiness={isBusiness} />
          ))
        ) : (
          <div className="text-center py-16 text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="font-medium text-lg text-zinc-900 dark:text-white mb-1">
              {isBusiness ? 'Seu feed está vazio' : 'Nenhuma publicação ainda'}
            </h3>
            <p className="max-w-xs mx-auto text-sm">
              {isBusiness
                ? 'Comece a construir sua presença digital criando seu primeiro post!'
                : 'Siga outros usuários ou seja o primeiro a postar algo interessante!'}
            </p>
          </div>
        )}
      </div>

      {/* Personal User - Suggested Businesses to Follow (Mock data for now, could be real later) */}
      {!isBusiness && posts.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Negócios para você seguir
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Tech Store', category: 'Eletrônicos', followers: '15.2K' },
              { name: 'Fashion Hub', category: 'Moda', followers: '8.7K' },
              { name: 'Gourmet Delivery', category: 'Alimentação', followers: '22.1K' },
            ].map((business, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {business.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">
                      {business.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {business.category} • {business.followers} seguidores
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
