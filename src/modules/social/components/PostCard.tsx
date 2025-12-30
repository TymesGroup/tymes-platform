import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Bookmark,
  Flag,
  Trash2,
  Copy,
  Send,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  MapPin,
  Globe,
  Users,
  Lock,
} from 'lucide-react';
import type { PostWithDetails, CommentWithAuthor } from '../useSocial';
import { useSocial } from '../useSocial';
import { useAuth } from '../../../lib/useAuth';

interface PostCardProps {
  post: PostWithDetails;
  onLike: (id: string) => void;
  isBusiness?: boolean;
}

function timeAgo(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora mesmo';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('pt-BR');
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, isBusiness = false }) => {
  const { user } = useAuth();
  const { addComment, fetchComments, sharePost, deletePost } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(post.user_has_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [saved, setSaved] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update local state when post changes
  useEffect(() => {
    setLiked(post.user_has_liked);
    setLikesCount(post.likes_count);
  }, [post.user_has_liked, post.likes_count]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    setLiked(!liked);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));

    try {
      await onLike(post.id);
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const fetchedComments = await fetchComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const comment = await addComment(post.id, newComment);
      setComments(prev => [...prev, comment as CommentWithAuthor]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async (type: 'repost' | 'quote' | 'external') => {
    try {
      await sharePost(post.id, type);
      setShowShareMenu(false);
      if (type === 'external') {
        // Show toast notification
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      setShowShareMenu(false);
      // Show toast notification
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta publicação?')) return;
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setShowMenu(false);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isOwner = user?.id === post.author_id;

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        {post.profiles?.avatar_url ? (
          <img
            src={post.profiles.avatar_url}
            alt={post.profiles.name || 'User'}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {post.profiles?.name?.[0] || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
              {post.profiles?.name || 'Usuário Desconhecido'}
            </h4>
            {post.profiles?.type === 'BUSINESS' && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{timeAgo(post.created_at)}</span>
            {post.visibility && post.visibility !== 'public' && (
              <span className="flex items-center gap-0.5">
                •{post.visibility === 'connections' ? <Users size={10} /> : <Lock size={10} />}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-0.5">
                • <MapPin size={10} /> {post.location}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-20">
              <button
                onClick={() => setSaved(!saved)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Salvo' : 'Salvar'}
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Copy size={16} />
                Copiar link
              </button>
              {!isOwner && (
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                  <Flag size={16} />
                  Denunciar
                </button>
              )}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto max-h-[500px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {(post.video || post.video_url) && (
        <div className="relative bg-black cursor-pointer" onClick={toggleVideoPlay}>
          <video
            ref={videoRef}
            src={post.video || post.video_url}
            className="w-full h-auto max-h-[500px] object-contain"
            loop
            muted={isMuted}
            playsInline
            onEnded={() => setIsPlaying(false)}
          />
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                <Play size={32} className="text-white ml-1" fill="currentColor" />
              </div>
            )}
          </div>
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}

      {/* Engagement Stats */}
      {(likesCount > 0 || post.comments_count > 0 || post.shares_count > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            {likesCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart size={10} className="text-white" fill="currentColor" />
                </span>
                {likesCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {post.comments_count > 0 && (
              <button
                onClick={handleToggleComments}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {post.comments_count} {post.comments_count === 1 ? 'comentário' : 'comentários'}
              </button>
            )}
            {post.shares_count > 0 && (
              <span>
                {post.shares_count}{' '}
                {post.shares_count === 1 ? 'compartilhamento' : 'compartilhamentos'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-2 py-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            liked
              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-zinc-500 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Heart
            size={20}
            fill={liked ? 'currentColor' : 'none'}
            className={liked ? 'animate-[pulse_0.3s_ease-in-out]' : ''}
          />
          <span>Curtir</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleToggleComments}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          <MessageSquare size={20} />
          <span>Comentar</span>
        </button>

        {/* Share Button */}
        <div className="relative flex-1" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              post.user_has_shared
                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                : 'text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Share2 size={20} />
            <span>Compartilhar</span>
          </button>
          {showShareMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-20">
              <button
                onClick={() => handleShare('repost')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Share2 size={16} />
                Repostar
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Copy size={16} />
                Copiar link
              </button>
              <button
                onClick={() => handleShare('external')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink size={16} />
                Compartilhar...
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.user_metadata?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="px-4 pb-4 text-center text-zinc-500 text-sm">
              Carregando comentários...
            </div>
          ) : comments.length > 0 ? (
            <div className="px-4 pb-4 space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {comment.profiles?.name?.[0] || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2">
                      <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                        {comment.profiles?.name || 'Usuário'}
                      </p>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 px-2">
                      <button className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium">
                        Curtir
                      </button>
                      <button className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium">
                        Responder
                      </button>
                      <span className="text-xs text-zinc-400">{timeAgo(comment.created_at)}</span>
                    </div>
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                              {reply.profiles?.name?.[0] || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-1.5">
                                <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                                  {reply.profiles?.name || 'Usuário'}
                                </p>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 pb-4 text-center text-zinc-500 text-sm">
              Nenhum comentário ainda. Seja o primeiro!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
