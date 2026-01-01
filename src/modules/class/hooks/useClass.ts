import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { dataCache, CACHE_KEYS } from '../../../lib/dataCache';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  created_by: string | null;
  created_at: string | null;
  description?: string;
  price?: number;
  original_price?: number;
  category?: string;
  duration?: string;
  rating?: number;
  total_reviews?: number;
  students_count?: number;
  is_bestseller?: boolean;
  status?: string;
  level?: string;
  language?: string;
  video_url?: string;
}

export interface CourseMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  position: number;
  is_primary: boolean;
  alt_text?: string;
}

export interface CourseWithInstructor extends Course {
  instructor_profile?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  media?: CourseMedia[];
}

// Hook para cursos - com cache instantâneo
export function useCourses(filters?: { category?: string }) {
  const [courses, setCourses] = useState<Course[]>(() => {
    return dataCache.get<Course[]>(CACHE_KEYS.COURSES) || [];
  });
  const [loading, setLoading] = useState(() => !dataCache.has(CACHE_KEYS.COURSES));
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (forceRefresh = false) => {
    try {
      if (!dataCache.has(CACHE_KEYS.COURSES)) {
        setLoading(true);
      }

      const data = await dataCache.getOrFetch<Course[]>(
        CACHE_KEYS.COURSES,
        async () => {
          const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data || [];
        },
        { forceRefresh }
      );

      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();

    const unsubscribe = dataCache.subscribe<Course[]>(CACHE_KEYS.COURSES, setCourses);

    const channel = supabase
      .channel('courses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchCourses(true);
      })
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchCourses]);

  // Apply filters client-side
  const filteredCourses = useMemo(() => {
    if (!filters?.category) return courses;
    return courses.filter(course => course.category === filters.category);
  }, [courses, filters?.category]);

  return { courses: filteredCourses, loading, error, refetch: () => fetchCourses(true) };
}

// Hook para curso individual
export function useCourse(courseId: string | null) {
  const [course, setCourse] = useState<CourseWithInstructor | null>(() => {
    if (!courseId) return null;
    const courses = dataCache.get<Course[]>(CACHE_KEYS.COURSES);
    return (courses?.find(c => c.id === courseId) as CourseWithInstructor) || null;
  });
  const [loading, setLoading] = useState(() => {
    if (!courseId) return false;
    const courses = dataCache.get<Course[]>(CACHE_KEYS.COURSES);
    return !courses?.find(c => c.id === courseId);
  });

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        // Fetch course with instructor
        const { data, error } = await supabase
          .from('courses')
          .select('*, instructor_profile:profiles!courses_created_by_fkey(id, name, avatar_url)')
          .eq('id', courseId)
          .single();
        if (error) throw error;

        // Fetch media
        const { data: mediaData } = await supabase
          .from('course_media')
          .select('*')
          .eq('course_id', courseId)
          .order('position');

        setCourse({ ...data, media: mediaData || [] });
      } catch (err) {
        console.error('Erro ao carregar curso:', err);
        // Fallback to cache
        const courses = dataCache.get<Course[]>(CACHE_KEYS.COURSES);
        const cached = courses?.find(c => c.id === courseId);
        if (cached) {
          setCourse(cached as CourseWithInstructor);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [courseId]);

  return { course, loading };
}

// Hook para meus cursos (instrutor) - com cache
export function useMyCourses() {
  const { user } = useAuth();
  const cacheKey = user?.id ? CACHE_KEYS.COURSES_BY_USER(user.id) : '';

  const [courses, setCourses] = useState<Course[]>(() => {
    if (!user?.id) return [];
    return dataCache.get<Course[]>(cacheKey) || [];
  });
  const [loading, setLoading] = useState(() => {
    if (!user?.id) return false;
    return !dataCache.has(cacheKey);
  });

  const fetchCourses = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return;

      try {
        if (!dataCache.has(cacheKey)) setLoading(true);

        const data = await dataCache.getOrFetch<Course[]>(
          cacheKey,
          async () => {
            const { data, error } = await supabase
              .from('courses')
              .select('*')
              .eq('created_by', user.id)
              .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
          },
          { forceRefresh }
        );

        setCourses(data);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      } finally {
        setLoading(false);
      }
    },
    [user?.id, cacheKey]
  );

  useEffect(() => {
    fetchCourses();

    if (!user?.id) return;

    const unsubscribe = dataCache.subscribe<Course[]>(cacheKey, setCourses);

    return () => unsubscribe();
  }, [fetchCourses, user?.id, cacheKey]);

  const createCourse = async (course: Partial<Course>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('courses')
      .insert({ ...course, created_by: user.id })
      .select()
      .single();

    if (error) throw error;

    dataCache.update<Course[]>(cacheKey, current => [data, ...(current || [])]);
    dataCache.update<Course[]>(CACHE_KEYS.COURSES, current => [data, ...(current || [])]);

    return data;
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    dataCache.update<Course[]>(cacheKey, current =>
      (current || []).map(c => (c.id === id ? data : c))
    );
    dataCache.update<Course[]>(CACHE_KEYS.COURSES, current =>
      (current || []).map(c => (c.id === id ? data : c))
    );

    return data;
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;

    dataCache.update<Course[]>(cacheKey, current => (current || []).filter(c => c.id !== id));
    dataCache.update<Course[]>(CACHE_KEYS.COURSES, current =>
      (current || []).filter(c => c.id !== id)
    );
  };

  return {
    courses,
    loading,
    refetch: () => fetchCourses(true),
    createCourse,
    updateCourse,
    deleteCourse,
  };
}

// Hook para progresso do usuário
export function useMyProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user?.id) {
      setProgress([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_progress')
        .select('*, course:courses(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, refetch: fetchProgress };
}
