import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { dataCache, CACHE_KEYS } from '../../lib/dataCache';
import type { Database } from '../../lib/database.types';

export interface CommentWithAuthor {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    name: string | null;
    avatar_url: string | null;
  } | null;
  replies?: CommentWithAuthor[];
  parent_comment_id: string | null;
}

export type PostWithDetails = Database['public']['Tables']['posts']['Row'] & {
  profiles: Pick<
    Database['public']['Tables']['profiles']['Row'],
    'name' | 'avatar_url' | 'type'
  > | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  user_has_liked: boolean;
  user_has_shared: boolean;
};

function formatPosts(data: any[], userId?: string): PostWithDetails[] {
  return data.map(post => {
    const likes = post.post_likes || [];
    const likesArray = likes as any[];
    const comments = post.post_comments || [];
    const commentsArray = comments as any[];
    const shares = post.post_shares || [];
    const sharesArray = shares as any[];

    return {
      ...post,
      profiles: post.profiles,
      likes_count: likesArray.length,
      comments_count: commentsArray.length,
      shares_count: post.shares_count || sharesArray.length,
      user_has_liked: userId ? likesArray.some((like: any) => like.user_id === userId) : false,
      user_has_shared: userId ? sharesArray.some((share: any) => share.user_id === userId) : false,
    };
  });
}

export function useSocial() {
  const { user } = useAuth();

  // Initialize from cache immediately
  const [posts, setPosts] = useState<PostWithDetails[]>(() => {
    const cached = dataCache.get<any[]>(CACHE_KEYS.POSTS);
    return cached ? formatPosts(cached, user?.id) : [];
  });
  const [loading, setLoading] = useState(() => !dataCache.has(CACHE_KEYS.POSTS));
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (forceRefresh = false) => {
      try {
        // Only show loading if no cached data
        if (!dataCache.has(CACHE_KEYS.POSTS)) {
          setLoading(true);
        }

        const data = await dataCache.getOrFetch<any[]>(
          CACHE_KEYS.POSTS,
          async () => {
            const { data, error } = await supabase
              .from('posts')
              .select(
                `
                            *,
                            profiles (name, avatar_url, type),
                            post_likes (user_id),
                            post_comments (id),
                            post_shares (user_id)
                        `
              )
              .order('created_at', { ascending: false })
              .limit(50);

            if (error) throw error;
            return data || [];
          },
          { forceRefresh }
        );

        setPosts(formatPosts(data, user?.id));
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    fetchPosts();

    // Subscribe to cache updates
    const unsubscribe = dataCache.subscribe<any[]>(CACHE_KEYS.POSTS, data => {
      setPosts(formatPosts(data, user?.id));
    });

    // Realtime subscriptions
    const postsChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts(true);
      })
      .subscribe();

    const likesChannel = supabase
      .channel('public:post_likes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        fetchPosts(true);
      })
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [fetchPosts, user?.id]);

  const createPost = useCallback(
    async (postData: {
      content: string;
      media_url?: string;
      media_type?: 'image' | 'video';
      visibility?: 'public' | 'connections' | 'private';
      location?: string;
      mentions?: string[];
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const {
        content,
        media_url,
        media_type,
        visibility = 'public',
        location,
        mentions,
      } = postData;

      // Insert the post
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content,
          image: media_url || null,
          video_url: media_type === 'video' ? media_url : null,
          media_type: media_type || null,
          visibility,
          location: location || null,
        })
        .select(
          `
                *,
                profiles (name, avatar_url, type)
            `
        )
        .single();

      if (error) throw error;

      // Create mentions if any
      if (mentions && mentions.length > 0) {
        const mentionInserts = mentions.map(mentionedUserId => ({
          post_id: data.id,
          mentioned_user_id: mentionedUserId,
          mentioner_id: user.id,
        }));

        // Try to insert mentions (table may not exist yet)
        try {
          await supabase.from('post_mentions').insert(mentionInserts);

          // Create notifications for mentioned users
          const notificationInserts = mentions.map(mentionedUserId => ({
            user_id: mentionedUserId,
            actor_id: user.id,
            type: 'mention',
            title: 'Nova menção',
            body: `${user.email?.split('@')[0] || 'Alguém'} mencionou você em uma publicação`,
            reference_id: data.id,
            reference_type: 'post',
          }));

          await supabase.from('notifications').insert(notificationInserts);
        } catch (mentionError) {
          console.warn('Could not create mentions:', mentionError);
        }
      }

      // Optimistic update
      const newPost = formatPosts(
        [{ ...data, post_likes: [], post_comments: [], post_shares: [] }],
        user.id
      )[0];
      setPosts(prev => [newPost, ...prev]);

      // Refresh cache in background
      fetchPosts(true);

      return data;
    },
    [user, fetchPosts]
  );

  const toggleLike = useCallback(
    async (postId: string) => {
      if (!user) return;

      // Optimistic update
      setPosts(prev =>
        prev.map(post => {
          if (post.id !== postId) return post;
          const hasLiked = post.user_has_liked;
          return {
            ...post,
            user_has_liked: !hasLiked,
            likes_count: hasLiked ? post.likes_count - 1 : post.likes_count + 1,
          };
        })
      );

      try {
        const { data: existingLike } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingLike) {
          await supabase.from('post_likes').delete().eq('id', existingLike.id);
        } else {
          await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        // Revert on error
        fetchPosts(true);
      }
    },
    [user, fetchPosts]
  );

  const addComment = useCallback(
    async (postId: string, content: string): Promise<CommentWithAuthor> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, author_id: user.id, content })
        .select(`*, profiles (name, avatar_url)`)
        .single();

      if (error) throw error;

      // Update comment count optimistically
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, comments_count: post.comments_count + 1 } : post
        )
      );

      return data as CommentWithAuthor;
    },
    [user]
  );

  const fetchComments = useCallback(async (postId: string): Promise<CommentWithAuthor[]> => {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`*, profiles (name, avatar_url)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const comments = data as CommentWithAuthor[];
    const commentMap = new Map<string, CommentWithAuthor>();
    const rootComments: CommentWithAuthor[] = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) parent.replies?.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }, []);

  const sharePost = useCallback(
    async (postId: string, type: 'repost' | 'quote' | 'external') => {
      if (!user || type === 'external') return;

      try {
        const { error } = await supabase
          .from('post_shares')
          .insert({ post_id: postId, user_id: user.id, share_type: type });

        if (error) throw error;
        fetchPosts(true);
      } catch (error) {
        console.error('Error sharing post:', error);
        throw error;
      }
    },
    [user, fetchPosts]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      // Optimistic update
      setPosts(prev => prev.filter(p => p.id !== postId));

      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        fetchPosts(true); // Revert on error
        throw error;
      }
    },
    [fetchPosts]
  );

  const refreshPosts = useCallback(() => fetchPosts(true), [fetchPosts]);

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    addComment,
    fetchComments,
    sharePost,
    deletePost,
    refreshPosts,
  };
}
