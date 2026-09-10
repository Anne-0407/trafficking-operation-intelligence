import React from 'react';
import { SignalDimension } from '../../types';
import { Card } from '../common/Card';
import { ScoreMeter } from '../common/ScoreMeter';
import { 
  FileText, 
  Image, 
  Hash, 
  Clock, 
  Fingerprint, 
  Network,
  Info,
  ChevronRight
} from 'lucide-react';

export interface SignalDecompositionProps {
  signals: SignalDimension[];
}

export const SignalDecomposition: React.FC<SignalDecompositionProps> = ({
  signals,
}) => {
  const iconMap: Record<string, any> = {
    'sig-text': FileText,
    'sig-visual': Image,
    'sig-ident': Hash,
    'sig-temp': Clock,
    'sig-behav': Fingerprint,
    'sig-graph': Network,
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.map((sig) => {
          const Icon = iconMap[sig.id] || Network;

          return (
            <Card
              key={sig.id}
              className="hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              title={
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800/40 text-sky-700 dark:text-sky-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-bold">{sig.name}</span>
                </div>
              }
              action={
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {(sig.score * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 block font-medium">
                    Weight: {(sig.weight * 100).toFixed(0)}%
                  </span>
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                <ScoreMeter
                  score={sig.score}
                  size="sm"
                  showPercent={false}
                />

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-sans">
                  {sig.description}
                </p>

                {/* Technical Details */}
                <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <Info className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    <span>Technical Signal Mechanics</span>
                  </div>
                  <p className="text-[11px] text-slate-800 dark:text-slate-300 font-mono">
                    {sig.technicalDetails}
                  </p>
                </div>

                {/* Evidence Extract Snippets */}
                {sig.evidenceSnippets.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Ground Truth Evidence Snippets:
                    </div>
                    {sig.evidenceSnippets.map((snippet, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-800 dark:text-slate-300 font-mono bg-slate-100/80 dark:bg-slate-900/60 p-2 rounded border border-slate-200 dark:border-slate-800"
                      >
                        <ChevronRight className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <span>{snippet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
