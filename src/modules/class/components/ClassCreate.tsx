import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Video,
  X,
  Upload,
  Play,
  Plus,
  Loader2,
} from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  level: string;
  duration: string;
  created_by: string;
}

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  file?: File;
  uploading?: boolean;
  error?: string;
}

interface ClassCreateProps {
  onBack: () => void;
  onSave: (data: CourseData) => void;
}

export const ClassCreate: React.FC<ClassCreateProps> = ({ onBack, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'beginner',
    duration: '',
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Upload file to Supabase Storage
  const uploadToStorage = async (file: File, type: 'image' | 'video'): Promise<string> => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucket = type === 'image' ? 'course-images' : 'course-videos';

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.warn('Storage upload failed, using object URL:', error);
      return URL.createObjectURL(file);
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  // Handle file selection
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'video'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);

    const newItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert(`${file.name} não é uma imagem válida`);
        continue;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert(`${file.name} não é um vídeo válido`);
        continue;
      }

      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name} é muito grande. Máximo: ${type === 'video' ? '100MB' : '10MB'}`);
        continue;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const tempUrl = URL.createObjectURL(file);

      newItems.push({
        id: tempId,
        url: tempUrl,
        type,
        file,
        uploading: true,
      });
    }

    setMediaItems(prev => [...prev, ...newItems]);

    for (const item of newItems) {
      if (!item.file) continue;

      try {
        const uploadedUrl = await uploadToStorage(item.file, item.type);
        setMediaItems(prev =>
          prev.map(m =>
            m.id === item.id ? { ...m, url: uploadedUrl, uploading: false, file: undefined } : m
          )
        );
      } catch (error) {
        console.error('Upload error:', error);
        setMediaItems(prev =>
          prev.map(m =>
            m.id === item.id ? { ...m, uploading: false, error: 'Erro no upload' } : m
          )
        );
      }
    }

    setUploadingMedia(false);
    e.target.value = '';
  };

  // Handle URL input for media
  const handleUrlAdd = (url: string, type: 'image' | 'video') => {
    if (!url.trim()) return;

    const newItem: MediaItem = {
      id: `url-${Date.now()}`,
      url: url.trim(),
      type,
    };

    setMediaItems(prev => [...prev, newItem]);
  };

  // Remove media item
  const removeMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      let storeId: string | null = null;

      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (existingStore) {
        storeId = existingStore.id;
      } else {
        const { data: newStore, error: storeError } = await supabase
          .from('stores')
          .insert({ owner_id: user.id, name: 'Minha Escola' })
          .select('id')
          .single();

        if (storeError) throw storeError;
        storeId = newStore.id;
      }

      // Get primary image (first image in the list)
      const primaryImage = mediaItems.find(m => m.type === 'image')?.url || null;

      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          description: formData.description || null,
          price: parseFloat(formData.price) || 0,
          thumbnail: primaryImage,
          created_by: user.id,
          store_id: storeId,
          level: formData.level,
          duration: formData.duration || null,
          status: 'published',
        })
        .select()
        .single();

      if (error) throw error;

      // Save media items to course_media table
      if (mediaItems.length > 0) {
        const mediaToInsert = mediaItems.map((item, index) => ({
          course_id: data.id,
          url: item.url,
          type: item.type,
          position: index,
          is_primary: index === 0 && item.type === 'image',
        }));

        const { error: mediaError } = await supabase.from('course_media').insert(mediaToInsert);

        if (mediaError) {
          console.error('Error saving media:', mediaError);
        }
      }

      console.log('Curso criado com sucesso:', data);
      onSave(data);
    } catch (error: any) {
      console.error('Erro ao criar curso:', error);
      alert(`Erro ao criar curso: ${error.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Voltar para Área do Professor
      </button>

      <SectionHeader title="Novo Curso" subtitle="Crie e publique seu curso no marketplace." />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Informações Básicas
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Título do Curso *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Masterclass de Design System"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Descrição
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Descreva o que os alunos irão aprender..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nível</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Duração (horas)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 10h"
              />
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Preço
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preço (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
            <p className="text-xs text-zinc-500">Deixe 0 para curso gratuito</p>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Imagens e Vídeos
          </h3>

          {/* Upload Buttons */}
          <div className="flex flex-wrap gap-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={e => handleFileSelect(e, 'image')}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={e => handleFileSelect(e, 'video')}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-zinc-600 dark:text-zinc-400 hover:text-purple-600"
            >
              <ImageIcon size={20} />
              <span className="font-medium">Adicionar Imagens</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
            >
              <Video size={20} />
              <span className="font-medium">Adicionar Vídeo</span>
            </button>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Ou cole uma URL de imagem/vídeo..."
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const url = input.value;
                  if (url) {
                    const isVideo =
                      url.match(/\.(mp4|webm|ogg|mov)$/i) ||
                      url.includes('youtube') ||
                      url.includes('vimeo');
                    handleUrlAdd(url, isVideo ? 'video' : 'image');
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={e => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                const url = input?.value;
                if (url) {
                  const isVideo =
                    url.match(/\.(mp4|webm|ogg|mov)$/i) ||
                    url.includes('youtube') ||
                    url.includes('vimeo');
                  handleUrlAdd(url, isVideo ? 'video' : 'image');
                  input.value = '';
                }
              }}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Media Preview Grid */}
          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                    index === 0
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <video src={item.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play size={32} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.src = 'https://via.placeholder.com/200?text=Erro';
                      }}
                    />
                  )}

                  {item.uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                  )}

                  {item.error && (
                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{item.error}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeMediaItem(item.id)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-medium">
                      Capa
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60">
                    {item.type === 'video' ? (
                      <Video size={14} className="text-white" />
                    ) : (
                      <ImageIcon size={14} className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
                <Upload size={28} className="text-purple-500" />
              </div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                Arraste arquivos ou clique nos botões acima
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                Suporta imagens (JPG, PNG, WebP) e vídeos (MP4, WebM)
              </p>
              <p className="text-xs text-zinc-400 mt-2">
                Máximo: 10MB para imagens, 100MB para vídeos
              </p>
            </div>
          )}

          {mediaItems.length > 0 && (
            <p className="text-xs text-zinc-500">💡 A primeira imagem será a capa do curso.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || uploadingMedia}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Check size={18} />
                Publicar Curso
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
