import React, { useState } from 'react';
import { ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';
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
    image: '',
    stock: '', // Optional for services, but maybe useful for limited slots
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primeiro, buscar ou criar a store do usuário
      let storeId: string | null = null;

      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (existingStore) {
        storeId = existingStore.id;
      } else {
        // Criar store para o usuário
        const { data: newStore, error: storeError } = await supabase
          .from('stores')
          .insert({ owner_id: userId, name: 'Minha Loja' })
          .select('id')
          .single();

        if (storeError) throw storeError;
        storeId = newStore.id;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image || null,
            created_by: userId,
            store_id: storeId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('Serviço/Produto Digital criado com sucesso:', data);
      onSave(data);
    } catch (error: any) {
      console.error('Erro ao criar serviço:', error);
      alert(`Erro ao criar serviço: ${error.message || 'Tente novamente.'}`);
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
        <ArrowLeft size={16} className="mr-1" /> Voltar para Inicial
      </button>

      <SectionHeader
        title="Novo Serviço/Produto Digital"
        subtitle="Ofereça seus serviços ou produtos digitais no marketplace Work."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Informações Básicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Título *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Criação de Logo, E-book de Marketing"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Service">Serviço Freelancer</option>
                <option value="Digital">Produto Digital</option>
                <option value="Course">Curso / Mentoria</option>
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Descrição
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o que está incluso no serviço ou produto..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Valor e Disponibilidade
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Preço (R$) *
              </label>
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

            {formData.category === 'Service' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vagas / Disponibilidade (Opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Ex: 5 vagas"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            Imagem de Capa
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={handleImageChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
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
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/50">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 mb-3">
                  <ImageIcon size={24} />
                </div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  Cole a URL da imagem acima
                </p>
                <p className="text-sm text-zinc-500 mt-1">A prévia aparecerá aqui</p>
              </div>
            )}
          </div>
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
