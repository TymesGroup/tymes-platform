/**
 * CourseDetails - Página de detalhes do curso com fluxo de compra
 * Design minimalista estilo Apple
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Play,
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Share2,
  ShoppingBag,
  Zap,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { useCourse, CourseMedia } from '../hooks/useClass';
import { useUnifiedBag } from '../../../lib/UnifiedBagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const MOCK_MODULES = [
  { id: '1', title: 'Introdução ao Curso', lessons: 5, duration: '45min', completed: true },
  { id: '2', title: 'Fundamentos Básicos', lessons: 8, duration: '1h 30min', completed: true },
  {
    id: '3',
    title: 'Conceitos Intermediários',
    lessons: 10,
    duration: '2h 15min',
    completed: false,
  },
  { id: '4', title: 'Práticas Avançadas', lessons: 12, duration: '3h', completed: false },
  { id: '5', title: 'Projeto Final', lessons: 3, duration: '1h', completed: false },
];

export const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, onBack, onNavigate }) => {
  const { user, profile } = useAuth();
  const { course, loading } = useCourse(courseId);
  const { addItem, isInBag } = useUnifiedBag();
  const { isFavorited, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'about' | 'content' | 'reviews'>('about');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const inBag = isInBag('course', courseId);
  const isFavorite = isFavorited(courseId, 'course');
  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  // Build media array from course data
  const media: CourseMedia[] =
    course?.media && course.media.length > 0
      ? course.media
      : course?.thumbnail
        ? [
            {
              id: '1',
              url: course.thumbnail,
              type: 'image' as const,
              position: 0,
              is_primary: true,
            },
          ]
        : [];

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedMediaIndex(i => (i === 0 ? media.length - 1 : i - 1));
    } else {
      setSelectedMediaIndex(i => (i === media.length - 1 ? 0 : i + 1));
    }
    setVideoPlaying(false);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Faça login para favoritar');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(courseId, 'course');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const [addedToCart, setAddedToCart] = useState(false);

  // Adicionar à Bolsa - NÃO redireciona, apenas adiciona
  const handleAddToCart = async () => {
    if (!user) {
      alert('Faça login para adicionar à bolsa');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem('course', courseId);
      setAddedToCart(true);
      // Feedback visual temporário
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao adicionar à bolsa');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('Faça login para comprar');
      return;
    }

    setIsBuying(true);
    try {
      if (!inBag) {
        await addItem('course', courseId);
      }
      // Navigate to checkout
      navigate(`/${accountType}/checkout`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao processar compra');
    } finally {
      setIsBuying(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500">Curso não encontrado</p>
        <button onClick={onBack} className="mt-4 text-purple-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
  const price = course.price || 199.9;
  const originalPrice = course.original_price || 299.9;
  const rating = course.rating || 4.8;
  const studentsCount = course.students_count || 12500;
  const duration = course.duration || '42h';
  const totalReviews = course.total_reviews || 256;
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;
  const currentMedia = media[selectedMediaIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video/Image Preview with Gallery */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative group">
            {currentMedia?.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  controls={videoPlaying}
                  autoPlay={videoPlaying}
                  onClick={() => setVideoPlaying(!videoPlaying)}
                />
                {!videoPlaying && (
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play size={32} className="text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <>
                <img
                  src={currentMedia?.url || course.thumbnail || defaultImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play size={32} className="text-purple-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </>
            )}

            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                disabled={isTogglingFavorite}
                className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-zinc-600 hover:bg-white'} disabled:opacity-50`}
              >
                <Bookmark size={20} className={isFavorite ? 'fill-white' : ''} />
              </button>
              <button className="p-3 rounded-full bg-white/90 text-zinc-600 hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
            {course.is_bestseller && (
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Bestseller
              </div>
            )}

            {/* Media Counter */}
            {media.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                {selectedMediaIndex + 1} / {media.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {media.map((m, index) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMediaIndex(index);
                    setVideoPlaying(false);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedMediaIndex
                      ? 'border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-transparent hover:border-zinc-300'
                  }`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                      <Play size={20} className="text-zinc-500" />
                    </div>
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Course Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-purple-500 uppercase font-bold tracking-wider bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                {course.category || 'Tecnologia'}
              </span>
              {course.level && (
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-full">
                  {course.level}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{course.title}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {course.description ||
                'Aprenda do zero ao avançado com projetos práticos e certificado de conclusão.'}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{rating}</span>
                <span className="text-zinc-500 text-sm">({totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={18} />
                <span>{studentsCount.toLocaleString()} alunos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Clock size={18} />
                <span>{duration} de conteúdo</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4 mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <img
                src={
                  course.instructor_profile?.avatar_url ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
                }
                alt={course.instructor}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-zinc-500">Instrutor</p>
                <p className="font-bold text-lg">{course.instructor}</p>
              </div>
              <button
                onClick={() => onNavigate?.(`INSTRUCTOR:${course.created_by}`)}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm"
              >
                Ver Perfil
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-6">
              {(['about', 'content', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-medium transition-colors ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  {tab === 'about' ? 'Sobre' : tab === 'content' ? 'Conteúdo' : 'Avaliações'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">O que você vai aprender</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Fundamentos sólidos da tecnologia',
                    'Boas práticas do mercado',
                    'Projetos práticos reais',
                    'Preparação para o mercado de trabalho',
                    'Certificado de conclusão',
                    'Suporte da comunidade',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Requisitos</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>Conhecimento básico de computação</li>
                  <li>Vontade de aprender</li>
                  <li>Computador com acesso à internet</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
                <span>{MOCK_MODULES.length} módulos • 38 aulas</span>
                <span>{duration} de duração total</span>
              </div>
              {MOCK_MODULES.map((module, idx) => (
                <div
                  key={module.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${module.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                      >
                        {module.completed ? <CheckCircle size={18} /> : idx + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-zinc-500">
                          {module.lessons} aulas • {module.duration}
                        </p>
                      </div>
                    </div>
                    <Play size={18} className="text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">{rating}</p>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= Math.round(rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">{totalReviews} avaliações</p>
                </div>
              </div>
              <p className="text-zinc-500 text-center py-8">
                Avaliações dos alunos aparecerão aqui.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-purple-600">{formatPrice(price)}</span>
                {discount > 0 && (
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-sm text-emerald-600 font-medium">
                  {discount}% de desconto
                </span>
              )}
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isBuying ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Zap size={18} />
                  Comprar Agora
                </>
              )}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || inBag}
              className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                addedToCart || inBag
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                  : 'border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
              ) : addedToCart ? (
                <>
                  <CheckCircle size={18} />
                  Adicionado!
                </>
              ) : inBag ? (
                <>
                  <CheckCircle size={18} />
                  Na Bolsa
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Adicionar à Bolsa
                </>
              )}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Garantia de 7 dias ou seu dinheiro de volta
            </p>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
              <h4 className="font-medium">Este curso inclui:</h4>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {duration} de vídeo sob demanda
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} /> 38 aulas
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} /> Certificado de conclusão
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} /> Acesso vitalício
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
