import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabase';
import {
  ArrowLeft,
  Grid3X3,
  Bookmark,
  Heart,
  MessageSquare,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Building2,
  User,
  UserPlus,
  UserCheck,
  Loader2,
  Settings,
  MoreHorizontal,
  Play,
  Image as ImageIcon,
} from 'lucide-react';

interface PublicProfileProps {
  userId?: string;
  onBack?: () => void;
}

interface ProfileData {
  id: string;
  name: string;
  avatar_url: string | null;
  type: 'PERSONAL' | 'BUSINESS';
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
}

interface PostData {
  id: string;
  content: string;
  image: string | null;
  video_url: string | null;
  media_type: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ userId, onBack }) => {
  const { user, profile: currentProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;
      setLoading(true);

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch posts with counts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(
            `
                        id, content, image, video_url, media_type, created_at,
                        post_likes (id),
                        post_comments (id)
                    `
          )
          .eq('author_id', targetUserId)
          .order('created_at', { ascending: false });

        if (!postsError && postsData) {
          const formattedPosts = postsData.map(p => ({
            ...p,
            likes_count: (p.post_likes as any[])?.length || 0,
            comments_count: (p.post_comments as any[])?.length || 0,
          }));
          setPosts(formattedPosts);
        }

        // Fetch stats
        const { count: followersCount } = await supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', targetUserId)
          .eq('status', 'accepted');

        const { count: followingCount } = await supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', targetUserId)
          .eq('status', 'accepted');

        setStats({
          posts: postsData?.length || 0,
          followers: followersCount || 0,
          following: followingCount || 0,
        });

        // Check if current user follows this profile
        if (user && !isOwnProfile) {
          const { data: connectionData } = await supabase
            .from('connections')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId)
            .eq('status', 'accepted')
            .maybeSingle();

          setIsFollowing(!!connectionData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, user, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || !targetUserId || isOwnProfile) return;
    setFollowLoading(true);

    try {
      if (isFollowing) {
        await supabase
          .from('connections')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await supabase
          .from('connections')
          .insert({ follower_id: user.id, following_id: targetUserId, status: 'accepted' });
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Perfil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar</span>
        </button>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Cover */}
        <div
          className={`h-32 md:h-48 bg-gradient-to-r ${profile.type === 'BUSINESS' ? 'from-indigo-500 via-purple-500 to-pink-500' : 'from-emerald-400 via-teal-500 to-cyan-500'}`}
        />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl md:text-4xl border-4 border-white dark:border-zinc-900 shadow-lg">
                  {profile.name?.[0] || '?'}
                </div>
              )}
              {profile.type === 'BUSINESS' && (
                <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white dark:border-zinc-900">
                  <Building2 size={14} />
                </div>
              )}
            </div>

            {/* Name & Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                    {profile.name}
                  </h1>
                  {profile.type === 'BUSINESS' && (
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                  {profile.type === 'BUSINESS' ? <Building2 size={14} /> : <User size={14} />}
                  {profile.type === 'BUSINESS' ? 'Conta Business' : 'Conta Pessoal'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <button className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                    <Settings size={16} />
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                        isFollowing
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {followLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck size={16} /> Seguindo
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} /> Seguir
                        </>
                      )}
                    </button>
                    <button className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Info */}
          <div className="mt-4 space-y-2">
            {profile.bio && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <LinkIcon size={14} /> {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Entrou em{' '}
                {new Date(profile.created_at).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="text-center">
              <span className="block text-xl font-bold text-zinc-900 dark:text-white">
                {stats.posts}
              </span>
              <span className="text-xs text-zinc-500">publicações</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-zinc-900 dark:text-white">
                {stats.followers}
              </span>
              <span className="text-xs text-zinc-500">seguidores</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-zinc-900 dark:text-white">
                {stats.following}
              </span>
              <span className="text-xs text-zinc-500">seguindo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mt-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <Grid3X3 size={18} />
          Publicações
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Bookmark size={18} />
            Salvos
          </button>
        )}
      </div>

      {/* Posts Grid (Instagram Style) */}
      {activeTab === 'posts' && (
        <div className="mt-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden group"
                >
                  {post.image || post.video_url ? (
                    <>
                      {post.media_type === 'video' || post.video_url ? (
                        <video
                          src={post.video_url || post.image || ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={post.image || ''} alt="" className="w-full h-full object-cover" />
                      )}
                      {(post.media_type === 'video' || post.video_url) && (
                        <div className="absolute top-2 right-2">
                          <Play size={16} className="text-white drop-shadow-lg" fill="white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <p className="text-xs text-zinc-500 text-center line-clamp-4">
                        {post.content}
                      </p>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1 text-white text-sm font-semibold">
                      <Heart size={18} fill="white" /> {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1 text-white text-sm font-semibold">
                      <MessageSquare size={18} fill="white" /> {post.comments_count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma publicação ainda</p>
              {isOwnProfile && <p className="text-sm mt-1">Compartilhe seu primeiro momento!</p>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="py-16 text-center text-zinc-500">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum item salvo</p>
          <p className="text-sm mt-1">Salve publicações para ver depois</p>
        </div>
      )}

      {/* Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Media */}
            {(selectedPost.image || selectedPost.video_url) && (
              <div className="bg-black">
                {selectedPost.media_type === 'video' || selectedPost.video_url ? (
                  <video
                    src={selectedPost.video_url || selectedPost.image || ''}
                    className="w-full max-h-[60vh] object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedPost.image || ''}
                    alt=""
                    className="w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {profile.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                    {profile.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(selectedPost.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {selectedPost.content}
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Heart size={16} /> {selectedPost.likes_count} curtidas
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} /> {selectedPost.comments_count} comentários
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
