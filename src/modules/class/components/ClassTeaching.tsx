import React from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Edit, Eye, MoreHorizontal, Plus, BookOpen } from 'lucide-react';

interface ClassTeachingProps {
  onNavigate?: (page: string) => void;
}

const MY_CREATED_COURSES = [
  {
    id: '1',
    title: 'Curso de Python Avançado',
    sales: 154,
    revenue: 'R$ 15.400,00',
    status: 'Ativo',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
  },
  {
    id: '2',
    title: 'Intro ao Machine Learning',
    sales: 89,
    revenue: 'R$ 8.900,00',
    status: 'Rascunho',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
  },
];

export const ClassTeaching: React.FC<ClassTeachingProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Meus Conteúdos"
        subtitle="Gerencie seus cursos e materiais."
        action={
          <button
            onClick={() => onNavigate?.('CREATE_COURSE')}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Curso
          </button>
        }
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th className="px-6 py-4 font-medium text-zinc-500">Curso</th>
              <th className="px-6 py-4 font-medium text-zinc-500">Vendas</th>
              <th className="px-6 py-4 font-medium text-zinc-500">Receita</th>
              <th className="px-6 py-4 font-medium text-zinc-500">Status</th>
              <th className="px-6 py-4 font-medium text-zinc-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {MY_CREATED_COURSES.map(course => (
              <tr
                key={course.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img src={course.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium">{course.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{course.sales}</td>
                <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">
                  {course.revenue}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {MY_CREATED_COURSES.length === 0 && (
          <div className="p-12">
            <EmptyState
              title="Você ainda não criou cursos"
              icon={BookOpen}
              description="Comece a ensinar hoje mesmo."
            />
          </div>
        )}
      </div>
    </div>
  );
};
