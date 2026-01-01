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
import { supabase } from '../../../lib/supabase';
import { SectionHeader } from '../../../components/ui/SectionHeader';

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  stock: number | null;
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

interface WorkCreateServiceProps {
  userId: string;
  onBack: () => void;
  onSave: (data: ServiceData) => void;
}

export const WorkCreateService: React.FC<WorkCreateServiceProps> = ({ userId, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Service',
    stock: '',
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadToStorage = async (file: File, type: 'image' | 'video'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucket = type === 'image' ? 'service-images' : 'service-videos';

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.warn('Storage upload failed:', error);
      return URL.createObjectURL(file);
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'video'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    const newItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      if (type === 'image' && !file.type.startsWith('image/')) continue;
      if (type === 'video' && !file.type.startsWith('video/')) continue;

      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) continue;

      newItems.push({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
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
      } catch {
        setMediaItems(prev =>
          prev.map(m => (m.id === item.id ? { ...m, uploading: false, error: 'Erro' } : m))
        );
      }
    }

    setUploadingMedia(false);
    e.target.value = '';
  };

  const handleUrlAdd = (url: string, type: 'image' | 'video') => {
    if (!url.trim()) return;
    setMediaItems(prev => [...prev, { id: `url-${Date.now()}`, url: url.trim(), type }]);
  };

  const removeMediaItem = (id: string) => setMediaItems(prev => prev.filter(m => m.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let storeId: string | null = null;
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (existingStore) {
        storeId = existingStore.id;
      } else {
        const { data: newStore, error: storeError } = await supabase
          .from('stores')
          .insert({ owner_id: userId, name: 'Minha Loja' })
          .select('id')
          .single();
        if (storeError) throw storeError;
        storeId = newStore.id;
      }

      const primaryImage = mediaItems.find(m => m.type === 'image')?.url || null;

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            category: formData.category,
            image: primaryImage,
            created_by: userId,
            store_id: storeId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (mediaItems.length > 0) {
        await supabase.from('service_media').insert(
          mediaItems.map((item, index) => ({
            product_id: data.id,
            url: item.url,
            type: item.type,
            position: index,
            is_primary: index === 0 && item.type === 'image',
          }))
        );
      }

      onSave(data);
    } catch (error: any) {
      alert(`Erro: ${error.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <SectionHeader title="Novo Serviço" subtitle="Ofereça seus serviços no marketplace Work." />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Criação de Logo"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Service">Serviço Freelancer</option>
                <option value="Digital">Produto Digital</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o serviço..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Preço
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preço (R$) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Imagens e Vídeos
          </h3>
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 transition-all text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
            >
              <ImageIcon size={20} />
              <span className="font-medium">Imagens</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-500 transition-all text-zinc-600 dark:text-zinc-400 hover:text-purple-600"
            >
              <Video size={20} />
              <span className="font-medium">Vídeo</span>
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Ou cole uma URL..."
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  if (input.value) {
                    handleUrlAdd(
                      input.value,
                      input.value.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image'
                    );
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={e => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                if (input?.value) {
                  handleUrlAdd(
                    input.value,
                    input.value.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image'
                  );
                  input.value = '';
                }
              }}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${index === 0 ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 dark:border-zinc-700'}`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <video src={item.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play size={32} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  )}
                  {item.uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeMediaItem(item.id)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-medium">
                      Principal
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
              <Upload size={28} className="text-indigo-500 mb-4" />
              <p className="font-medium">Arraste arquivos ou clique nos botões</p>
              <p className="text-sm text-zinc-500 mt-1">Imagens e vídeos</p>
            </div>
          )}
        </div>

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
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check size={18} />
                Publicar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
