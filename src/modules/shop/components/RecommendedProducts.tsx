import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  badge?: string;
}

const RECOMMENDED: RecommendedProduct[] = [
  {
    id: '1',
    name: 'Curso Completo de React',
    price: 299.9,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    discount: 30,
    badge: 'Mais Vendido',
  },
  {
    id: '2',
    name: 'Design System Pro',
    price: 149.9,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    badge: 'Novo',
  },
  {
    id: '3',
    name: 'Consultoria UX/UI',
    price: 499.9,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    discount: 20,
  },
  {
    id: '4',
    name: 'Template Landing Page',
    price: 79.9,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    badge: 'Popular',
  },
];

export const RecommendedProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold">Recomendados para Você</h2>
            <p className="text-zinc-500 text-sm">Baseado no seu histórico</p>
          </div>
        </div>
        <button className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
          Ver mais
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RECOMMENDED.map(product => (
          <button
            key={product.id}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all hover:shadow-xl text-left"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.discount && (
                  <div className="bg-rose-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{product.discount}%
                  </div>
                )}
                {product.badge && (
                  <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center gap-2">
                {product.discount && (
                  <span className="text-sm text-zinc-400 line-through">
                    R$ {(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
