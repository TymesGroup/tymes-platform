import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import {
  Image,
  Video,
  X,
  Loader2,
  Globe,
  Users,
  Lock,
  ChevronDown,
  Smile,
  MapPin,
  AtSign,
  Search,
  Check,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CreatePostProps {
  onPost: (postData: CreatePostData) => Promise<any>;
  isBusiness?: boolean;
}

export interface CreatePostData {
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  visibility?: 'public' | 'connections' | 'private';
  location?: string;
  mentions?: string[];
}

type Visibility = 'public' | 'connections' | 'private';

const visibilityOptions: { value: Visibility; label: string; icon: React.ReactNode }[] = [
  { value: 'public', label: 'Público', icon: <Globe size={14} /> },
  { value: 'connections', label: 'Conexões', icon: <Users size={14} /> },
  { value: 'private', label: 'Privado', icon: <Lock size={14} /> },
];

// Emojis populares
const POPULAR_EMOJIS = [
  '😀',
  '😂',
  '🥰',
  '😍',
  '🤩',
  '😎',
  '🥳',
  '😊',
  '👍',
  '👏',
  '🙌',
  '💪',
  '🎉',
  '🔥',
  '❤️',
  '💯',
  '✨',
  '🌟',
  '💡',
  '🚀',
  '💼',
  '📈',
  '🎯',
  '✅',
];

interface UserSuggestion {
  id: string;
  name: string;
  avatar_url: string | null;
  type: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPost, isBusiness = false }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Location
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Mentions
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<UserSuggestion[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search users for mentions
  useEffect(() => {
    const searchUsers = async () => {
      if (!mentionSearch.trim() || mentionSearch.length < 2) {
        setMentionSuggestions([]);
        return;
      }

      setIsSearchingUsers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, type')
          .ilike('name', `%${mentionSearch}%`)
          .neq('id', user?.id)
          .limit(5);

        if (!error && data) {
          setMentionSuggestions(data);
        }
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setIsSearchingUsers(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [mentionSearch, user?.id]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (50MB for videos, 10MB for images)
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`O arquivo é muito grande. Máximo: ${type === 'video' ? '50MB' : '10MB'}`);
        return;
      }

      // Validate file type
      const validTypes =
        type === 'video'
          ? ['video/mp4', 'video/webm', 'video/quicktime']
          : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (!validTypes.includes(file.type)) {
        setError(`Tipo de arquivo inválido. Tipos aceitos: ${validTypes.join(', ')}`);
        return;
      }

      setError(null);
      setSelectedFile(file);
      setMediaType(type);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setSelectedFile(null);
    setMediaType(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadProgress(0);
    setError(null);
  };

  const uploadMedia = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Try social-media bucket first, then fallback to posts
    let bucket = 'social-media';

    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      // Fallback to posts bucket
      bucket = 'posts';
      const { error: fallbackError } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (fallbackError) {
        // If both fail, just use the URL directly (for testing)
        console.warn('Storage upload failed, using placeholder');
        return previewUrl || '';
      }
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setContent(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const addMention = (user: UserSuggestion) => {
    if (!selectedMentions.find(m => m.id === user.id)) {
      setSelectedMentions(prev => [...prev, user]);
      setContent(prev => prev + `@${user.name} `);
    }
    setMentionSearch('');
    setShowMentionPicker(false);
    textareaRef.current?.focus();
  };

  const removeMention = (userId: string) => {
    const mention = selectedMentions.find(m => m.id === userId);
    if (mention) {
      setSelectedMentions(prev => prev.filter(m => m.id !== userId));
      setContent(prev => prev.replace(`@${mention.name} `, '').replace(`@${mention.name}`, ''));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          // Use reverse geocoding to get location name
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            'Localização atual';
          setLocation(locationName);
        } catch (err) {
          setLocation('Localização atual');
        } finally {
          setIsGettingLocation(false);
        }
      },
      err => {
        console.error('Error getting location:', err);
        setError('Não foi possível obter sua localização');
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !selectedFile) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      let mediaUrl: string | undefined;

      if (selectedFile && mediaType) {
        setUploadProgress(10);
        mediaUrl = await uploadMedia(selectedFile);
        setUploadProgress(80);
      }

      const postData: CreatePostData = {
        content: content.trim(),
        visibility,
        mentions: selectedMentions.map(m => m.id),
      };

      if (mediaUrl) {
        postData.media_url = mediaUrl;
        postData.media_type = mediaType!;
      }

      if (location) {
        postData.location = location;
      }

      await onPost(postData);
      setUploadProgress(100);

      // Reset form
      setContent('');
      removeMedia();
      setVisibility('public');
      setLocation('');
      setShowLocationInput(false);
      setSelectedMentions([]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Erro ao criar publicação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const currentVisibility = visibilityOptions.find(v => v.value === visibility)!;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {profile?.name?.[0] || 'U'}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-zinc-900 dark:text-white text-sm">
            {profile?.name || 'Usuário'}
          </p>
          {/* Visibility Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mt-0.5"
            >
              {currentVisibility.icon}
              <span>{currentVisibility.label}</span>
              <ChevronDown size={12} />
            </button>
            {showVisibilityMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                {visibilityOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setVisibility(option.value);
                      setShowVisibilityMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${
                      visibility === option.value
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={
              isBusiness
                ? 'Compartilhe novidades da sua empresa...'
                : `No que você está pensando, ${profile?.name?.split(' ')[0] || ''}?`
            }
            className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[80px] resize-none placeholder:text-zinc-400 text-zinc-900 dark:text-white"
            disabled={isSubmitting}
            rows={3}
          />

          {/* Selected Mentions */}
          {selectedMentions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMentions.map(mention => (
                <span
                  key={mention.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                >
                  @{mention.name}
                  <button
                    type="button"
                    onClick={() => removeMention(mention.id)}
                    className="hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Location Badge */}
          {location && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs">
                <MapPin size={12} />
                {location}
                <button
                  type="button"
                  onClick={() => {
                    setLocation('');
                    setShowLocationInput(false);
                  }}
                  className="hover:text-emerald-800 dark:hover:text-emerald-200"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {/* Location Input */}
          {showLocationInput && !location && (
            <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">Adicionar localização</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Digite a localização..."
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-1"
                >
                  {isGettingLocation ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <MapPin size={14} />
                  )}
                  Atual
                </button>
              </div>
            </div>
          )}

          {/* Mention Picker */}
          {showMentionPicker && (
            <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AtSign size={16} className="text-blue-500" />
                <span className="text-sm font-medium">Mencionar alguém</span>
              </div>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={mentionSearch}
                  onChange={e => setMentionSearch(e.target.value)}
                  placeholder="Buscar usuários..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {isSearchingUsers && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-blue-500" />
                </div>
              )}
              {mentionSuggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {mentionSuggestions.map(suggestion => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => addMention(suggestion)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      {suggestion.avatar_url ? (
                        <img src={suggestion.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {suggestion.name?.[0]}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {suggestion.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {suggestion.type === 'BUSINESS' ? 'Empresa' : 'Pessoal'}
                        </p>
                      </div>
                      {selectedMentions.find(m => m.id === suggestion.id) && (
                        <Check size={16} className="text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smile size={16} className="text-amber-500" />
                <span className="text-sm font-medium">Emojis</span>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {POPULAR_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-2 text-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Preview */}
          {previewUrl && (
            <div className="relative mt-3 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {mediaType === 'image' ? (
                <img src={previewUrl} alt="Preview" className="max-h-80 w-full object-contain" />
              ) : (
                <video src={previewUrl} className="max-h-80 w-full object-contain" controls />
              )}
              <button
                type="button"
                onClick={removeMedia}
                disabled={isSubmitting}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-300 dark:bg-zinc-600">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Image Upload */}
            <label
              className={`cursor-pointer p-2 rounded-full transition-colors ${
                selectedFile
                  ? 'text-zinc-300 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              }`}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={e => handleMediaSelect(e, 'image')}
                disabled={isSubmitting || !!selectedFile}
              />
              <Image size={20} />
            </label>

            {/* Video Upload */}
            <label
              className={`cursor-pointer p-2 rounded-full transition-colors ${
                selectedFile
                  ? 'text-zinc-300 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              }`}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={e => handleMediaSelect(e, 'video')}
                disabled={isSubmitting || !!selectedFile}
              />
              <Video size={20} />
            </label>

            {/* Emoji */}
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowLocationInput(false);
                setShowMentionPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
              disabled={isSubmitting}
            >
              <Smile size={20} />
            </button>

            {/* Location */}
            <button
              type="button"
              onClick={() => {
                setShowLocationInput(!showLocationInput);
                setShowEmojiPicker(false);
                setShowMentionPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showLocationInput || location
                  ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
              }`}
              disabled={isSubmitting}
            >
              <MapPin size={20} />
            </button>

            {/* Mention */}
            <button
              type="button"
              onClick={() => {
                setShowMentionPicker(!showMentionPicker);
                setShowEmojiPicker(false);
                setShowLocationInput(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showMentionPicker || selectedMentions.length > 0
                  ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
              disabled={isSubmitting}
            >
              <AtSign size={20} />
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !selectedFile) || isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <span>Publicar</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
