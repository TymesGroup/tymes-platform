import React, { useState, useEffect } from 'react';
import { useConnections, ProfileRow } from '../useConnections';
import { useAuth } from '../../../lib/AuthContext';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { supabase } from '../../../lib/supabase';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Loader2,
  Building2,
  User,
  UserMinus,
  X,
  Shield,
  MapPin,
  Sparkles,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export const SocialConnections: React.FC = () => {
  const {
    followers,
    following,
    pendingRequests,
    suggestions,
    loading,
    stats,
    followUser,
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest,
    searchUsers,
    refreshAll,
  } = useConnections();

  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<ProfileRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Track who we're following
  useEffect(() => {
    setFollowingIds(new Set(following.map(f => f.id)));
  }, [following]);

  // Fetch all users for discovery
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user) return;
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          setAllUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAllUsers();
  }, [user]);

  // Real-time search
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, searchUsers]);

  const handleFollow = async (userId: string) => {
    setLoadingFollow(userId);
    try {
      await followUser(userId);
      setFollowingIds(prev => new Set([...prev, userId]));
    } catch (error) {
      alert('Erro ao seguir usuário');
    } finally {
      setLoadingFollow(null);
    }
  };

  const handleUnfollow = async (userId: string) => {
    setLoadingFollow(userId);
    try {
      await unfollowUser(userId);
      setFollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (error) {
      alert('Erro ao deixar de seguir');
    } finally {
      setLoadingFollow(null);
    }
  };

  // Compact user card for the list
  const UserListItem: React.FC<{ user: ProfileRow; showFollowBack?: boolean }> = ({
    user: p,
    showFollowBack,
  }) => {
    const isFollowing = followingIds.has(p.id);
    const isLoading = loadingFollow === p.id;

    return (
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
        <div className="relative">
          {p.avatar_url ? (
            <img
              src={p.avatar_url}
              alt={p.name || ''}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {p.name?.[0] || '?'}
            </div>
          )}
          {p.type === 'BUSINESS' && (
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-0.5 rounded-full border-2 border-white dark:border-zinc-900">
              <Building2 size={8} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{p.name}</h4>
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            {p.type === 'BUSINESS' ? (
              <>
                <Building2 size={10} /> Empresa
              </>
            ) : (
              <>
                <User size={10} /> Pessoal
              </>
            )}
            {showFollowBack && <span className="text-indigo-500 ml-1">• Segue você</span>}
          </p>
        </div>

        <button
          onClick={() => (isFollowing ? handleUnfollow(p.id) : handleFollow(p.id))}
          disabled={isLoading}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            isFollowing
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isFollowing ? (
            <>Seguindo</>
          ) : (
            <>
              <UserPlus size={14} /> Seguir
            </>
          )}
        </button>
      </div>
    );
  };

  // Pending request card
  const RequestCard: React.FC<{ request: any }> = ({ request }) => {
    const p = request.follower;
    if (!p) return null;

    return (
      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
        <div className="relative">
          {p.avatar_url ? (
            <img
              src={p.avatar_url}
              alt={p.name || ''}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
              {p.name?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{p.name}</h4>
          <p className="text-xs text-amber-600 dark:text-amber-400">Quer seguir você</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => acceptFollowRequest(request.id)}
            className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
          >
            <UserCheck size={16} />
          </button>
          <button
            onClick={() => rejectFollowRequest(request.id)}
            className="p-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Users to display (search results or all users)
  const displayUsers = searchQuery.trim() ? searchResults : allUsers;
  const usersNotFollowing = displayUsers.filter(u => !followingIds.has(u.id));

  if (loading && loadingUsers) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <SectionHeader title="Conexões" subtitle="Encontre pessoas e empresas para seguir" />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white text-center shadow-lg">
          <span className="block text-2xl font-bold">{stats.following}</span>
          <span className="text-xs opacity-80">Seguindo</span>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl text-white text-center shadow-lg">
          <span className="block text-2xl font-bold">{stats.followers}</span>
          <span className="text-xs opacity-80">Seguidores</span>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl text-white text-center shadow-lg relative">
          <span className="block text-2xl font-bold">{stats.pending}</span>
          <span className="text-xs opacity-80">Pendentes</span>
          {stats.pending > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          type="text"
          placeholder="Buscar pessoas ou empresas..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-indigo-600" />
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
            <UserCheck size={16} className="text-amber-500" />
            Solicitações pendentes
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </h3>
          <div className="space-y-2">
            {pendingRequests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        </div>
      )}

      {/* Followers who you don't follow back */}
      {followers.filter(f => !followingIds.has(f.id)).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
            <Users size={16} className="text-emerald-500" />
            Seguidores que você não segue
          </h3>
          <div className="space-y-2">
            {followers
              .filter(f => !followingIds.has(f.id))
              .slice(0, 5)
              .map(follower => (
                <UserListItem key={follower.id} user={follower} showFollowBack />
              ))}
          </div>
        </div>
      )}

      {/* Suggestions / All Users */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-indigo-500" />
            {searchQuery.trim() ? `Resultados para "${searchQuery}"` : 'Pessoas para seguir'}
          </h3>
          {!searchQuery.trim() && (
            <button
              onClick={refreshAll}
              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <RefreshCw size={12} /> Atualizar
            </button>
          )}
        </div>

        {loadingUsers && !searchQuery.trim() ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : usersNotFollowing.length > 0 ? (
          <div className="space-y-2">
            {usersNotFollowing.map(u => (
              <UserListItem key={u.id} user={u} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhum resultado encontrado</p>
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
            <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Você já segue todos os usuários!</p>
          </div>
        )}
      </div>

      {/* Who you're following */}
      {following.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-purple-500" />
            Quem você segue ({following.length})
          </h3>
          <div className="space-y-2">
            {following.slice(0, 10).map(u => (
              <UserListItem key={u.id} user={u} />
            ))}
            {following.length > 10 && (
              <p className="text-center text-xs text-zinc-500 py-2">
                E mais {following.length - 10} pessoas...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
