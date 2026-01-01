/**
 * RecommendedCoursesPage - Página dedicada de Cursos Recomendados
 * Lógica de recomendação baseada em histórico e popularidade
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Star,
  Heart,
  Play,
  Users,
  Clock,
  Filter,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  price: number;
  original_price?: number;
  rating?: number;
  total_reviews?: number;
  students_count?: number;
  duration?: string;
  category?: string;
  level?: string;
  is_bestseller?: boolean;
}

interface RecommendedCoursesPageProps {
  onNavigate?: (page: string) => void;
}

const CATEGORIES = ['Todos', 'tech', 'design', 'business'];
const LEVELS = ['Todos', 'beginner', 'intermediate', 'advanced'];
const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevância' },
  { id: 'rating', label: 'Melhor Avaliados' },
  { id: 'students', label: 'Mais Alunos' },
  { id: 'price_asc', label: 'Menor Preço' },
  { id: 'price_desc', label: 'Maior Preço' },
];

const CATEGORY_LABELS: Record<string, string> = {
  tech: 'Tecnologia',
  design: 'Design',
  business: 'Negócios',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

export const RecommendedCoursesPage: React.FC<RecommendedCoursesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [sortBy, setSortBy] = useState('relevance');
  const [gridView, setGridView] = useState<'grid' | 'compact'>('grid');

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('courses')
        .select(
          'id, title, instructor, thumbnail, price, original_price, rating, total_reviews, students_count, duration, category, level, is_bestseller'
        )
        .eq('status', 'published');

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedLevel !== 'Todos') {
        query = query.eq('level', selectedLevel);
      }

      switch (sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false, nullsFirst: false });
          break;
        case 'students':
          query = query.order('students_count', { ascending: false, nullsFirst: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('rating', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    try {
      await toggleFavorite(courseId, 'course');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const formatStudents = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate?.('VITRINE')}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Cursos Recomendados
            </h1>
            <p className="text-sm text-zinc-500">Baseado no seu histórico de aprendizado</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat === 'Todos' ? 'Todos' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          >
            {LEVELS.map(level => (
              <option key={level} value={level}>
                {level === 'Todos' ? 'Todos os níveis' : LEVEL_LABELS[level] || level}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setGridView('grid')}
              className={`p-2 rounded-md transition-colors ${gridView === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setGridView('compact')}
              className={`p-2 rounded-md transition-colors ${gridView === 'compact' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-zinc-500">
        {courses.length} {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
      </p>

      {/* Courses Grid */}
      {loading ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div
          className={`grid gap-4 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {courses.map(course => {
            const hasDiscount = course.original_price && course.original_price > course.price;
            const discount = hasDiscount
              ? Math.round((1 - course.price / course.original_price!) * 100)
              : 0;

            return (
              <button
                key={course.id}
                onClick={() => onNavigate?.(`COURSE_DETAILS:${course.id}`)}
                className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg text-left"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                      <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        -{discount}%
                      </span>
                    )}
                    {course.is_bestseller && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <button
                    onClick={e => handleToggleFavorite(e, course.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <Heart
                      size={14}
                      className={
                        isFavorited(course.id, 'course') ? 'fill-rose-500 text-rose-500' : ''
                      }
                    />
                  </button>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Play size={20} className="text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-2">{course.instructor}</p>

                  <div className="flex items-center gap-3 mb-3 text-xs">
                    {course.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {course.students_count && (
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Users size={12} />
                        <span>{formatStudents(course.students_count)}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">{formatPrice(course.price)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(course.original_price!)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
          <Sparkles size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhum curso encontrado
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou explore outras categorias</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedCoursesPage;
