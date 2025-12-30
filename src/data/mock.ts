import { Product, Course, Task, Post } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Design System Kit',
    price: 129.0,
    category: 'Digital',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    name: 'Ergonomic Chair',
    price: 899.9,
    category: 'Furniture',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    price: 349.0,
    category: 'Tech',
    image: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: '4',
    name: 'Productivity Planner',
    price: 49.9,
    category: 'Stationery',
    image: 'https://picsum.photos/400/300?random=4',
  },
];

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'React Avançado & Patterns',
    progress: 75,
    instructor: 'Diego Fernandes',
    thumbnail: 'https://picsum.photos/400/220?random=5',
  },
  {
    id: '2',
    title: 'UX/UI Design Masterclass',
    progress: 30,
    instructor: 'Mayara Silva',
    thumbnail: 'https://picsum.photos/400/220?random=6',
  },
  {
    id: '3',
    title: 'Gestão Ágil de Produtos',
    progress: 0,
    instructor: 'Rodrigo Lemes',
    thumbnail: 'https://picsum.photos/400/220?random=7',
  },
];

export const TASKS: Task[] = [
  { id: '1', title: 'Revisar Q3 Financial Report', status: 'todo', priority: 'high' },
  { id: '2', title: 'Atualizar documentação da API', status: 'in-progress', priority: 'medium' },
  { id: '3', title: 'Meeting com Stakeholders', status: 'done', priority: 'high' },
  { id: '4', title: 'Comprar novos monitores', status: 'todo', priority: 'low' },
];

export const POSTS: Post[] = [
  {
    id: '1',
    author: 'Ana Costa',
    avatar: 'https://picsum.photos/50/50?random=8',
    content: 'Acabei de lançar o novo módulo da Tymes! Ficou incrível a integração com o Shop.',
    likes: 24,
    timeAgo: '2h',
    image: 'https://picsum.photos/600/300?random=9',
  },
  {
    id: '2',
    author: 'Carlos Rocha',
    avatar: 'https://picsum.photos/50/50?random=10',
    content: 'Alguém tem dicas de livros sobre Arquitetura Limpa?',
    likes: 12,
    timeAgo: '5h',
  },
];

export const STATS_DATA = [
  { name: 'Jan', vendas: 4000, usuarios: 2400 },
  { name: 'Fev', vendas: 3000, usuarios: 1398 },
  { name: 'Mar', vendas: 2000, usuarios: 9800 },
  { name: 'Abr', vendas: 2780, usuarios: 3908 },
  { name: 'Mai', vendas: 1890, usuarios: 4800 },
  { name: 'Jun', vendas: 2390, usuarios: 3800 },
];
