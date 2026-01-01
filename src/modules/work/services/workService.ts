import { supabase } from '../../../lib/supabase';

export interface ServiceMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  position: number;
  is_primary: boolean;
  alt_text?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  created_by: string | null;
  created_at: string | null;
  status: string | null;
  rating?: number;
  total_reviews?: number;
  delivery_time?: string;
  media?: ServiceMedia[];
}

export interface ServiceWithFreelancer extends Service {
  freelancer?: {
    id: string;
    name: string;
    avatar_url: string | null;
    type: string;
  };
}

// ============ SERVICES (using products table with work categories) ============
export const workService = {
  async getAll(filters?: { category?: string }) {
    let query = supabase
      .from('products')
      .select('*, freelancer:profiles!products_created_by_fkey(id, name, avatar_url, type)')
      .in('category', ['Service', 'Digital', 'Course'])
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'Todos') {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ServiceWithFreelancer[];
  },

  async getById(id: string) {
    // Fetch service with freelancer
    const { data, error } = await supabase
      .from('products')
      .select(
        '*, freelancer:profiles!products_created_by_fkey(id, name, avatar_url, type, email, phone)'
      )
      .eq('id', id)
      .single();
    if (error) throw error;

    // Fetch media
    const { data: mediaData } = await supabase
      .from('service_media')
      .select('*')
      .eq('product_id', id)
      .order('position');

    return { ...data, media: mediaData || [] } as ServiceWithFreelancer;
  },

  async getByFreelancer(freelancerId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('created_by', freelancerId)
      .in('category', ['Service', 'Digital', 'Course'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Service[];
  },

  async create(service: Partial<Service>) {
    const { data, error } = await supabase.from('products').insert(service).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async search(term: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, freelancer:profiles!products_created_by_fkey(id, name, avatar_url)')
      .in('category', ['Service', 'Digital', 'Course'])
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ServiceWithFreelancer[];
  },
};

// ============ FREELANCERS (profiles with business type) ============
export const freelancerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('type', 'business')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getWithServices(id: string) {
    const [profile, services] = await Promise.all([
      this.getById(id),
      workService.getByFreelancer(id),
    ]);
    return { ...profile, services };
  },
};
