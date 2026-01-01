import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Zap,
  GraduationCap,
  ChevronRight,
  Sparkles,
  BookOpen,
  Star,
  Clock,
  Play,
  Users,
  Award,
  Heart,
  Search,
} from 'lucide-react';
import { ProfileType } from '../../../types';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useCourses } from '../hooks/useClass';
import { useFavorites } from '../../../lib/FavoritesContext';
import { FlashCourses } from './FlashCourses';
import { RecommendedCourses } from './RecommendedCourses';
import { FeaturedInstructors } from './FeaturedInstructors';

interface ClassMarketplaceProps {
  profile: ProfileType | string;
  userId?: string;
  onNavigate?: (page: string) => void;
}

const HERO_BANNERS = [
  {
    id: 1,
    title: 'Aprenda Novas Habilidades',
    subtitle: 'Cursos com até 70% de desconto',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    icon: GraduationCap,
    badge: 'Promoção de Verão',
  },
  {
    id: 2,
    title: 'Certificados Reconhecidos',
    subtitle: 'Impulsione sua carreira com certificações',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: Award,
    badge: 'Certificação',
  },
  {
    id: 3,
    title: 'Aprenda com Especialistas',
    subtitle: 'Instrutores renomados do mercado',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    icon: Star,
    badge: 'Top Instrutores',
  },
];

const FEATURED_CATEGORIES = [
  { id: 'Todos', name: 'Todos', icon: '📚', color: 'from-indigo-500 to-purple-600', count: '' },
  { id: 'tech', name: 'Tecnologia', icon: '💻', color: 'from-blue-500 to-cyan-600', count: '' },
  {
    id: 'business',
    name: 'Negócios',
    icon: '📊',
    color: 'from-emerald-500 to-teal-600',
    count: '',
  },
  { id: 'design', name: 'Design', icon: '🎨', color: 'from-purple-500 to-pink-600', count: '' },
];

export const ClassMarketplace: React.FC<ClassMarketplaceProps> = ({
  profile,
  userId,
  onNavigate,
}) => {
  const isBusiness = profile === ProfileType.BUSINESS;
  const { courses, loading } = useCourses();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFavorite = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await toggleFavorite(courseId, 'course');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error instanceof Error ? error.message : 'Faça login para favoritar');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    return matchesCategory;
  });

  const banner = HERO_BANNERS[currentBanner];
  const Icon = banner.icon;

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          {isBusiness && (
            <button
              onClick={() => onNavigate?.('TEACHING')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <GraduationCap size={18} />
              Área do Professor
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} transition-all duration-1000`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        </div>
        <div className="relative h-full flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Clock size={14} />
              {banner.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {banner.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">{banner.subtitle}</p>
            <button className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-xl flex items-center gap-2 group">
              Explorar Cursos
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Icon size={80} className="text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Flash Courses */}
      <FlashCourses onNavigate={onNavigate} />

      {/* Recommended Courses */}
      <RecommendedCourses onNavigate={onNavigate} />

      {/* Featured Instructors */}
      <FeaturedInstructors onNavigate={onNavigate} />

      {/* Featured Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:scale-105 ${selectedCategory === cat.id ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:shadow-lg'}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className="relative">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-white mb-1">{cat.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('Todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'Todos' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'}`}
        >
          Todos
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <TrendingUp size={14} /> Mais Vendidos
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <Sparkles size={14} /> Novidades
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2">
          <Star size={14} /> Mais Avaliados
        </button>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'Todos' ? 'Todos os Cursos' : selectedCategory}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {filteredCourses.length}{' '}
              {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                onClick={() => onNavigate?.(`COURSE_DETAILS:${course.id}`)}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
                    }}
                  />
                  {course.is_bestseller && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Bestseller
                    </div>
                  )}
                  <button
                    onClick={e => handleToggleFavorite(course.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors z-10"
                  >
                    <Heart
                      size={18}
                      className={
                        isFavorited(course.id, 'course')
                          ? 'text-red-500 fill-red-500'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }
                    />
                  </button>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <Play size={24} className="text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-zinc-500 mb-2">{course.instructor}</p>
                  {course.description && (
                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{course.description}</p>
                  )}
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    {course.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                    )}
                    {course.students_count && (
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Users size={14} />
                        <span>
                          {course.students_count > 1000
                            ? `${(course.students_count / 1000).toFixed(1)}k`
                            : course.students_count}
                        </span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                  {(course.price || course.original_price) && (
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                          {course.price
                            ? `R$ ${course.price.toFixed(2).replace('.', ',')}`
                            : 'Grátis'}
                        </span>
                        {course.original_price &&
                          course.price &&
                          course.original_price > course.price && (
                            <span className="text-sm text-zinc-400 line-through">
                              R$ {course.original_price.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                      </div>
                      {course.original_price &&
                        course.price &&
                        course.original_price > course.price && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                            {Math.round((1 - course.price / course.original_price) * 100)}% OFF
                          </span>
                        )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              title="Nenhum curso encontrado"
              description="Tente ajustar seus filtros de busca ou explore outras categorias."
              icon={Search}
            />
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      {isBusiness && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Compartilhe seu conhecimento
              </h3>
              <p className="text-white/90 text-lg">
                Crie cursos e alcance milhares de alunos na plataforma Tymes
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('CREATE_COURSE')}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
            >
              <GraduationCap size={20} /> Criar Curso
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
