/**
 * FeaturedInstructorsPage - Página dedicada de Instrutores em Destaque
 * Lista todos os instrutores/criadores ativos com filtros
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Star, Users, BookOpen, CheckCircle, Search, MapPin } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Instructor {
  id: string;
  full_name: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean;
  courses_count?: number;
  students_count?: number;
  rating?: number;
}

interface FeaturedInstructorsPageProps {
  onNavigate?: (page: string) => void;
}

const SORT_OPTIONS = [
  { id: 'rating', label: 'Melhor Avaliados' },
  { id: 'students', label: 'Mais Alunos' },
  { id: 'courses', label: 'Mais Cursos' },
  { id: 'name', label: 'Nome A-Z' },
];

const GRADIENTS = [
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
];

export const FeaturedInstructorsPage: React.FC<FeaturedInstructorsPageProps> = ({ onNavigate }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, [sortBy, showVerifiedOnly]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('profiles')
        .select('id, full_name, name, avatar_url, bio, is_verified')
        .eq('type', 'BUSINESS');

      if (showVerifiedOnly) {
        query = query.eq('is_verified', true);
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      // Add simulated stats
      const instructorsWithStats = (data || []).map((instructor, index) => ({
        ...instructor,
        courses_count: Math.floor(Math.random() * 15) + 1,
        students_count: Math.floor(Math.random() * 10000) + 100,
        rating: 4.5 + Math.random() * 0.5,
      }));

      // Sort
      instructorsWithStats.sort((a, b) => {
        switch (sortBy) {
          case 'students':
            return (b.students_count || 0) - (a.students_count || 0);
          case 'courses':
            return (b.courses_count || 0) - (a.courses_count || 0);
          case 'name':
            return (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '');
          default:
            return (b.rating || 0) - (a.rating || 0);
        }
      });

      setInstructors(instructorsWithStats);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const name = instructor.full_name || instructor.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const getGradient = (index: number) => GRADIENTS[index % GRADIENTS.length];

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
            <Award className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Instrutores em Destaque
            </h1>
            <p className="text-sm text-zinc-500">Aprenda com os melhores especialistas</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar instrutores..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={e => setShowVerifiedOnly(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <CheckCircle size={14} className="text-purple-500" />
            Apenas verificados
          </label>

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
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-zinc-500">
        {filteredInstructors.length}{' '}
        {filteredInstructors.length === 1 ? 'instrutor encontrado' : 'instrutores encontrados'}
      </p>

      {/* Instructors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : filteredInstructors.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredInstructors.map((instructor, index) => (
            <button
              key={instructor.id}
              onClick={() => onNavigate?.(`INSTRUCTOR:${instructor.id}`)}
              className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg text-center"
            >
              {/* Verified Badge */}
              {instructor.is_verified && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <CheckCircle size={10} />
                  Verificado
                </div>
              )}

              {/* Avatar */}
              <div className="relative mb-4 mx-auto w-fit">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient(index)} p-0.5`}
                >
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-900 p-1.5 flex items-center justify-center overflow-hidden">
                    {instructor.avatar_url ? (
                      <img
                        src={instructor.avatar_url}
                        alt={instructor.full_name || instructor.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white font-bold text-xl`}
                      >
                        {(instructor.full_name || instructor.name || '?').charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                {instructor.full_name || instructor.name || 'Instrutor'}
              </h3>

              {instructor.bio && (
                <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{instructor.bio}</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="font-bold">{instructor.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <BookOpen size={12} />
                  <span>{instructor.courses_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Users size={12} />
                  <span>{formatCount(instructor.students_count || 0)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
          <Award size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhum instrutor encontrado
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou a busca</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedInstructorsPage;
