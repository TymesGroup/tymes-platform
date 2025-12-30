import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Play,
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { useCourse } from '../hooks/useClass';

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

export const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, onBack }) => {
  const { course, loading } = useCourse(courseId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'content' | 'reviews'>('about');

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
  const mockPrice = 199.9;
  const mockOriginalPrice = 299.9;
  const mockRating = 4.8;
  const mockStudents = 12500;
  const mockDuration = '42h';

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
          {/* Video/Image Preview */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative group cursor-pointer">
            <img
              src={course.thumbnail || defaultImage}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.src = defaultImage;
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Play size={32} className="text-purple-600 ml-1" fill="currentColor" />
              </div>
            </div>
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

          {/* Course Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-purple-500 uppercase font-bold tracking-wider bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                {course.category || 'Tecnologia'}
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                Bestseller
              </span>
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
                <span className="font-bold">{mockRating}</span>
                <span className="text-zinc-500 text-sm">
                  ({course.total_reviews || 256} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={18} />
                <span>{mockStudents.toLocaleString()} alunos</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Clock size={18} />
                <span>{mockDuration} de conteúdo</span>
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
              <div>
                <p className="text-sm text-zinc-500">Instrutor</p>
                <p className="font-bold text-lg">{course.instructor}</p>
              </div>
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
                <span>{mockDuration} de duração total</span>
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
                  <p className="text-4xl font-bold text-purple-600">{mockRating}</p>
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
                  <p className="text-sm text-zinc-500 mt-1">
                    {course.total_reviews || 256} avaliações
                  </p>
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
                <span className="text-3xl font-bold text-purple-600">
                  R$ {mockPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-lg text-zinc-400 line-through">
                  R$ {mockOriginalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">
                {Math.round((1 - mockPrice / mockOriginalPrice) * 100)}% de desconto
              </span>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25">
              Comprar Agora
            </button>

            <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
              Adicionar ao Carrinho
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Garantia de 7 dias ou seu dinheiro de volta
            </p>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
              <h4 className="font-medium">Este curso inclui:</h4>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {mockDuration} de vídeo sob demanda
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
