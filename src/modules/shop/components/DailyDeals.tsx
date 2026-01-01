import React, { useState, useEffect } from 'react';
import { Zap, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { useBag } from '../../../lib/BagContext';

interface Deal {
  id: string;
  name: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  image: string;
  stock: number;
  sold: number;
}

interface DailyDealsProps {
  onNavigate?: (page: string) => void;
}

const DAILY_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Curso Avançado de TypeScript',
    originalPrice: 399.9,
    dealPrice: 199.9,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    stock: 100,
    sold: 73,
  },
  {
    id: 'deal-2',
    name: 'Pack de Templates Premium',
    originalPrice: 299.9,
    dealPrice: 149.9,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop',
    stock: 50,
    sold: 38,
  },
  {
    id: 'deal-3',
    name: 'Mentoria Individual 2h',
    originalPrice: 599.9,
    dealPrice: 399.9,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    stock: 20,
    sold: 15,
  },
];

export const DailyDeals: React.FC<DailyDealsProps> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDealClick = (dealId: string) => {
    onNavigate?.(`PRODUCT_DETAILS:${dealId}`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-6 md:p-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Ofertas Relâmpago</h2>
              <p className="text-white/80 text-sm">Aproveite antes que acabe!</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Clock className="text-white" size={16} />
            <div className="flex items-center gap-1 text-white font-bold text-sm">
              <span className="bg-white/30 px-2 py-1 rounded min-w-[2rem] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-2 py-1 rounded min-w-[2rem] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-2 py-1 rounded min-w-[2rem] text-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAILY_DEALS.map(deal => {
            const soldPercentage = (deal.sold / deal.stock) * 100;
            return (
              <button
                key={deal.id}
                onClick={() => handleDealClick(deal.id)}
                className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                    <Zap size={12} fill="currentColor" />-{deal.discount}%
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 text-sm">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-red-600">
                      R$ {deal.dealPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-400 line-through">
                      R$ {deal.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>
                        Vendidos: {deal.sold}/{deal.stock}
                      </span>
                      <span>{soldPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 bg-white text-orange-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg text-sm">
            Ver Todas as Ofertas
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
