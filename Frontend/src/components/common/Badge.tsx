import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'outline' | 'warning' | 'danger' | 'success' | 'info' | 'purple' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className,
  dot = false,
}) => {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    warning: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/60',
    danger: 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800/60',
    success: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60',
    info: 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800/60',
    purple: 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800/60',
    amber: 'bg-amber-100/90 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700/50',
  };

  const dotStyles = {
    default: 'bg-slate-500 dark:bg-slate-400',
    outline: 'bg-slate-500 dark:bg-slate-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    info: 'bg-sky-500 dark:bg-sky-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono uppercase transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  );
};
