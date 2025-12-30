export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      ai_chats: {
        Row: {
          created_at: string | null;
          id: string;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_chats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_messages: {
        Row: {
          chat_id: string;
          content: string;
          created_at: string | null;
          id: string;
          role: string;
        };
        Insert: {
          chat_id: string;
          content: string;
          created_at?: string | null;
          id?: string;
          role: string;
        };
        Update: {
          chat_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_messages_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'ai_chats';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          id: string;
          price: number | null;
          thumbnail: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          price?: number | null;
          thumbnail?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          price?: number | null;
          thumbnail?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'courses_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      course_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string | null;
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity?: number;
          unit_price: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          id: string;
          status: string | null;
          total_amount: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          status?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          status?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string | null;
          content: string | null;
          created_at: string | null;
          id: string;
          image: string | null;
        };
        Insert: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          image?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          image?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      post_likes: {
        Row: {
          id: string;
        };
        Insert: {
          id?: string;
        };
        Update: {
          id?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string | null;
          created_at: string | null;
          created_by: string | null;
          id: string;
          image: string | null;
          name: string | null;
          price: number | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          price?: number | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          document: string | null;
          email: string | null;
          id: string;
          name: string | null;
          phone: string | null;
          type: Database['public']['Enums']['profile_type'];
          updated_at: string | null;
          birth_date: string | null;
          age_group: 'baby' | 'child' | 'teen' | 'adult' | 'senior' | null;
          address_street: string | null;
          address_number: string | null;
          address_complement: string | null;
          address_neighborhood: string | null;
          address_city: string | null;
          address_state: string | null;
          address_zip_code: string | null;
          address_country: string | null;
          enabled_modules: string[] | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          document?: string | null;
          email?: string | null;
          id: string;
          name?: string | null;
          phone?: string | null;
          type?: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
          birth_date?: string | null;
          age_group?: 'baby' | 'child' | 'teen' | 'adult' | 'senior' | null;
          address_street?: string | null;
          address_number?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_zip_code?: string | null;
          address_country?: string | null;
          enabled_modules?: string[] | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          document?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          phone?: string | null;
          type?: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
          birth_date?: string | null;
          age_group?: 'baby' | 'child' | 'teen' | 'adult' | 'senior' | null;
          address_street?: string | null;
          address_number?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_zip_code?: string | null;
          address_country?: string | null;
          enabled_modules?: string[] | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          owner_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          owner_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          priority: string | null;
          project_id: string | null;
          status: string;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          priority?: string | null;
          project_id?: string | null;
          status: string;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          priority?: string | null;
          project_id?: string | null;
          status?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      profile_type: 'SUPERADMIN' | 'PERSONAL' | 'BUSINESS';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
