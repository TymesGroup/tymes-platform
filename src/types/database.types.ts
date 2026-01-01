export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      ai_conversations: {
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
          content: string;
          conversation_id: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          role: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          role: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'ai_conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_suggestions: {
        Row: {
          action_data: Json | null;
          created_at: string | null;
          description: string | null;
          expires_at: string | null;
          id: string;
          is_dismissed: boolean | null;
          priority: number | null;
          suggestion_type: string;
          title: string;
          user_id: string;
        };
        Insert: {
          action_data?: Json | null;
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          is_dismissed?: boolean | null;
          priority?: number | null;
          suggestion_type: string;
          title: string;
          user_id: string;
        };
        Update: {
          action_data?: Json | null;
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          is_dismissed?: boolean | null;
          priority?: number | null;
          suggestion_type?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_suggestions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cart_items: {
        Row: {
          created_at: string | null;
          id: string;
          product_id: string;
          quantity: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          product_id: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          product_id?: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      connections: {
        Row: {
          created_at: string | null;
          follower_id: string;
          following_id: string;
          id: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          follower_id: string;
          following_id: string;
          id?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          follower_id?: string;
          following_id?: string;
          id?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'connections_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'connections_following_id_fkey';
            columns: ['following_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          id: string;
          joined_at: string | null;
          last_read_at: string | null;
          role: string | null;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          id?: string;
          joined_at?: string | null;
          last_read_at?: string | null;
          role?: string | null;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          id?: string;
          joined_at?: string | null;
          last_read_at?: string | null;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversation_participants_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversation_participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      conversations: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          created_by: string | null;
          id: string;
          name: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          name?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          name?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'conversations_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      course_enrollments: {
        Row: {
          completed_at: string | null;
          course_id: string;
          enrolled_at: string | null;
          expires_at: string | null;
          id: string;
          order_id: string | null;
          status: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          course_id: string;
          enrolled_at?: string | null;
          expires_at?: string | null;
          id?: string;
          order_id?: string | null;
          status?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          course_id?: string;
          enrolled_at?: string | null;
          expires_at?: string | null;
          id?: string;
          order_id?: string | null;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'course_enrollments_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'course_enrollments_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'unified_orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'course_enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      course_progress: {
        Row: {
          course_id: string | null;
          id: string;
          progress: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          course_id?: string | null;
          id?: string;
          progress?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          course_id?: string | null;
          id?: string;
          progress?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'course_progress_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'course_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          category: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          duration: string | null;
          id: string;
          instructor: string;
          is_bestseller: boolean | null;
          language: string | null;
          level: string | null;
          original_price: number | null;
          price: number | null;
          rating: number | null;
          status: string | null;
          students_count: number | null;
          thumbnail: string | null;
          title: string;
          total_reviews: number | null;
          updated_at: string | null;
          video_url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          duration?: string | null;
          id?: string;
          instructor: string;
          is_bestseller?: boolean | null;
          language?: string | null;
          level?: string | null;
          original_price?: number | null;
          price?: number | null;
          rating?: number | null;
          status?: string | null;
          students_count?: number | null;
          thumbnail?: string | null;
          title: string;
          total_reviews?: number | null;
          updated_at?: string | null;
          video_url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          duration?: string | null;
          id?: string;
          instructor?: string;
          is_bestseller?: boolean | null;
          language?: string | null;
          level?: string | null;
          original_price?: number | null;
          price?: number | null;
          rating?: number | null;
          status?: string | null;
          students_count?: number | null;
          thumbnail?: string | null;
          title?: string;
          total_reviews?: number | null;
          updated_at?: string | null;
          video_url?: string | null;
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
      favorites: {
        Row: {
          created_at: string | null;
          id: string;
          item_id: string;
          item_type: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          item_id: string;
          item_type?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          item_id?: string;
          item_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          content: string | null;
          conversation_id: string;
          created_at: string | null;
          id: string;
          is_deleted: boolean | null;
          is_edited: boolean | null;
          media_url: string | null;
          message_type: string | null;
          reply_to_id: string | null;
          sender_id: string;
          updated_at: string | null;
        };
        Insert: {
          content?: string | null;
          conversation_id: string;
          created_at?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          is_edited?: boolean | null;
          media_url?: string | null;
          message_type?: string | null;
          reply_to_id?: string | null;
          sender_id: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string | null;
          conversation_id?: string;
          created_at?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          is_edited?: boolean | null;
          media_url?: string | null;
          message_type?: string | null;
          reply_to_id?: string | null;
          sender_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_reply_to_id_fkey';
            columns: ['reply_to_id'];
            isOneToOne: false;
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: string;
          is_read: boolean | null;
          message: string | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          message?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          message?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          notes: string | null;
          payment_method: string | null;
          shipping_address: Json | null;
          status: string | null;
          store_id: string | null;
          total_amount: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          payment_method?: string | null;
          shipping_address?: Json | null;
          status?: string | null;
          store_id?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          payment_method?: string | null;
          shipping_address?: Json | null;
          status?: string | null;
          store_id?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_store_id_fkey';
            columns: ['store_id'];
            isOneToOne: false;
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      plans: {
        Row: {
          billing_cycle: string;
          created_at: string | null;
          description: string | null;
          features: Json | null;
          id: string;
          is_highlighted: boolean | null;
          max_storage_gb: number | null;
          modules_included: string[] | null;
          name: string;
          price: number;
          slug: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          billing_cycle?: string;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: string;
          is_highlighted?: boolean | null;
          max_storage_gb?: number | null;
          modules_included?: string[] | null;
          name: string;
          price?: number;
          slug: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          billing_cycle?: string;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: string;
          is_highlighted?: boolean | null;
          max_storage_gb?: number | null;
          modules_included?: string[] | null;
          name?: string;
          price?: number;
          slug?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      platform_modules: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          slug: string;
          sort_order: number | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      post_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string | null;
          id: string;
          parent_comment_id: string | null;
          post_id: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string | null;
          id?: string;
          parent_comment_id?: string | null;
          post_id: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          parent_comment_id?: string | null;
          post_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'post_comments_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_comments_parent_comment_id_fkey';
            columns: ['parent_comment_id'];
            isOneToOne: false;
            referencedRelation: 'post_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_likes: {
        Row: {
          created_at: string | null;
          id: string;
          post_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'post_likes_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      post_mentions: {
        Row: {
          created_at: string | null;
          id: string;
          mentioned_user_id: string;
          mentioner_id: string;
          post_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          mentioned_user_id: string;
          mentioner_id: string;
          post_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          mentioned_user_id?: string;
          mentioner_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_mentions_mentioned_user_id_fkey';
            columns: ['mentioned_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_mentions_mentioner_id_fkey';
            columns: ['mentioner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_mentions_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_shares: {
        Row: {
          created_at: string | null;
          id: string;
          post_id: string;
          share_type: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          post_id: string;
          share_type?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          post_id?: string;
          share_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_shares_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_shares_user_id_fkey';
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
          content: string;
          created_at: string | null;
          id: string;
          image: string | null;
          location: string | null;
          media_type: string | null;
          video_url: string | null;
          visibility: string | null;
        };
        Insert: {
          author_id?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          image?: string | null;
          location?: string | null;
          media_type?: string | null;
          video_url?: string | null;
          visibility?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          image?: string | null;
          location?: string | null;
          media_type?: string | null;
          video_url?: string | null;
          visibility?: string | null;
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
      product_media: {
        Row: {
          alt_text: string | null;
          created_at: string | null;
          id: string;
          is_primary: boolean | null;
          position: number | null;
          product_id: string;
          type: string;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          position?: number | null;
          product_id: string;
          type: string;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          position?: number | null;
          product_id?: string;
          type?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_media_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      product_questions: {
        Row: {
          answer: string | null;
          answered_at: string | null;
          answered_by: string | null;
          created_at: string | null;
          id: string;
          is_public: boolean | null;
          product_id: string;
          question: string;
          user_id: string;
        };
        Insert: {
          answer?: string | null;
          answered_at?: string | null;
          answered_by?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          product_id: string;
          question: string;
          user_id: string;
        };
        Update: {
          answer?: string | null;
          answered_at?: string | null;
          answered_by?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          product_id?: string;
          question?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_questions_answered_by_fkey';
            columns: ['answered_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_questions_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_questions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      product_reviews: {
        Row: {
          comment: string | null;
          created_at: string | null;
          helpful_count: number | null;
          id: string;
          images: string[] | null;
          order_id: string | null;
          product_id: string;
          rating: number;
          updated_at: string | null;
          user_id: string;
          verified_purchase: boolean | null;
        };
        Insert: {
          comment?: string | null;
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          images?: string[] | null;
          order_id?: string | null;
          product_id: string;
          rating: number;
          updated_at?: string | null;
          user_id: string;
          verified_purchase?: boolean | null;
        };
        Update: {
          comment?: string | null;
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          images?: string[] | null;
          order_id?: string | null;
          product_id?: string;
          rating?: number;
          updated_at?: string | null;
          user_id?: string;
          verified_purchase?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_reviews_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_reviews_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_reviews_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      product_specifications: {
        Row: {
          created_at: string | null;
          group_name: string | null;
          id: string;
          name: string;
          position: number | null;
          product_id: string;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          group_name?: string | null;
          id?: string;
          name: string;
          position?: number | null;
          product_id: string;
          value: string;
        };
        Update: {
          created_at?: string | null;
          group_name?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
          product_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_specifications_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      product_variations: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string | null;
          is_available: boolean | null;
          name: string;
          price_modifier: number | null;
          product_id: string;
          sku: string | null;
          stock: number | null;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          name: string;
          price_modifier?: number | null;
          product_id: string;
          sku?: string | null;
          stock?: number | null;
          value: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          name?: string;
          price_modifier?: number | null;
          product_id?: string;
          sku?: string | null;
          stock?: number | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variations_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          brand: string | null;
          category: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          dimensions: Json | null;
          id: string;
          image: string | null;
          is_featured: boolean | null;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          price: number;
          rating: number | null;
          sales_count: number | null;
          sku: string | null;
          status: string | null;
          stock: number | null;
          store_id: string | null;
          tags: string[] | null;
          total_reviews: number | null;
          updated_at: string | null;
          views_count: number | null;
          warranty_months: number | null;
          weight: number | null;
        };
        Insert: {
          brand?: string | null;
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          dimensions?: Json | null;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          price: number;
          rating?: number | null;
          sales_count?: number | null;
          sku?: string | null;
          status?: string | null;
          stock?: number | null;
          store_id?: string | null;
          tags?: string[] | null;
          total_reviews?: number | null;
          updated_at?: string | null;
          views_count?: number | null;
          warranty_months?: number | null;
          weight?: number | null;
        };
        Update: {
          brand?: string | null;
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          dimensions?: Json | null;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          price?: number;
          rating?: number | null;
          sales_count?: number | null;
          sku?: string | null;
          status?: string | null;
          stock?: number | null;
          store_id?: string | null;
          tags?: string[] | null;
          total_reviews?: number | null;
          updated_at?: string | null;
          views_count?: number | null;
          warranty_months?: number | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_store_id_fkey';
            columns: ['store_id'];
            isOneToOne: false;
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          address_city: string | null;
          address_complement: string | null;
          address_country: string | null;
          address_neighborhood: string | null;
          address_number: string | null;
          address_state: string | null;
          address_street: string | null;
          address_zip_code: string | null;
          age_group: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          created_at: string | null;
          document: string | null;
          email: string;
          enabled_modules: string[] | null;
          id: string;
          last_login_at: string | null;
          name: string;
          phone: string | null;
          plan_id: string | null;
          status: string | null;
          type: Database['public']['Enums']['profile_type'];
          updated_at: string | null;
        };
        Insert: {
          address_city?: string | null;
          address_complement?: string | null;
          address_country?: string | null;
          address_neighborhood?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip_code?: string | null;
          age_group?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string | null;
          document?: string | null;
          email: string;
          enabled_modules?: string[] | null;
          id: string;
          last_login_at?: string | null;
          name: string;
          phone?: string | null;
          plan_id?: string | null;
          status?: string | null;
          type?: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
        };
        Update: {
          address_city?: string | null;
          address_complement?: string | null;
          address_country?: string | null;
          address_neighborhood?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip_code?: string | null;
          age_group?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string | null;
          document?: string | null;
          email?: string;
          enabled_modules?: string[] | null;
          id?: string;
          last_login_at?: string | null;
          name?: string;
          phone?: string | null;
          plan_id?: string | null;
          status?: string | null;
          type?: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'plans';
            referencedColumns: ['id'];
          },
        ];
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
      review_helpful_votes: {
        Row: {
          created_at: string | null;
          id: string;
          review_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          review_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          review_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_helpful_votes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'product_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_helpful_votes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      search_history: {
        Row: {
          clicked: boolean | null;
          created_at: string | null;
          id: string;
          module: string | null;
          query: string;
          result_id: string | null;
          result_title: string | null;
          result_type: string | null;
          results_count: number | null;
          user_id: string;
        };
        Insert: {
          clicked?: boolean | null;
          created_at?: string | null;
          id?: string;
          module?: string | null;
          query: string;
          result_id?: string | null;
          result_title?: string | null;
          result_type?: string | null;
          results_count?: number | null;
          user_id: string;
        };
        Update: {
          clicked?: boolean | null;
          created_at?: string | null;
          id?: string;
          module?: string | null;
          query?: string;
          result_id?: string | null;
          result_title?: string | null;
          result_type?: string | null;
          results_count?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'search_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      service_contracts: {
        Row: {
          created_at: string | null;
          delivery_date: string | null;
          freelancer_id: string;
          id: string;
          order_id: string | null;
          requirements: string | null;
          service_id: string;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          delivery_date?: string | null;
          freelancer_id: string;
          id?: string;
          order_id?: string | null;
          requirements?: string | null;
          service_id: string;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          delivery_date?: string | null;
          freelancer_id?: string;
          id?: string;
          order_id?: string | null;
          requirements?: string | null;
          service_id?: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'service_contracts_freelancer_id_fkey';
            columns: ['freelancer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_contracts_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'unified_orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_contracts_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_contracts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      stores: {
        Row: {
          banner_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          owner_id: string;
          rating: number | null;
          slug: string;
          status: string | null;
          total_sales: number | null;
          updated_at: string | null;
        };
        Insert: {
          banner_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          owner_id: string;
          rating?: number | null;
          slug: string;
          status?: string | null;
          total_sales?: number | null;
          updated_at?: string | null;
        };
        Update: {
          banner_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          owner_id?: string;
          rating?: number | null;
          slug?: string;
          status?: string | null;
          total_sales?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stores_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      system_settings: {
        Row: {
          category: string;
          description: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          category?: string;
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          category?: string;
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'system_settings_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          created_at: string | null;
          id: string;
          priority: string;
          project_id: string | null;
          status: string;
          title: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title?: string;
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
      unified_cart_items: {
        Row: {
          created_at: string | null;
          id: string;
          item_id: string;
          item_type: string;
          quantity: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          item_id: string;
          item_type: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          item_id?: string;
          item_type?: string;
          quantity?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'unified_cart_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      unified_order_items: {
        Row: {
          created_at: string | null;
          id: string;
          item_id: string;
          item_image: string | null;
          item_name: string;
          item_type: string;
          order_id: string;
          quantity: number | null;
          seller_id: string | null;
          unit_price: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          item_id: string;
          item_image?: string | null;
          item_name: string;
          item_type: string;
          order_id: string;
          quantity?: number | null;
          seller_id?: string | null;
          unit_price: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          item_id?: string;
          item_image?: string | null;
          item_name?: string;
          item_type?: string;
          order_id?: string;
          quantity?: number | null;
          seller_id?: string | null;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'unified_order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'unified_orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unified_order_items_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      unified_orders: {
        Row: {
          created_at: string | null;
          id: string;
          notes: string | null;
          payment_id: string | null;
          payment_method: string | null;
          status: string | null;
          total_amount: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          status?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          status?: string | null;
          total_amount?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'unified_orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_activity_log: {
        Row: {
          activity_type: string;
          created_at: string | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          metadata: Json | null;
          user_id: string;
        };
        Insert: {
          activity_type: string;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          metadata?: Json | null;
          user_id: string;
        };
        Update: {
          activity_type?: string;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          metadata?: Json | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_activity_log_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_addresses: {
        Row: {
          city: string;
          complement: string | null;
          country: string | null;
          created_at: string | null;
          id: string;
          is_default: boolean | null;
          label: string;
          neighborhood: string;
          number: string;
          state: string;
          street: string;
          updated_at: string | null;
          user_id: string;
          zip_code: string;
        };
        Insert: {
          city: string;
          complement?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          is_default?: boolean | null;
          label?: string;
          neighborhood: string;
          number: string;
          state: string;
          street: string;
          updated_at?: string | null;
          user_id: string;
          zip_code: string;
        };
        Update: {
          city?: string;
          complement?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          is_default?: boolean | null;
          label?: string;
          neighborhood?: string;
          number?: string;
          state?: string;
          street?: string;
          updated_at?: string | null;
          user_id?: string;
          zip_code?: string;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          cancelled_at: string | null;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          plan_id: string;
          started_at: string | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cancelled_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          plan_id: string;
          started_at?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cancelled_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          plan_id?: string;
          started_at?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_subscriptions_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey';
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
      calculate_age_group: { Args: { birth_date: string }; Returns: string };
      create_profile: {
        Args: {
          user_document: string;
          user_email: string;
          user_id: string;
          user_name: string;
          user_type: Database['public']['Enums']['profile_type'];
        };
        Returns: {
          address_city: string | null;
          address_complement: string | null;
          address_country: string | null;
          address_neighborhood: string | null;
          address_number: string | null;
          address_state: string | null;
          address_street: string | null;
          address_zip_code: string | null;
          age_group: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          created_at: string | null;
          document: string | null;
          email: string;
          enabled_modules: string[] | null;
          id: string;
          last_login_at: string | null;
          name: string;
          phone: string | null;
          plan_id: string | null;
          status: string | null;
          type: Database['public']['Enums']['profile_type'];
          updated_at: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      increment_product_views: {
        Args: { p_product_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      profile_type: 'SUPERADMIN' | 'PERSONAL' | 'BUSINESS';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      profile_type: ['SUPERADMIN', 'PERSONAL', 'BUSINESS'],
    },
  },
} as const;
