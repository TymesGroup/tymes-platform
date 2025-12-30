import React from 'react';
import { Store, Star, TrendingUp, Award } from 'lucide-react';

interface FeaturedStore {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  sales: string;
  badge?: string;
  gradient: string;
}

const FEATURED_STORES: FeaturedStore[] = [
  {
    id: '1',
    name: 'Tech Solutions',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
    rating: 4.9,
    sales: '2.5k',
    badge: 'Top Seller',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    name: 'Design Studio',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    rating: 4.8,
    sales: '1.8k',
    badge: 'Verified',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: '3',
    name: 'Edu Academy',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=edu',
    rating: 5.0,
    sales: '3.2k',
    badge: 'Premium',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: '4',
    name: 'Marketing Pro',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=marketing',
    rating: 4.7,
    sales: '1.5k',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export const FeaturedStores: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-amber-500" size={28} />
            Lojas em Destaque
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Vendedores verificados e bem avaliados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_STORES.map(store => (
          <button
            key={store.id}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-indigo-500 transition-all hover:shadow-xl"
          >
            {/* Badge */}
            {store.badge && (
              <div className="absolute top-3 right-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Award size={10} />
                {store.badge}
              </div>
            )}

            {/* Avatar */}
            <div className="relative mb-4">
              <div
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${store.gradient} p-0.5`}
              >
                <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-900 p-2">
                  <img
                    src={store.avatar}
                    alt={store.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white p-1.5 rounded-full">
                <Store size={12} />
              </div>
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {store.name}
              </h3>

              <div className="flex items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold">{store.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <TrendingUp size={14} />
                  <span className="font-medium">{store.sales}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
