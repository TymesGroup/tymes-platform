import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

const MY_COURSES = [
  {
    id: '1',
    title: 'Fundamentos de React',
    progress: 75,
    totalHours: 10,
    completedHours: 7.5,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    id: '2',
    title: 'UX/UI Design Moderno',
    progress: 30,
    totalHours: 20,
    completedHours: 6,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&q=80',
  },
];

export const ClassLibrary: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader title="Meus Cursos" subtitle="Continue de onde parou." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_COURSES.map(course => (
          <div
            key={course.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all"
          >
            <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800 group cursor-pointer">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <PlayCircle size={48} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                <div className="h-full bg-indigo-500" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {course.completedHours}h de {course.totalHours}h
                  </span>
                </div>
                <span className="font-medium text-indigo-500">{course.progress}% concluído</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {MY_COURSES.length === 0 && (
        <EmptyState
          title="Você ainda não tem cursos"
          icon={PlayCircle}
          description="Explore a página inicial para começar a aprender."
        />
      )}
    </div>
  );
};
