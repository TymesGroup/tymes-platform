import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';
import type { Database } from '../../types/database.types';

// Types
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ConnectionRow = Database['public']['Tables']['connections']['Row'];

export type ConnectionWithProfile = ConnectionRow & {
  follower?: ProfileRow;
  following?: ProfileRow;
};

export type UserWithConnectionStatus = ProfileRow & {
  isFollowing: boolean;
  isFollower: boolean;
  connectionStatus: 'none' | 'pending' | 'accepted' | 'blocked';
  followersCount: number;
  followingCount: number;
};

export function useConnections() {
  const { user, profile } = useAuth();
  const [followers, setFollowers] = useState<ProfileRow[]>([]);
  const [following, setFollowing] = useState<ProfileRow[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionWithProfile[]>([]);
  const [suggestions, setSuggestions] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ followers: 0, following: 0, pending: 0 });

  // Fetch user's followers
  const fetchFollowers = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connections')
        .select(
          `
                    *,
                    follower:profiles!connections_follower_id_fkey (*)
                `
        )
        .eq('following_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      const followerProfiles = (data || []).map(conn => (conn as any).follower).filter(Boolean);

      setFollowers(followerProfiles);
      return followerProfiles;
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  }, [user]);

  // Fetch users the current user is following
  const fetchFollowing = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connections')
        .select(
          `
                    *,
                    following:profiles!connections_following_id_fkey (*)
                `
        )
        .eq('follower_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      const followingProfiles = (data || []).map(conn => (conn as any).following).filter(Boolean);

      setFollowing(followingProfiles);
      return followingProfiles;
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  }, [user]);

  // Fetch pending connection requests
  const fetchPendingRequests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connections')
        .select(
          `
                    *,
                    follower:profiles!connections_follower_id_fkey (*)
                `
        )
        .eq('following_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      setPendingRequests((data || []) as ConnectionWithProfile[]);
      return data || [];
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }, [user]);

  // Fetch suggestions (users not connected)
  const fetchSuggestions = useCallback(async () => {
    if (!user) return;

    try {
      // Get all users except current user
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(50);

      if (usersError) throw usersError;

      // Get current connections
      const { data: connections, error: connError } = await supabase
        .from('connections')
        .select('following_id')
        .eq('follower_id', user.id);

      if (connError) throw connError;

      const connectedIds = new Set((connections || []).map(c => c.following_id));

      // Filter out connected users
      const suggestedUsers = (allUsers || []).filter(u => !connectedIds.has(u.id));

      // Prioritize business accounts for personal users and vice versa
      suggestedUsers.sort((a, b) => {
        if (profile?.type === 'PERSONAL') {
          // Personal users see business accounts first
          if (a.type === 'BUSINESS' && b.type !== 'BUSINESS') return -1;
          if (b.type === 'BUSINESS' && a.type !== 'BUSINESS') return 1;
        } else if (profile?.type === 'BUSINESS') {
          // Business accounts see personal users first (potential customers)
          if (a.type === 'PERSONAL' && b.type !== 'PERSONAL') return -1;
          if (b.type === 'PERSONAL' && a.type !== 'PERSONAL') return 1;
        }
        return 0;
      });

      setSuggestions(suggestedUsers.slice(0, 20));
      return suggestedUsers;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }, [user, profile]);

  // Follow a user
  async function followUser(targetUserId: string) {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      // Check if connection already exists
      const { data: existing } = await supabase
        .from('connections')
        .select('id, status')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'blocked') {
          throw new Error('Você não pode seguir este usuário');
        }
        return existing;
      }

      // Create new connection (auto-accept for now, can be changed to pending)
      const { data, error } = await supabase
        .from('connections')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
          status: 'accepted', // Change to 'pending' for request-based system
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: targetUserId,
        type: 'follow',
        title: 'Novo seguidor',
        body: 'começou a seguir você',
        actor_id: user.id,
        entity_type: 'profile',
        entity_id: user.id,
      });

      // Update local state
      await fetchFollowing();
      setSuggestions(prev => prev.filter(s => s.id !== targetUserId));

      return data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  // Unfollow a user
  async function unfollowUser(targetUserId: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;

      setFollowing(prev => prev.filter(f => f.id !== targetUserId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // Accept a follow request
  async function acceptFollowRequest(connectionId: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .eq('following_id', user.id);

      if (error) throw error;

      await fetchPendingRequests();
      await fetchFollowers();
    } catch (error) {
      console.error('Error accepting follow request:', error);
      throw error;
    }
  }

  // Reject a follow request
  async function rejectFollowRequest(connectionId: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId)
        .eq('following_id', user.id);

      if (error) throw error;

      await fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting follow request:', error);
      throw error;
    }
  }

  // Block a user
  async function blockUser(targetUserId: string) {
    if (!user) return;

    try {
      // Check for existing connection
      const { data: existing } = await supabase
        .from('connections')
        .select('id')
        .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`)
        .or(`follower_id.eq.${targetUserId},following_id.eq.${targetUserId}`)
        .maybeSingle();

      if (existing) {
        // Update to blocked
        await supabase.from('connections').update({ status: 'blocked' }).eq('id', existing.id);
      } else {
        // Create blocked connection
        await supabase.from('connections').insert({
          follower_id: user.id,
          following_id: targetUserId,
          status: 'blocked',
        });
      }

      // Remove from all lists
      setFollowers(prev => prev.filter(f => f.id !== targetUserId));
      setFollowing(prev => prev.filter(f => f.id !== targetUserId));
      setSuggestions(prev => prev.filter(s => s.id !== targetUserId));
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Check connection status with a specific user
  async function getConnectionStatus(targetUserId: string): Promise<{
    isFollowing: boolean;
    isFollower: boolean;
    status: 'none' | 'pending' | 'accepted' | 'blocked';
  }> {
    if (!user) return { isFollowing: false, isFollower: false, status: 'none' };

    try {
      // Check if current user follows target
      const { data: followingData } = await supabase
        .from('connections')
        .select('status')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      // Check if target follows current user
      const { data: followerData } = await supabase
        .from('connections')
        .select('status')
        .eq('follower_id', targetUserId)
        .eq('following_id', user.id)
        .maybeSingle();

      return {
        isFollowing: followingData?.status === 'accepted',
        isFollower: followerData?.status === 'accepted',
        status: followingData?.status || 'none',
      };
    } catch (error) {
      console.error('Error checking connection status:', error);
      return { isFollowing: false, isFollower: false, status: 'none' };
    }
  }

  // Search users
  async function searchUsers(query: string): Promise<ProfileRow[]> {
    if (!query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get mutual connections count
  async function getMutualConnectionsCount(targetUserId: string): Promise<number> {
    if (!user) return 0;

    try {
      // Get target's followers
      const { data: targetFollowers } = await supabase
        .from('connections')
        .select('follower_id')
        .eq('following_id', targetUserId)
        .eq('status', 'accepted');

      // Get current user's following
      const { data: myFollowing } = await supabase
        .from('connections')
        .select('following_id')
        .eq('follower_id', user.id)
        .eq('status', 'accepted');

      const targetFollowerIds = new Set((targetFollowers || []).map(c => c.follower_id));
      const myFollowingIds = (myFollowing || []).map(c => c.following_id);

      return myFollowingIds.filter(id => targetFollowerIds.has(id)).length;
    } catch (error) {
      console.error('Error getting mutual connections:', error);
      return 0;
    }
  }

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFollowers(),
        fetchFollowing(),
        fetchPendingRequests(),
        fetchSuggestions(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchFollowers, fetchFollowing, fetchPendingRequests, fetchSuggestions]);

  // Update stats
  useEffect(() => {
    setStats({
      followers: followers.length,
      following: following.length,
      pending: pendingRequests.length,
    });
  }, [followers, following, pendingRequests]);

  // Initialize with realtime subscriptions
  useEffect(() => {
    if (user) {
      refreshAll();

      // Subscribe to connection changes
      const connectionsChannel = supabase
        .channel('connections-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'connections',
            filter: `follower_id=eq.${user.id}`,
          },
          () => {
            fetchFollowing();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'connections',
            filter: `following_id=eq.${user.id}`,
          },
          () => {
            fetchFollowers();
            fetchPendingRequests();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(connectionsChannel);
      };
    }
  }, [user?.id]);

  return {
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
    blockUser,
    getConnectionStatus,
    searchUsers,
    getMutualConnectionsCount,
    refreshAll,
  };
}
