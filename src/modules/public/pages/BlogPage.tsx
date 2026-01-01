/**
 * BlogPage - Página do Blog da Tymes
 */

import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

const categories = ['Todos', 'Novidades', 'Tutoriais', 'Casos de Sucesso', 'Dicas', 'Tecnologia'];

const posts = [
  {
    id: 1,
    title: 'Como começar a vender na Tymes Shop',
    excerpt:
      'Guia completo para configurar sua loja e começar a vender seus produtos na plataforma.',
    category: 'Tutoriais',
    author: 'Equipe Tymes',
    date: '28 Dez 2024',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    featured: true,
  },
  {
    id: 2,
    title: 'Novos recursos do módulo Class',
    excerpt:
      'Conheça as últimas atualizações que tornam a experiência de aprendizado ainda melhor.',
    category: 'Novidades',
    author: 'Ana Silva',
    date: '25 Dez 2024',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
  },
  {
    id: 3,
    title: 'De freelancer a agência: a história da Marina',
    excerpt: 'Como uma designer usou a Tymes Work para escalar seu negócio e formar uma equipe.',
    category: 'Casos de Sucesso',
    author: 'Carlos Santos',
    date: '22 Dez 2024',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
  },
  {
    id: 4,
    title: '10 dicas para criar cursos que vendem',
    excerpt: 'Estratégias comprovadas para criar conteúdo educacional de alta qualidade.',
    category: 'Dicas',
    author: 'Equipe Tymes',
    date: '20 Dez 2024',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
  },
  {
    id: 5,
    title: 'Inteligência Artificial na Tymes',
    excerpt: 'Como estamos usando IA para melhorar a experiência dos usuários na plataforma.',
    category: 'Tecnologia',
    author: 'Ana Silva',
    date: '18 Dez 2024',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
  },
  {
    id: 6,
    title: 'Guia de SEO para vendedores',
    excerpt: 'Otimize seus produtos e serviços para aparecer nas buscas da plataforma.',
    category: 'Tutoriais',
    author: 'Carlos Santos',
    date: '15 Dez 2024',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600',
  },
];

export const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured);

  return (
    <PublicLayout title="Blog">
      <div className="space-y-12">
        {/* Search */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#424245] dark:text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && activeCategory === 'Todos' && !searchTerm && (
          <article className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">{featuredPost.title}</h2>
              <p className="text-white/80 mb-4 max-w-2xl">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <User size={14} /> {featuredPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {featuredPost.readTime}
                </span>
              </div>
            </div>
          </article>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts
            .filter(p => !p.featured || activeCategory !== 'Todos' || searchTerm)
            .map(post => (
              <article
                key={post.id}
                className="bg-white dark:bg-[#1d1d1f] rounded-2xl overflow-hidden border border-[#d2d2d7] dark:border-[#424245] group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-1 bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#424245] dark:text-[#86868b] text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#424245] dark:text-[#86868b] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#86868b]">
                    <span>{post.date}</span>
                    <span>{post.readTime} de leitura</span>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#86868b]">Nenhum artigo encontrado.</p>
          </div>
        )}

        {/* Newsletter */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
            Receba novidades
          </h2>
          <p className="text-[#424245] dark:text-[#86868b] mb-6">
            Inscreva-se para receber as últimas notícias e dicas diretamente no seu email.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 bg-white dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Inscrever <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </div>
    </PublicLayout>
  );
};

export default BlogPage;
