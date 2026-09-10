import React, { useState } from 'react';
import { DriftSimulationStep, MetricComparison } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Database,
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';

export interface ChangeAwareTestPageProps {
  steps: DriftSimulationStep[];
  comparisons: MetricComparison[];
}

export const ChangeAwareTestPage: React.FC<ChangeAwareTestPageProps> = ({
  steps,
  comparisons,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentStep = steps[currentStepIndex];

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePlaySimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let idx = currentStepIndex;
    const interval = setInterval(() => {
      idx += 1;
      if (idx >= steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStepIndex(idx);
      }
    }, 1800);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              EXPERIMENT
            </span>
            <Badge variant="purple" size="sm">
              Controlled Drift Evaluation
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Change-Aware Test
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            How well do candidate relationships survive controlled changes to identifiers and content?
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handlePlaySimulation}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all shadow-sm cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Running...' : 'Run Simulation'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Stage Flow Diagram: ORIGINAL DATA -> CONTROLLED CHANGES -> RE-ANALYSIS -> RESULT */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Experimental Pipeline
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">1</div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">ORIGINAL DATA</div>
              <div className="text-[11px] text-slate-500">50 Synthetic Records</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">2</div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">CONTROLLED CHANGES</div>
              <div className="text-[11px] text-slate-500">Rotated phones & text</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">3</div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">RE-ANALYSIS</div>
              <div className="text-[11px] text-slate-500">Multi-Signal Graph Fusion</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">4</div>
            <div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300">RESULT</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Relationships Recovered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics First */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Combined Approach
              </span>
              <Badge variant="success" size="sm">Proposed Multi-Signal</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <div className="text-xs text-slate-500 font-mono">Original F1</div>
                <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">87.5%</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">151/169 pairs</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <div className="text-xs text-slate-500 font-mono">Changed F1</div>
                <div className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">54.0%</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">71/169 pairs retained</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Exact Identifier Baseline
              </span>
              <Badge variant="danger" size="sm">Single-Field Match</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <div className="text-xs text-slate-500 font-mono">Original F1</div>
                <div className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">3.5%</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">3/169 pairs</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <div className="text-xs text-slate-500 font-mono">Changed F1</div>
                <div className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">3.5%</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">3/169 pairs (Collapses)</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Step Explorer (Secondary Details) */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white font-sans">
              Controlled Change Steps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Step through individual change phases to see relationship retention.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            {steps.map((st, i) => (
              <button
                key={st.stepNumber}
                onClick={() => setCurrentStepIndex(i)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  currentStepIndex === i
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border-sky-400 dark:border-sky-700'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                Step 0{st.stepNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Step Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Panel */}
          <div className="p-4 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2.5 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-900 dark:text-rose-300 font-mono">
                Static Baseline
              </span>
              <Badge variant="danger" size="sm">{currentStep.baseline.clusterStatus}</Badge>
            </div>
            <div className="font-mono text-sm">
              <span className="text-slate-500">Recovered: </span>
              <span className="font-bold text-rose-700 dark:text-rose-400">
                {currentStep.baseline.detectedAdsInCluster} / {currentStep.baseline.totalActiveAds} pairs
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {currentStep.baseline.lossReason}
            </p>
          </div>

          {/* Proposed Panel */}
          <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2.5 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300 font-mono">
                Proposed Combined Approach
              </span>
              <Badge variant="success" size="sm">{currentStep.proposed.clusterStatus}</Badge>
            </div>
            <div className="font-mono text-sm">
              <span className="text-slate-500">Recovered: </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {currentStep.proposed.detectedAdsInCluster} / {currentStep.proposed.totalActiveAds} pairs
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {currentStep.proposed.inferredBridgeMechanism}
            </p>
          </div>
        </div>
      </div>

      {/* Robustness Benchmark Table */}
      <Card
        title="Performance After Controlled Changes"
        subtitle="Benchmark comparison across controlled synthetic dataset perturbations"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Exact Baseline</th>
                <th className="py-2.5 px-3">Combined Approach</th>
                <th className="py-2.5 px-3">Delta</th>
                <th className="py-2.5 px-3 font-sans">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{c.metric}</td>
                  <td className="py-3 px-3 text-rose-600 dark:text-rose-400">
                    {typeof c.baselineScore === 'number' && c.baselineScore < 1.0 && c.baselineScore > 0
                      ? `${(c.baselineScore * 100).toFixed(1)}%`
                      : c.baselineScore}
                  </td>
                  <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                    {typeof c.proposedScore === 'number' && c.proposedScore <= 1.0 && c.proposedScore > 0
                      ? `${(c.proposedScore * 100).toFixed(1)}%`
                      : c.proposedScore}
                  </td>
                  <td className="py-3 px-3 text-sky-600 dark:text-sky-400 font-bold">{c.deltaPercent}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans text-[11px]">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default ChangeAwareTestPage;
