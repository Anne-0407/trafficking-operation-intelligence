import React from 'react';
import { cn } from '../../lib/utils';
import { FileText, Image, Hash, Clock, Fingerprint, Network } from 'lucide-react';

export interface SignalPillProps {
  type: 'text' | 'visual' | 'identifier' | 'temporal' | 'behavior' | 'graph';
  score: number;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const SignalPill: React.FC<SignalPillProps> = ({
  type,
  score,
  label,
  size = 'md',
  className,
}) => {
  const iconMap = {
    text: FileText,
    visual: Image,
    identifier: Hash,
    temporal: Clock,
    behavior: Fingerprint,
    graph: Network,
  };

  const defaultLabelMap = {
    text: 'Text Sim',
    visual: 'Visual pHash',
    identifier: 'Identifier Link',
    temporal: 'Temporal Cadence',
    behavior: 'Behavioral Pattern',
    graph: 'Graph Context',
  };

  const Icon = iconMap[type] || Network;
  const displayLabel = label || defaultLabelMap[type];
  const pct = Math.round(score * 100);

  const getScoreColor = (val: number) => {
    if (val >= 0.85) return 'text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/50';
    if (val >= 0.70) return 'text-sky-800 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800/50';
    if (val >= 0.50) return 'text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/50';
    return 'text-rose-800 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/50';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded border font-mono transition-colors shadow-sm',
        getScoreColor(score),
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 opacity-80'} />
      <span className="text-slate-700 dark:text-slate-300 font-sans font-medium">{displayLabel}</span>
      <span className="font-bold">{pct}%</span>
    </div>
  );
};
