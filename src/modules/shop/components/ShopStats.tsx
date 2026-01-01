import React from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Package, CreditCard } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { ProfileType } from '../../../types';
import { STATS_DATA } from '../../../data/mock';

interface ShopStatsProps {
  profile: ProfileType | string; // Type string fallback just in case
}

const PERSONAL_STATS_DATA = [
  { name: 'Jan', gastos: 1200 },
  { name: 'Fev', gastos: 900 },
  { name: 'Mar', gastos: 1500 },
  { name: 'Abr', gastos: 2000 },
  { name: 'Mai', gastos: 800 },
  { name: 'Jun', gastos: 1100 },
];

export const ShopStats: React.FC<ShopStatsProps> = ({ profile }) => {
  const isBusiness = profile === ProfileType.BUSINESS;

  if (isBusiness) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Vendas Totais</span>
              <DollarSign className="text-emerald-500" size={20} />
            </div>
            <div className="text-2xl font-bold">1,242</div>
            <div className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +12% esse mês
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Receita Mensal</span>
              <TrendingUp className="text-indigo-500" size={20} />
            </div>
            <div className="text-2xl font-bold">R$ 45.230,00</div>
            <div className="text-xs text-indigo-500 flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +8% esse mês
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Pedidos Pendentes</span>
              <ShoppingBag className="text-amber-500" size={20} />
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs text-zinc-500 mt-1">Requer atenção</div>
          </div>
        </div>

        <div className="h-80 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-base font-semibold mb-4">Desempenho de Vendas</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={STATS_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#3f3f46"
                opacity={0.1}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `R$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#e4e4e7' }}
                formatter={(value: number) => [`R$ ${value}`, 'Vendas']}
              />
              <Bar dataKey="vendas" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Personal View
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm">Meus Pedidos</span>
            <Package className="text-indigo-500" size={20} />
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-xs text-zinc-500 mt-1">2 em trânsito</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm">Gasto Total</span>
            <CreditCard className="text-emerald-500" size={20} />
          </div>
          <div className="text-2xl font-bold">R$ 3.450,00</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm">Bolsa</span>
            <ShoppingBag className="text-rose-500" size={20} />
          </div>
          <div className="text-2xl font-bold">3 itens</div>
        </div>
      </div>

      <div className="h-80 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-base font-semibold mb-4">Histórico de Gastos</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={PERSONAL_STATS_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `R$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#e4e4e7' }}
              formatter={(value: number) => [`R$ ${value}`, 'Gasto']}
            />
            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
