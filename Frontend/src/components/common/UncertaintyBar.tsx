import React from 'react';
import { cn } from '../../lib/utils';
import { HelpCircle } from 'lucide-react';

export interface UncertaintyBarProps {
  score: number;
  interval: [number, number]; // [lowerBound, upperBound]
  label?: string;
  className?: string;
}

export const UncertaintyBar: React.FC<UncertaintyBarProps> = ({
  score,
  interval,
  label = 'Candidate Score (Credible Interval)',
  className,
}) => {
  const [lower, upper] = interval;
  const lowerPct = lower * 100;
  const upperPct = upper * 100;
  const scorePct = score * 100;
  const spread = upperPct - lowerPct;

  return (
    <div className={cn('bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm', className)}>
      <div className="flex items-center justify-between text-xs font-mono mb-2">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{(score * 100).toFixed(1)}%</span>
          <span className="text-slate-500 text-[11px]">
            [{lowerPct.toFixed(0)}% — {upperPct.toFixed(0)}% CI]
          </span>
        </div>
      </div>

      {/* Visual credible interval meter */}
      <div className="relative h-6 bg-slate-200/80 dark:bg-slate-950 rounded-md border border-slate-300 dark:border-slate-800/80 overflow-hidden flex items-center px-1">
        {/* Grid markings */}
        <div className="absolute inset-0 flex justify-between px-2 text-[9px] text-slate-400 dark:text-slate-600 font-mono pointer-events-none items-center">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>

        {/* Confidence Interval Spread Area */}
        <div
          className="absolute top-1 bottom-1 bg-sky-200/80 dark:bg-sky-950/80 border-x-2 border-sky-500 rounded"
          style={{
            left: `${lowerPct}%`,
            width: `${spread}%`,
          }}
        >
          <div className="w-full h-full bg-sky-500/20 dark:bg-sky-500/15" />
        </div>

        {/* Point Estimate Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-emerald-500 dark:bg-emerald-400 shadow-glow-success z-10 -ml-0.5"
          style={{ left: `${scorePct}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5 px-0.5">
        <span>Low Bound ({lowerPct.toFixed(0)}%)</span>
        <span className="text-slate-600 dark:text-slate-400 font-medium">Estimated Mean ({scorePct.toFixed(1)}%)</span>
        <span>High Bound ({upperPct.toFixed(0)}%)</span>
      </div>
    </div>
  );
};
