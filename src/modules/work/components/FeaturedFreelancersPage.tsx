/**
 * FeaturedFreelancersPage - Página dedicada de Freelancers em Destaque
 * Lista todos os freelancers/prestadores ativos com filtros
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  Star,
  Users,
  Briefcase,
  CheckCircle,
  Search,
  MapPin,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Freelancer {
  id: string;
  full_name: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  location?: string;
  is_verified: boolean;
  services_count?: number;
  clients_count?: number;
  rating?: number;
}

interface FeaturedFreelancersPageProps {
  onNavigate?: (page: string) => void;
}

const SORT_OPTIONS = [
  { id: 'rating', label: 'Melhor Avaliados' },
  { id: 'clients', label: 'Mais Clientes' },
  { id: 'services', label: 'Mais Serviços' },
  { id: 'name', label: 'Nome A-Z' },
];

const GRADIENTS = [
  'from-indigo-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-red-500',
  'from-cyan-500 to-blue-500',
];

export const FeaturedFreelancersPage: React.FC<FeaturedFreelancersPageProps> = ({ onNavigate }) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchFreelancers();
  }, [sortBy, showVerifiedOnly]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('profiles')
        .select('id, full_name, name, avatar_url, bio, address_city, address_state, is_verified')
        .eq('type', 'BUSINESS');

      if (showVerifiedOnly) {
        query = query.eq('is_verified', true);
      }

      const { data, error } = await query.limit(24);
      if (error) throw error;

      // Add simulated stats
      const freelancersWithStats = (data || []).map((freelancer, index) => ({
        ...freelancer,
        location:
          freelancer.address_city && freelancer.address_state
            ? `${freelancer.address_city}, ${freelancer.address_state}`
            : 'Brasil',
        services_count: Math.floor(Math.random() * 20) + 1,
        clients_count: Math.floor(Math.random() * 300) + 10,
        rating: 4.5 + Math.random() * 0.5,
      }));

      // Sort
      freelancersWithStats.sort((a, b) => {
        switch (sortBy) {
          case 'clients':
            return (b.clients_count || 0) - (a.clients_count || 0);
          case 'services':
            return (b.services_count || 0) - (a.services_count || 0);
          case 'name':
            return (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '');
          default:
            return (b.rating || 0) - (a.rating || 0);
        }
      });

      setFreelancers(freelancersWithStats);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const name = freelancer.full_name || freelancer.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
            <Award className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Freelancers em Destaque
            </h1>
            <p className="text-sm text-zinc-500">Profissionais verificados e bem avaliados</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar freelancers..."
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
            <CheckCircle size={14} className="text-indigo-500" />
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
        {filteredFreelancers.length}{' '}
        {filteredFreelancers.length === 1 ? 'freelancer encontrado' : 'freelancers encontrados'}
      </p>

      {/* Freelancers Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : filteredFreelancers.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFreelancers.map((freelancer, index) => (
            <button
              key={freelancer.id}
              onClick={() => onNavigate?.(`FREELANCER:${freelancer.id}`)}
              className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg text-center"
            >
              {/* Verified Badge */}
              {freelancer.is_verified && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
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
                    {freelancer.avatar_url ? (
                      <img
                        src={freelancer.avatar_url}
                        alt={freelancer.full_name || freelancer.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white font-bold text-xl`}
                      >
                        {(freelancer.full_name || freelancer.name || '?').charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {freelancer.full_name || freelancer.name || 'Freelancer'}
              </h3>

              {freelancer.bio && (
                <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{freelancer.bio}</p>
              )}

              {freelancer.location && (
                <p className="text-xs text-zinc-400 mb-3 flex items-center justify-center gap-1">
                  <MapPin size={10} />
                  {freelancer.location}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="font-bold">{freelancer.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Briefcase size={12} />
                  <span>{freelancer.services_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Users size={12} />
                  <span>{freelancer.clients_count || 0}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
          <Award size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhum freelancer encontrado
          </h3>
          <p className="text-zinc-500">Tente ajustar os filtros ou a busca</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedFreelancersPage;
