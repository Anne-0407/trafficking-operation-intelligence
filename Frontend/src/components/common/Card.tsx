import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  highlight?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  action,
  footer,
  badge,
  highlight = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-[#0F172A]/90 border rounded-lg overflow-hidden transition-all duration-150',
        highlight
          ? 'border-sky-500 shadow-glow-accent'
          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm dark:shadow-panel',
        onClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-[#131D31]',
        className
      )}
    >
      {(title || action || badge) && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2">
              {title && typeof title === 'string' ? (
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-wide font-sans">{title}</h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div className="p-4">{children}</div>

      {footer && (
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-mono">
          {footer}
        </div>
      )}
    </div>
  );
};
