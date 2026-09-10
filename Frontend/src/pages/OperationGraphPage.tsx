import React from 'react';
import { GraphData, Operation } from '../types';
import { GraphCanvas } from '../components/graph/GraphCanvas';

export interface OperationGraphPageProps {
  operation: Operation;
  graphData: GraphData;
}

export const OperationGraphPage: React.FC<OperationGraphPageProps> = ({
  operation,
  graphData,
}) => {
  return (
    <div className="space-y-4 font-sans h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              {operation.code} GRAPH
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Multi-Signal Entity Network
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Candidate Relationship Graph
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300">
            {graphData.nodes.length} Nodes • {graphData.edges.length} Edges
          </span>
        </div>
      </div>

      {/* Main Dominant Graph Canvas */}
      <div className="flex-1 min-h-[620px]">
        <GraphCanvas graphData={graphData} />
      </div>
    </div>
  );
};
export default OperationGraphPage;
