/**
 * InstructorPage - Página pública do instrutor
 * Mostra informações do instrutor e seus cursos
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Share2,
  GraduationCap,
  Building2,
  CheckCircle,
  BookOpen,
  Play,
  Clock,
  Award,
  Globe,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface InstructorPageProps {
  instructorId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface InstructorInfo {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  type: string;
  address_city?: string;
  address_state?: string;
  created_at: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

interface Course {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
  rating?: number;
  total_reviews?: number;
  category: string;
  duration?: string;
  students_count?: number;
  level?: string;
}

export const InstructorPage: React.FC<InstructorPageProps> = ({
  instructorId,
  onBack,
  onNavigate,
}) => {
  const { profile } = useAuth();
  const [instructor, setInstructor] = useState<InstructorInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  useEffect(() => {
    loadInstructorData();
  }, [instructorId]);

  const loadInstructorData = async () => {
    setLoading(true);
    try {
      // Fetch instructor profile
      const { data: instructorData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', instructorId)
        .single();

      if (error) throw error;
      setInstructor(instructorData);

      // Fetch instructor courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select(
          'id, title, price, thumbnail, rating, total_reviews, category, duration, students_count, level'
        )
        .eq('created_by', instructorId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error loading instructor:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Get unique categories
  const categories = ['all', ...new Set(courses.map(c => c.category))];

  const filteredCourses =
    activeCategory === 'all' ? courses : courses.filter(c => c.category === activeCategory);

  const totalStudents = courses.reduce((sum, c) => sum + (c.students_count || 0), 0);
  const avgRating =
    courses.length > 0 ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length : 0;
  const totalReviews = courses.reduce((sum, c) => sum + (c.total_reviews || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 text-lg">Instrutor não encontrado</p>
        <button onClick={onBack} className="mt-4 text-purple-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      {/* Instructor Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Banner */}
        <div className="h-48 md:h-56 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200')] bg-cover bg-center opacity-20" />
        </div>

        {/* Instructor Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            {instructor.avatar_url ? (
              <img
                src={instructor.avatar_url}
                alt={instructor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
                <GraduationCap size={48} className="text-white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="px-4 py-2.5 rounded-xl border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2">
              <MessageCircle size={18} /> Contatar
            </button>
          </div>

          {/* Info */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{instructor.name}</h1>
              <CheckCircle size={24} className="text-purple-600" />
              {instructor.type === 'BUSINESS' && (
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Building2 size={12} /> Instrutor PRO
                </span>
              )}
            </div>

            <p className="text-zinc-500">Instrutor</p>

            {instructor.bio && (
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl">{instructor.bio}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">({totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={18} />
                <span>{totalStudents.toLocaleString()} alunos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <BookOpen size={18} />
                <span>{courses.length} cursos</span>
              </div>
              {instructor.address_city && (
                <div className="flex items-center gap-1 text-zinc-500">
                  <MapPin size={18} />
                  <span>
                    {instructor.address_city}, {instructor.address_state}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar size={18} />
                <span>Desde {formatDate(instructor.created_at)}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {instructor.website && (
                <a
                  href={instructor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Globe size={18} />
                </a>
              )}
              {instructor.linkedin && (
                <a
                  href={instructor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {instructor.twitter && (
                <a
                  href={instructor.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? 'Todos os Cursos' : cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map(course => (
              <button
                key={course.id}
                onClick={() => onNavigate?.(`COURSE:${course.id}`)}
                className="group text-left bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <Play size={24} className="text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {course.level && (
                    <span className="absolute top-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded-lg">
                      {course.level}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                    {course.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.students_count && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{course.students_count}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-purple-600 font-bold mt-2">{formatPrice(course.price || 0)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500">Nenhum curso encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPage;
