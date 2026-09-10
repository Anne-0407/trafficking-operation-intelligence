import React from 'react';
import { cn } from '../../lib/utils';

export interface ScoreMeterProps {
  score: number; // 0.00 to 1.00
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercent?: boolean;
  className?: string;
  uncertaintyBand?: [number, number];
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  label,
  size = 'md',
  showPercent = true,
  className,
  uncertaintyBand,
}) => {
  const percent = Math.round(score * 100);

  const getColor = (val: number) => {
    if (val >= 0.85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500';
    if (val >= 0.70) return 'text-sky-600 dark:text-sky-400 bg-sky-500';
    if (val >= 0.50) return 'text-amber-600 dark:text-amber-400 bg-amber-500';
    return 'text-rose-600 dark:text-rose-400 bg-rose-500';
  };

  const colorCls = getColor(score);

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1 text-xs font-mono">
          {label && <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>}
          <div className="flex items-center gap-1.5">
            {showPercent && (
              <span className={cn('font-bold', colorCls.split(' ')[0])}>
                {percent}%
              </span>
            )}
            {uncertaintyBand && (
              <span className="text-[10px] text-slate-500 dark:text-slate-500">
                [{(uncertaintyBand[0] * 100).toFixed(0)}%-{(uncertaintyBand[1] * 100).toFixed(0)}%]
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar with optional uncertainty interval highlight */}
      <div className={cn('w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden relative', sizeHeights[size])}>
        {/* Uncertainty Range Background if provided */}
        {uncertaintyBand && (
          <div
            className="absolute top-0 bottom-0 bg-slate-400/40 dark:bg-slate-600/40 rounded-full transition-all duration-300"
            style={{
              left: `${uncertaintyBand[0] * 100}%`,
              width: `${(uncertaintyBand[1] - uncertaintyBand[0]) * 100}%`,
            }}
          />
        )}
        
        {/* Main Score Bar */}
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorCls.split(' ').slice(-1)[0])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
