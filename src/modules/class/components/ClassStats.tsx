import React from 'react';
import { DollarSign, TrendingUp, Users, BookOpen, Award, Clock } from 'lucide-react';
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

interface ClassStatsProps {
  profile: ProfileType | string;
}

const PERSONAL_STATS_DATA = [
  { name: 'Jan', horas: 12 },
  { name: 'Fev', horas: 20 },
  { name: 'Mar', horas: 15 },
  { name: 'Abr', horas: 25 },
  { name: 'Mai', horas: 30 },
  { name: 'Jun', horas: 18 },
];

export const ClassStats: React.FC<ClassStatsProps> = ({ profile }) => {
  const isBusiness = profile === ProfileType.BUSINESS;

  if (isBusiness) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Cursos Vendidos</span>
              <BookOpen className="text-indigo-500" size={20} />
            </div>
            <div className="text-2xl font-bold">342</div>
            <div className="text-xs text-indigo-500 flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +15% esse mês
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Receita Mensal</span>
              <DollarSign className="text-emerald-500" size={20} />
            </div>
            <div className="text-2xl font-bold">R$ 12.450,00</div>
            <div className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +5% esse mês
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">Alunos Ativos</span>
              <Users className="text-amber-500" size={20} />
            </div>
            <div className="text-2xl font-bold">1,205</div>
            <div className="text-xs text-zinc-500 mt-1">Em todos os cursos</div>
          </div>
        </div>

        <div className="h-80 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-base font-semibold mb-4">Desempenho de Vendas de Cursos</h3>
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
            <span className="text-zinc-500 text-sm">Cursos em Andamento</span>
            <BookOpen className="text-indigo-500" size={20} />
          </div>
          <div className="text-2xl font-bold">4</div>
          <div className="text-xs text-zinc-500 mt-1">Continue aprendendo</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm">Horas Assistidas</span>
            <Clock className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold">120h</div>
          <div className="text-xs text-zinc-500 mt-1">Total acumulado</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm">Certificados</span>
            <Award className="text-amber-500" size={20} />
          </div>
          <div className="text-2xl font-bold">7</div>
          <div className="text-xs text-zinc-500 mt-1">Conquistas desbloqueadas</div>
        </div>
      </div>

      <div className="h-80 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-base font-semibold mb-4">Ritmo de Aprendizado</h3>
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
              tickFormatter={value => `${value}h`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#e4e4e7' }}
              formatter={(value: number) => [`${value} horas`, 'Estudo']}
            />
            <Line
              type="monotone"
              dataKey="horas"
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
