/**
 * FeaturedInstructors - Seção de Instrutores em Destaque
 * Design horizontal com cards escuros
 */

import React, { useState, useEffect } from 'react';
import { Star, BookOpen, Users, CheckCircle, MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Instructor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio?: string;
  location?: string;
  courses_count?: number;
  students_count?: number;
  rating?: number;
  is_verified?: boolean;
}

interface FeaturedInstructorsProps {
  onNavigate?: (page: string) => void;
  limit?: number;
}

export const FeaturedInstructors: React.FC<FeaturedInstructorsProps> = ({
  onNavigate,
  limit = 3,
}) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, [limit]);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, bio, address_city, address_state, type, is_verified')
        .eq('type', 'BUSINESS')
        .limit(limit);

      if (error) throw error;

      const instructorsWithStats = (data || []).map((instructor, index) => ({
        id: instructor.id,
        full_name: instructor.name || 'Instrutor',
        avatar_url: instructor.avatar_url,
        bio: instructor.bio || 'Especialista em educação',
        location:
          instructor.address_city && instructor.address_state
            ? `${instructor.address_city}, ${instructor.address_state}`
            : 'Brasil',
        courses_count: Math.floor(Math.random() * 10) + 1,
        students_count: Math.floor(Math.random() * 5000) + 100,
        rating: 4.5 + Math.random() * 0.5,
        is_verified: instructor.is_verified || index < 2,
      }));

      setInstructors(instructorsWithStats);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (instructors.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Instrutores em Destaque</h2>
        <button
          onClick={() => onNavigate?.('FEATURED_INSTRUCTORS')}
          className="text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver todos <ChevronRight size={16} />
        </button>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {instructors.map(instructor => (
          <button
            key={instructor.id}
            onClick={() => onNavigate?.(`INSTRUCTOR:${instructor.id}`)}
            className="group bg-zinc-900 dark:bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-all text-left border border-zinc-800"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {instructor.avatar_url ? (
                  <img
                    src={instructor.avatar_url}
                    alt={instructor.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {instructor.full_name?.charAt(0) || '?'}
                  </div>
                )}
                {instructor.is_verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-purple-600 rounded-full p-0.5">
                    <CheckCircle size={10} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {instructor.full_name}
                </h3>
                <p className="text-xs text-zinc-400 truncate">{instructor.bio}</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                  <MapPin size={10} />
                  {instructor.location}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <BookOpen size={12} />
                <span>{instructor.courses_count} cursos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <Users size={12} />
                <span>{formatCount(instructor.students_count || 0)} alunos</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star size={12} fill="currentColor" />
                <span className="font-medium">{instructor.rating?.toFixed(1)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedInstructors;
