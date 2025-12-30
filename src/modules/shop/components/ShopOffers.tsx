import React, { useState, useEffect } from 'react';
import { Tag, TrendingDown, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ProfileType } from '../../../types';
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

interface ShopOffersProps {
  profile: ProfileType | string;
  userId?: string;
}

export const ShopOffers: React.FC<ShopOffersProps> = ({ profile, userId }) => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      // Buscar produtos com desconto ou em promoção
      // Por enquanto, buscando produtos aleatórios
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    } finally {
      setLoading(false);
    }
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
        title="Ofertas Especiais"
        subtitle="Aproveite os melhores descontos e promoções."
      />

      {/* Destaque de Ofertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-2xl text-white">
          <TrendingDown size={32} className="mb-3" />
          <h3 className="text-2xl font-bold mb-1">Até 50% OFF</h3>
          <p className="text-rose-100 text-sm">Em produtos selecionados</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
          <Tag size={32} className="mb-3" />
          <h3 className="text-2xl font-bold mb-1">Frete Grátis</h3>
          <p className="text-indigo-100 text-sm">Acima de R$ 100</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white">
          <Clock size={32} className="mb-3" />
          <h3 className="text-2xl font-bold mb-1">Flash Sale</h3>
          <p className="text-amber-100 text-sm">Termina em 2h 45min</p>
        </div>
      </div>

      {/* Grid de Produtos em Oferta */}
      {offers.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Produtos em Destaque
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map(product => (
              <div key={product.id} className="relative">
                <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  -30% OFF
                </div>
                <ProductCard
                  product={product}
                  isOwner={userId === product.created_by}
                  onAddToCart={() => console.log('Adicionar ao carrinho')}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <EmptyState
            title="Nenhuma oferta disponível no momento"
            description="Volte em breve para conferir novas promoções."
            icon={Tag}
          />
        </div>
      )}
    </div>
  );
};
