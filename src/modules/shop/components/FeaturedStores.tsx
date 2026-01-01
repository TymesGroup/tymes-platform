import React from 'react';
import { Store, Star, TrendingUp, Award, ChevronRight } from 'lucide-react';

interface FeaturedStore {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  sales: string;
  badge?: string;
  gradient: string;
}

interface FeaturedStoresProps {
  onNavigate?: (page: string) => void;
}

const FEATURED_STORES: FeaturedStore[] = [
  {
    id: 'store-1',
    name: 'Tech Solutions',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
    rating: 4.9,
    sales: '2.5k',
    badge: 'Top Seller',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'store-2',
    name: 'Design Studio',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    rating: 4.8,
    sales: '1.8k',
    badge: 'Verified',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'store-3',
    name: 'Edu Academy',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=edu',
    rating: 5.0,
    sales: '3.2k',
    badge: 'Premium',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'store-4',
    name: 'Marketing Pro',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=marketing',
    rating: 4.7,
    sales: '1.5k',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export const FeaturedStores: React.FC<FeaturedStoresProps> = ({ onNavigate }) => {
  const handleStoreClick = (storeId: string) => {
    onNavigate?.(`STORE:${storeId}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            Lojas em Destaque
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">Vendedores verificados e bem avaliados</p>
        </div>
        <button className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
          Ver todas <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_STORES.map(store => (
          <button
            key={store.id}
            onClick={() => handleStoreClick(store.id)}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-pink-500/50 transition-all hover:shadow-lg text-center"
          >
            {/* Badge */}
            {store.badge && (
              <div className="absolute top-3 right-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Award size={10} />
                {store.badge}
              </div>
            )}

            {/* Avatar */}
            <div className="relative mb-4 mx-auto w-fit">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${store.gradient} p-0.5`}>
                <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-900 p-1.5">
                  <img
                    src={store.avatar}
                    alt={store.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-pink-600 text-white p-1 rounded-full">
                <Store size={10} />
              </div>
            </div>

            {/* Info */}
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-pink-600 transition-colors text-sm">
              {store.name}
            </h3>

            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span className="font-bold">{store.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <TrendingUp size={12} />
                <span>{store.sales}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
