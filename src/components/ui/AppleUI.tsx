/**
 * Apple Design System Components
 * Componentes de UI inspirados no design system da Apple
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================
// TYPOGRAPHY
// ============================================

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <h1
    className={`text-[32px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] ${className}`}
  >
    {children}
  </h1>
);

export const SectionTitle: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <h2
    className={`text-[24px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] ${className}`}
  >
    {children}
  </h2>
);

export const CardTitle: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <h3 className={`text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] ${className}`}>
    {children}
  </h3>
);

export const Label: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <span className={`text-[12px] font-medium text-[#86868b] uppercase tracking-wide ${className}`}>
    {children}
  </span>
);

export const BodyText: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <p className={`text-[15px] text-[#86868b] leading-relaxed ${className}`}>{children}</p>
);

// ============================================
// BUTTONS
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-normal rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#0066cc] text-white hover:bg-[#0055b3]',
    secondary:
      'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2d]',
    ghost: 'text-[#0066cc] hover:underline',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[13px] gap-1.5',
    md: 'px-6 py-2.5 text-[15px] gap-2',
    lg: 'px-8 py-3 text-[17px] gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSizes[size]} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={iconSizes[size]} />}
    </button>
  );
};

// ============================================
// INPUTS
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
        )}
        <input
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <textarea
        className={`w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all resize-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <select
        className={`w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all appearance-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

// ============================================
// CARDS
// ============================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-[20px] bg-[#f5f5f7] dark:bg-[#1d1d1f] ${hover ? 'hover:scale-[1.02] cursor-pointer' : ''} transition-all ${className}`}
  >
    {children}
  </div>
);

export const CardWhite: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-[20px] bg-white dark:bg-[#2d2d2d] border border-[#d2d2d7] dark:border-[#424245] ${hover ? 'hover:scale-[1.02] cursor-pointer' : ''} transition-all ${className}`}
  >
    {children}
  </div>
);

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AppleSectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <PageTitle>{title}</PageTitle>
      {subtitle && <BodyText className="mt-1">{subtitle}</BodyText>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ============================================
// STATS CARD
// ============================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; positive: boolean };
  gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  gradient,
}) => (
  <Card className={gradient ? `bg-gradient-to-br ${gradient} text-white` : ''}>
    <div className="flex items-start justify-between">
      <div>
        <Label className={gradient ? 'text-white/70' : ''}>{label}</Label>
        <div
          className={`text-[32px] font-semibold tracking-tight mt-1 ${gradient ? 'text-white' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}
        >
          {value}
        </div>
        {trend && (
          <div className={`text-[13px] mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}
            {trend.value}%
          </div>
        )}
      </div>
      {Icon && (
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20' : 'bg-[#0066cc]/10'}`}
        >
          <Icon size={20} className={gradient ? 'text-white' : 'text-[#0066cc]'} />
        </div>
      )}
    </div>
  </Card>
);

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center mb-4">
      <Icon size={28} className="text-[#86868b]" />
    </div>
    <CardTitle className="mb-2">{title}</CardTitle>
    <BodyText className="max-w-sm mb-6">{description}</BodyText>
    {action && <Button onClick={action.onClick}>{action.label}</Button>}
  </div>
);

// ============================================
// BADGE
// ============================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7]',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// ============================================
// TOGGLE
// ============================================

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
      checked ? 'bg-[#0066cc]' : 'bg-[#d2d2d7] dark:bg-[#424245]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ============================================
// TABS
// ============================================

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex p-1 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-xl">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${
          activeTab === tab.id
            ? 'bg-white dark:bg-[#2d2d2d] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
            : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ============================================
// LIST ITEM
// ============================================

interface ListItemProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  action,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#1d1d1f] ${onClick ? 'cursor-pointer hover:bg-[#e8e8ed] dark:hover:bg-[#2d2d2d]' : ''} transition-all`}
  >
    {Icon && (
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#2d2d2d] flex items-center justify-center">
        <Icon size={20} className="text-[#0066cc]" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <CardTitle>{title}</CardTitle>
      {subtitle && <BodyText className="truncate">{subtitle}</BodyText>}
    </div>
    {action}
  </div>
);
