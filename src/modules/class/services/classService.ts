import { supabase } from '../../../lib/supabase';

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
}

export interface CourseWithInstructor extends Course {
  instructor_profile?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

// ============ COURSES ============
export const courseService = {
  async getAll(filters?: { category?: string }) {
    let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (filters?.category) query = query.eq('category', filters.category);
    const { data, error } = await query;
    if (error) throw error;
    return data as Course[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*, instructor_profile:profiles!courses_created_by_fkey(id, name, avatar_url)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as CourseWithInstructor;
  },

  async getByInstructor(instructorId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('created_by', instructorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Course[];
  },

  async create(course: Partial<Course>) {
    const { data, error } = await supabase.from('courses').insert(course).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
  },

  async search(term: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .or(`title.ilike.%${term}%,instructor.ilike.%${term}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Course[];
  },
};

// ============ COURSE PROGRESS ============
export const courseProgressService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*, course:courses(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async getProgress(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProgress(userId: string, courseId: string, progress: number) {
    const existing = await this.getProgress(userId, courseId);
    if (existing) {
      const { data, error } = await supabase
        .from('course_progress')
        .update({ progress, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('course_progress')
        .insert({ user_id: userId, course_id: courseId, progress })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
};
