import React from 'react';
import { ContradictionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { AlertTriangle, ShieldAlert, ArrowDownRight, Compass } from 'lucide-react';

export interface ContradictionAlertProps {
  contradictions: ContradictionRecord[];
}

export const ContradictionAlert: React.FC<ContradictionAlertProps> = ({
  contradictions,
}) => {
  if (contradictions.length === 0) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 rounded-lg p-4 text-emerald-900 dark:text-emerald-300 font-mono text-xs flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <div className="font-bold">Zero Anomalies or Contradictions Detected</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400/80 mt-0.5">
            All 18 records exhibit mutually consistent identifier rotations, image hashes, and temporal cadence.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
        <AlertTriangle className="w-4 h-4" />
        <span>Anomaly & Contradiction Registry ({contradictions.length} Active Flags)</span>
      </div>

      <div className="space-y-3">
        {contradictions.map((contra) => (
          <div
            key={contra.id}
            className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 text-xs space-y-2.5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={contra.severity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                  {contra.severity} SEVERITY ANOMALY
                </Badge>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs">{contra.title}</h4>
              </div>
              <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800/60 self-start sm:self-auto">
                Score Penalty: {contra.penaltyApplied}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
              {contra.description}
            </p>

            {/* Affected Entities */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <ArrowDownRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Affected Records:
              </span>
              {contra.affectedEntities.map((ent) => (
                <span key={ent} className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-amber-800 dark:text-amber-300 font-medium">
                  {ent}
                </span>
              ))}
            </div>

            {/* Investigator Guidance */}
            <div className="bg-white dark:bg-slate-950/80 p-2.5 rounded border border-amber-300 dark:border-amber-900/40 text-[11px] text-amber-950 dark:text-amber-200/90 font-mono flex items-start gap-2 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300">Investigator Guidance: </span>
                <span>{contra.investigatorGuidance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
