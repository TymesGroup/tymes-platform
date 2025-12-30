import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ProductCard } from './ProductCard';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  created_by: string | null;
}

interface ShopInventoryProps {
  userId: string;
  onNavigate?: (page: string) => void;
}

export const ShopInventory: React.FC<ShopInventoryProps> = ({ userId, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, [userId]);

  const fetchMyProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
    // Implement edit modal or navigation to edit page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Meus Produtos"
        subtitle="Gerencie seu catálogo de produtos e serviços."
        action={
          <button
            onClick={() => onNavigate?.('CREATE_PRODUCT')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Adicionar Novo
          </button>
        }
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isOwner={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Você ainda não tem produtos"
            description="Comece adicionando seu primeiro produto ou serviço para venda."
            icon={Package}
          />
          <button
            onClick={() => onNavigate?.('CREATE_PRODUCT')}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            Criar Produto
          </button>
        </div>
      )}
    </div>
  );
};
