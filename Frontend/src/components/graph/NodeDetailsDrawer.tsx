import React from 'react';
import { GraphNode, GraphEdge } from '../../types';
import { Badge } from '../common/Badge';
import { ScoreMeter } from '../common/ScoreMeter';
import { 
  X, 
  Layers, 
  Clock, 
  ShieldAlert, 
  ArrowRight
} from 'lucide-react';

export interface NodeDetailsDrawerProps {
  node: GraphNode | null;
  edge: GraphEdge | null;
  onClose: () => void;
  onInspectEdge?: (edge: GraphEdge) => void;
}

export const NodeDetailsDrawer: React.FC<NodeDetailsDrawerProps> = ({
  node,
  edge,
  onClose,
}) => {
  if (!node && !edge) return null;

  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl z-30 font-sans text-xs transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
            {node ? 'Entity Details' : 'Candidate Relationship'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {node && (
          <>
            {/* Entity Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge
                  variant={
                    node.type === 'operation'
                      ? 'danger'
                      : node.type === 'advertisement'
                      ? 'info'
                      : node.type === 'phone'
                      ? 'success'
                      : node.type === 'username'
                      ? 'purple'
                      : node.type === 'image'
                      ? 'amber'
                      : 'default'
                  }
                  size="sm"
                >
                  {node.type.toUpperCase()}
                </Badge>
                {node.flagged && (
                  <Badge variant="warning" size="sm">
                    Boundary Flagged
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">{node.label}</h3>
              {node.subType && <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{node.subType}</p>}
            </div>

            {/* Confidence Score */}
            {node.riskScore !== undefined && (
              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 space-y-2">
                <ScoreMeter
                  score={node.riskScore}
                  label="Match Strength"
                  showPercent
                />
              </div>
            )}

            {/* Metadata Fields */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Record Metadata
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-lg p-3 border border-slate-200 dark:border-slate-800/80 space-y-2 font-mono text-[11px]">
                {Object.entries(node.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-2 border-b border-slate-200 dark:border-slate-900 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold text-right max-w-[180px] truncate">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            {(node.firstSeen || node.lastSeen) && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline Span:</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {node.firstSeen || 'N/A'} → {node.lastSeen || 'Present'}
                </span>
              </div>
            )}

            {/* Synthetic Notice */}
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 rounded text-[11px] text-sky-800 dark:text-sky-300">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <ShieldAlert className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>Synthetic Record</span>
              </div>
              <p className="text-[10px] text-sky-700/80 dark:text-sky-400/80">
                Generated synthetic entity for multi-signal relationship exploration.
              </p>
            </div>
          </>
        )}

        {edge && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="info" size="sm">
                  {edge.relationshipType}
                </Badge>
                <Badge
                  variant={edge.reviewStatus === 'ACCEPTED' ? 'success' : 'amber'}
                  size="sm"
                >
                  {edge.reviewStatus === 'PENDING' ? 'Requires Review' : edge.reviewStatus}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                <span>{edge.source}</span>
                <ArrowRight className="w-4 h-4 text-sky-500" />
                <span>{edge.target}</span>
              </h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <ScoreMeter
                score={edge.confidenceScore}
                label="Match Strength"
                showPercent
              />
            </div>

            {/* Signal Decomposition for this Edge */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Relationship Signals
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(edge.signals).map(([sigKey, sigVal]) => (
                  <div key={sigKey} className="bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800/60">
                    <ScoreMeter
                      score={sigVal}
                      label={sigKey.replace(/Sim|Context/, ' Signal')}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {edge.evidenceSnippet && (
              <div className="bg-slate-50 dark:bg-slate-900/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Supporting Evidence Snippet
                </div>
                <p className="text-slate-700 dark:text-slate-200 italic font-mono text-[11px]">
                  "{edge.evidenceSnippet}"
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer / Review Action */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono text-center">
          Investigator Review Console • Candidate Details
        </div>
      </div>
    </div>
  );
};

