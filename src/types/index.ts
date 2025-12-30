import { LucideIcon } from 'lucide-react';

export enum ProfileType {
  SUPERADMIN = 'SUPERADMIN',
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  EXPLORE = 'EXPLORE',
  AI_AGENT = 'AI_AGENT',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
}

export interface NavItem {
  id: ModuleType;
  label: string;
  icon: LucideIcon;
  allowedProfiles: ProfileType[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Course {
  id: string;
  title: string;
  progress: number;
  instructor: string;
  thumbnail: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  timeAgo: string;
  image?: string;
}

export interface UserData {
  name: string;
  email: string;
  document: string; // CPF or CNPJ
  type: ProfileType;
}

// Sub-navigation IDs
export type PageType = 'OVERVIEW' | 'SETTINGS' | string;
