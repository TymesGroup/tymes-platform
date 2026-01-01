/**
 * FreelancerPage - Página pública do freelancer
 * Mostra informações do freelancer e seus serviços
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
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Shield,
  ThumbsUp,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface FreelancerPageProps {
  freelancerId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface FreelancerInfo {
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
  skills?: string[];
}

interface Service {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating?: number;
  total_reviews?: number;
  category: string;
  delivery_time?: string;
  orders_count?: number;
}

export const FreelancerPage: React.FC<FreelancerPageProps> = ({
  freelancerId,
  onBack,
  onNavigate,
}) => {
  const { profile } = useAuth();
  const [freelancer, setFreelancer] = useState<FreelancerInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  useEffect(() => {
    loadFreelancerData();
  }, [freelancerId]);

  const loadFreelancerData = async () => {
    setLoading(true);
    try {
      // Fetch freelancer profile
      const { data: freelancerData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', freelancerId)
        .single();

      if (error) throw error;
      setFreelancer(freelancerData);

      // Fetch freelancer services (products with type = 'service')
      const { data: servicesData } = await supabase
        .from('products')
        .select('id, name, price, image, rating, total_reviews, category')
        .eq('created_by', freelancerId)
        .eq('type', 'service')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Get unique categories
  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices =
    activeCategory === 'all' ? services : services.filter(s => s.category === activeCategory);

  const totalOrders = services.reduce((sum, s) => sum + (s.orders_count || 0), 0);
  const avgRating =
    services.length > 0
      ? services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length
      : 0;
  const totalReviews = services.reduce((sum, s) => sum + (s.total_reviews || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="text-center py-16">
        <Briefcase className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 text-lg">Freelancer não encontrado</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  // Mock skills if not available
  const skills = freelancer.skills || ['Design', 'Desenvolvimento', 'Marketing', 'Consultoria'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      {/* Freelancer Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Banner */}
        <div className="h-48 md:h-56 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200')] bg-cover bg-center opacity-20" />
        </div>

        {/* Freelancer Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            {freelancer.avatar_url ? (
              <img
                src={freelancer.avatar_url}
                alt={freelancer.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
                <Briefcase size={48} className="text-white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <MessageCircle size={18} /> Contatar
            </button>
          </div>

          {/* Info */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{freelancer.name}</h1>
              <CheckCircle size={24} className="text-indigo-600" />
              {freelancer.type === 'BUSINESS' && (
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Building2 size={12} /> Freelancer PRO
                </span>
              )}
            </div>

            <p className="text-zinc-500">Freelancer</p>

            {freelancer.bio && (
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl">{freelancer.bio}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">({totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Briefcase size={18} />
                <span>{totalOrders || 150}+ projetos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <ThumbsUp size={18} />
                <span>{services.length} serviços</span>
              </div>
              {freelancer.address_city && (
                <div className="flex items-center gap-1 text-zinc-500">
                  <MapPin size={18} />
                  <span>
                    {freelancer.address_city}, {freelancer.address_state}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar size={18} />
                <span>Desde {formatDate(freelancer.created_at)}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {freelancer.website && (
                <a
                  href={freelancer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Globe size={18} />
                </a>
              )}
              {freelancer.linkedin && (
                <a
                  href={freelancer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {freelancer.twitter && (
                <a
                  href={freelancer.twitter}
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

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Shield size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-sm">Verificado</p>
            <p className="text-xs text-zinc-500">Identidade confirmada</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Award size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-sm">Top Rated</p>
            <p className="text-xs text-zinc-500">Avaliação excelente</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm">Resposta Rápida</p>
            <p className="text-xs text-zinc-500">Média de 2h</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <ThumbsUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-sm">98% Satisfação</p>
            <p className="text-xs text-zinc-500">Clientes satisfeitos</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? 'Todos os Serviços' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(service => (
              <button
                key={service.id}
                onClick={() => onNavigate?.(`SERVICE:${service.id}`)}
                className="group text-left bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      service.image ||
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {service.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                    {service.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{service.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <span>{service.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-indigo-600 font-bold">
                      A partir de {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500">Nenhum serviço encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerPage;
