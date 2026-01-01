/**
 * RecommendedCourses - Seção de Cursos Recomendados
 * Design minimalista com dados reais do Supabase
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Play, Star, Users, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFavorites } from '../../../lib/FavoritesContext';
import { ShowcaseSection } from '../../../components/ui/ShowcaseSection';

interface Course {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail: string | null;
  instructor: string;
  rating?: number;
  students_count?: number;
  duration?: string;
  is_bestseller?: boolean;
}

interface RecommendedCoursesProps {
  onNavigate?: (page: string) => void;
  limit?: number;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  onNavigate,
  limit = 4,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorited, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchCourses();
  }, [limit]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, price, original_price, thumbnail, instructor, rating, students_count, duration, is_bestseller'
        )
        .eq('status', 'published')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      // Process courses to ensure numeric values
      const processedCourses = (data || []).map(c => ({
        ...c,
        price: Number(c.price) || 49.9,
        original_price: c.original_price ? Number(c.original_price) : null,
        rating: Number(c.rating) || null,
        students_count: c.students_count || null,
      }));

      setCourses(processedCourses);
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

  if (loading) {
    return (
      <ShowcaseSection title="Recomendados para Você" icon={Sparkles} iconColor="text-purple-500">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </ShowcaseSection>
    );
  }

  // Don't render if no courses available
  if (courses.length === 0) return null;

  const displayCourses = courses;

  return (
    <ShowcaseSection
      title="Recomendados para Você"
      subtitle="Baseado no seu histórico de aprendizado"
      icon={Sparkles}
      iconColor="text-purple-500"
      onViewAll={() => onNavigate?.('RECOMMENDED_COURSES')}
      viewAllLabel="Ver mais"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCourses.map(course => {
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
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={
                    course.thumbnail ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
                  }
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
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

                {/* Favorite Button */}
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

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Play size={16} className="text-purple-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-2">{course.instructor}</p>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-2 text-xs">
                  {course.rating && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={10} fill="currentColor" />
                      <span className="font-medium">{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {course.students_count && (
                    <div className="flex items-center gap-0.5 text-zinc-400">
                      <Users size={10} />
                      <span>
                        {course.students_count > 1000
                          ? `${(course.students_count / 1000).toFixed(1)}k`
                          : course.students_count}
                      </span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-0.5 text-zinc-400">
                      <Clock size={10} />
                      <span>{course.duration}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
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
    </ShowcaseSection>
  );
};

export default RecommendedCourses;
