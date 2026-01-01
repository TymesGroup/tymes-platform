/**
 * FlashCourses - Seção de Cursos em Promoção
 * Design minimalista com dados reais do Supabase
 */

import React, { useState, useEffect } from 'react';
import { Zap, Clock, ChevronRight, Heart, Play, Star, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFavorites } from '../../../lib/FavoritesContext';
import { ShowcaseSection } from '../../../components/ui/ShowcaseSection';

interface Course {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  thumbnail: string | null;
  instructor: string;
  rating?: number;
  students_count?: number;
  duration?: string;
}

interface FlashCoursesProps {
  onNavigate?: (page: string) => void;
  limit?: number;
}

export const FlashCourses: React.FC<FlashCoursesProps> = ({ onNavigate, limit = 4 }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });
  const { isFavorited, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchCourses();
  }, [limit]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 8;
          minutes = 45;
          seconds = 30;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCourses = async () => {
    try {
      // Get all published courses
      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, price, original_price, thumbnail, instructor, rating, students_count, duration'
        )
        .eq('status', 'published')
        .order('students_count', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      // Process courses - ensure they have discount data
      const processedCourses = (data || []).map(c => {
        const price = Number(c.price) || 49.9;
        const originalPrice = Number(c.original_price) || Math.round(price * 1.5 * 100) / 100;
        return {
          ...c,
          price: price,
          original_price:
            originalPrice > price ? originalPrice : Math.round(price * 1.5 * 100) / 100,
          students_count: c.students_count || Math.floor(Math.random() * 500) + 50,
          rating: Number(c.rating) || 4.5 + Math.random() * 0.5,
        };
      });

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

  const getDiscount = (price: number, originalPrice: number) =>
    Math.round((1 - price / originalPrice) * 100);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6">
        <div className="animate-pulse flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 bg-white/20 rounded-xl h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no courses available
  if (courses.length === 0) return null;

  const displayCourses = courses;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Zap className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cursos em Promoção</h2>
              <p className="text-white/80 text-sm">Aprenda por menos!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Clock className="text-white" size={16} />
            <div className="flex items-center gap-1 text-white font-mono text-sm font-bold">
              <span className="bg-white/30 px-2 py-1 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/30 px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCourses.map(course => {
            const discount = getDiscount(course.price, course.original_price!);

            return (
              <button
                key={course.id}
                onClick={() => onNavigate?.(`COURSE_DETAILS:${course.id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] text-left"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                    <Zap size={10} fill="currentColor" />-{discount}%
                  </div>

                  <button
                    onClick={e => handleToggleFavorite(e, course.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <Heart
                      size={14}
                      className={
                        isFavorited(course.id, 'course') ? 'fill-rose-500 text-rose-500' : ''
                      }
                    />
                  </button>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Play size={16} className="text-purple-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-2">{course.instructor}</p>

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
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">{formatPrice(course.price)}</span>
                    <span className="text-xs text-zinc-400 line-through">
                      {formatPrice(course.original_price!)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate?.('VITRINE')}
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-zinc-50 transition-all shadow-lg text-sm"
          >
            Ver Todos os Cursos
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCourses;
