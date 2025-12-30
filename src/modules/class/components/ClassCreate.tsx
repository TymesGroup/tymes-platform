import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  level: string;
  duration: string;
  created_by: string;
}

interface ClassCreateProps {
  onBack: () => void;
  onSave: (data: CourseData) => void;
}

export const ClassCreate: React.FC<ClassCreateProps> = ({ onBack, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    level: 'beginner',
    duration: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      // Primeiro, buscar ou criar a store do usuário
      let storeId: string | null = null;

      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (existingStore) {
        storeId = existingStore.id;
      } else {
        // Criar store para o usuário
        const { data: newStore, error: storeError } = await supabase
          .from('stores')
          .insert({ owner_id: user.id, name: 'Minha Escola' })
          .select('id')
          .single();

        if (storeError) throw storeError;
        storeId = newStore.id;
      }

      // Criar o curso na tabela courses
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          description: formData.description || null,
          price: parseFloat(formData.price) || 0,
          thumbnail: formData.image || null,
          instructor_id: user.id,
          store_id: storeId,
          level: formData.level,
          duration: formData.duration ? parseInt(formData.duration) : null,
          status: 'published',
        })
        .select()
        .single();

      if (error) throw error;

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
        className="flex items-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
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
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Descreva o que os alunos irão aprender..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nível</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                type="number"
                min="1"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 10"
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
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
            <p className="text-xs text-zinc-500">Deixe 0 para curso gratuito</p>
          </div>
        </div>

        {/* Imagem */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Capa do Curso
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              URL da Imagem
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={e => handleImageChange(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {imagePreview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImagePreview('')}
              />
            </div>
          ) : (
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <ImageIcon size={32} className="text-zinc-400 mb-2" />
              <span className="text-sm text-zinc-400">Cole a URL da imagem acima</span>
            </div>
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
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
