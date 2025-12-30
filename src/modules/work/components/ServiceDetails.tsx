import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Users,
  CheckCircle,
  Share2,
  MessageCircle,
  MapPin,
  Briefcase,
  Shield,
} from 'lucide-react';
import { useService } from '../hooks/useWork';

interface ServiceDetailsProps {
  serviceId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const MOCK_PACKAGES = [
  {
    id: 'basic',
    name: 'Básico',
    price: 150,
    delivery: '3 dias',
    revisions: 1,
    features: ['Entrega em formato digital', '1 revisão incluída'],
  },
  {
    id: 'standard',
    name: 'Padrão',
    price: 350,
    delivery: '5 dias',
    revisions: 3,
    features: ['Entrega em formato digital', '3 revisões incluídas', 'Arquivos fonte'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 750,
    delivery: '7 dias',
    revisions: 'Ilimitadas',
    features: [
      'Entrega em formato digital',
      'Revisões ilimitadas',
      'Arquivos fonte',
      'Suporte prioritário',
    ],
  },
];

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId, onBack }) => {
  const { service, loading } = useService(serviceId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('standard');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500">Serviço não encontrado</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800';
  const mockRating = 4.9;
  const mockReviews = 128;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
            <img
              src={service.image || defaultImage}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.src = defaultImage;
              }}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-zinc-600 hover:bg-white'}`}
              >
                <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
              </button>
              <button className="p-3 rounded-full bg-white/90 text-zinc-600 hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-indigo-500 uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                {service.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{service.name}</h1>

            {/* Freelancer Info */}
            {service.freelancer && (
              <div className="flex items-center gap-4 mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <img
                  src={
                    service.freelancer.avatar_url ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
                  }
                  alt={service.freelancer.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{service.freelancer.name}</p>
                    <CheckCircle size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>
                        {mockRating} ({mockReviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      <span>156 projetos</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-2">
                  <MessageCircle size={16} /> Contatar
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{mockRating}</span>
                <span className="text-zinc-500 text-sm">({mockReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={18} />
                <span>156 clientes atendidos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Clock size={18} />
                <span>Entrega em 3-7 dias</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-lg mb-3">Sobre este serviço</h3>
            <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
              {service.description ||
                'Serviço profissional de alta qualidade. Entre em contato para mais detalhes sobre o escopo e entregáveis.'}
            </p>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="font-bold text-lg mb-3">O que está incluído</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Entrega profissional',
                'Comunicação constante',
                'Revisões conforme pacote',
                'Arquivos fonte (pacotes superiores)',
                'Suporte pós-entrega',
                'Garantia de satisfação',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6">Avaliações ({mockReviews})</h2>
            <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">{mockRating}</p>
                <div className="flex items-center justify-center mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(mockRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-300'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-zinc-500 text-center py-8">
              Avaliações dos clientes aparecerão aqui.
            </p>
          </div>
        </div>

        {/* Sidebar - Packages */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Package Selection */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                {MOCK_PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${selectedPackage === pkg.id ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              {MOCK_PACKAGES.filter(p => p.id === selectedPackage).map(pkg => (
                <div key={pkg.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-indigo-600">R$ {pkg.price}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Entrega em {pkg.delivery}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">
                    Contratar (R$ {pkg.price})
                  </button>

                  <button className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> Enviar Mensagem
                  </button>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield size={20} className="text-emerald-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={20} className="text-emerald-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Garantia de satisfação</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle size={20} className="text-emerald-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
