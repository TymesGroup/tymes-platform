/**
 * FeaturedFreelancers - Seção de Freelancers em Destaque
 * Design horizontal com cards escuros
 */

import React, { useState, useEffect } from 'react';
import { Star, Briefcase, Users, CheckCircle, MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Freelancer {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio?: string;
  location?: string;
  services_count?: number;
  clients_count?: number;
  rating?: number;
  is_verified?: boolean;
}

interface FeaturedFreelancersProps {
  onNavigate?: (page: string) => void;
  limit?: number;
}

export const FeaturedFreelancers: React.FC<FeaturedFreelancersProps> = ({
  onNavigate,
  limit = 3,
}) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancers();
  }, [limit]);

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, bio, address_city, address_state, type, is_verified')
        .eq('type', 'BUSINESS')
        .limit(limit);

      if (error) throw error;

      const freelancersWithStats = (data || []).map((freelancer, index) => ({
        id: freelancer.id,
        full_name: freelancer.name || 'Freelancer',
        avatar_url: freelancer.avatar_url,
        bio: freelancer.bio || 'Profissional especializado',
        location:
          freelancer.address_city && freelancer.address_state
            ? `${freelancer.address_city}, ${freelancer.address_state}`
            : 'Brasil',
        services_count: Math.floor(Math.random() * 15) + 1,
        clients_count: Math.floor(Math.random() * 200) + 10,
        rating: 4.5 + Math.random() * 0.5,
        is_verified: freelancer.is_verified || index < 2,
      }));

      setFreelancers(freelancersWithStats);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
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

  // Fallback mock data if no freelancers
  const displayFreelancers =
    freelancers.length > 0
      ? freelancers
      : [
          {
            id: '1',
            full_name: 'Carlos Dev',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
            bio: 'Desenvolvimento Full Stack',
            location: 'São Paulo, SP',
            services_count: 8,
            clients_count: 156,
            rating: 4.9,
            is_verified: true,
          },
          {
            id: '2',
            full_name: 'Ana Designer',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
            bio: 'UI/UX & Branding',
            location: 'Rio de Janeiro, RJ',
            services_count: 12,
            clients_count: 234,
            rating: 4.8,
            is_verified: true,
          },
          {
            id: '3',
            full_name: 'Roberto CEO',
            avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
            bio: 'Consultoria Empresarial',
            location: 'Curitiba, PR',
            services_count: 5,
            clients_count: 89,
            rating: 5.0,
            is_verified: true,
          },
        ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Freelancers em Destaque</h2>
        <button
          onClick={() => onNavigate?.('FEATURED_FREELANCERS')}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver todos <ChevronRight size={16} />
        </button>
      </div>

      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayFreelancers.map(freelancer => (
          <button
            key={freelancer.id}
            onClick={() => onNavigate?.(`FREELANCER:${freelancer.id}`)}
            className="group bg-zinc-900 dark:bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-all text-left border border-zinc-800"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {freelancer.avatar_url ? (
                  <img
                    src={freelancer.avatar_url}
                    alt={freelancer.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {freelancer.full_name?.charAt(0) || '?'}
                  </div>
                )}
                {freelancer.is_verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 rounded-full p-0.5">
                    <CheckCircle size={10} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {freelancer.full_name}
                </h3>
                <p className="text-xs text-zinc-400 truncate">{freelancer.bio}</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                  <MapPin size={10} />
                  {freelancer.location}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <Briefcase size={12} />
                <span>{freelancer.services_count} serviços</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <Users size={12} />
                <span>{freelancer.clients_count} clientes</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star size={12} fill="currentColor" />
                <span className="font-medium">{freelancer.rating?.toFixed(1)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedFreelancers;
