import React from 'react';
import { BenchmarkDatasetResult, MetricComparison } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useTheme } from '../context/ThemeContext';
import { 
  Info,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export interface EvaluationPageProps {
  benchmarks: BenchmarkDatasetResult[];
  comparisons: MetricComparison[];
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({
  benchmarks,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Chart dataset for F1 Comparison
  const f1ChartData = [
    {
      name: 'Original Dataset',
      'Exact Identifier': 3.5,
      'Text Only': 10.4,
      'Combined Approach': 87.5,
    },
    {
      name: 'After Controlled Changes',
      'Exact Identifier': 3.5,
      'Text Only': 2.4,
      'Combined Approach': 54.0,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              BENCHMARK
            </span>
            <Badge variant="success" size="sm">
              Controlled Synthetic Evaluation
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Synthetic Benchmark
          </h1>
        </div>
      </div>

      {/* Mandatory Benchmark Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-sans">
          <div className="font-bold text-amber-900 dark:text-amber-200 font-mono text-xs uppercase tracking-wide">
            Synthetic Data Disclaimer
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
            Results shown here are from a controlled synthetic benchmark. They are not real-world trafficking detection performance.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison: Original Dataset vs After Controlled Changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Dataset Card */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                Original Dataset
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">50 Records • 169 Known Pairs</p>
            </div>
            <Badge variant="info" size="sm">Baseline Run</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Exact Identifier */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-600 dark:text-slate-400 font-sans font-medium">Exact Identifier</div>
                <div className="text-[10px] text-slate-400">Single phone/handle match</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-slate-700 dark:text-slate-300">F1: 3.5%</div>
                <div className="text-[10px] text-slate-400">3/169 pairs</div>
              </div>
            </div>

            {/* Text Only */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-600 dark:text-slate-400 font-sans font-medium">Text Only</div>
                <div className="text-[10px] text-slate-400">Semantic text embedding alone</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-slate-700 dark:text-slate-300">F1: 10.4%</div>
                <div className="text-[10px] text-slate-400">14/169 pairs</div>
              </div>
            </div>

            {/* Combined Approach */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
              <div>
                <div className="text-emerald-900 dark:text-emerald-300 font-sans font-semibold">Combined Approach</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Multi-Signal Graph Fusion</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">F1: 87.5%</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">151/169 pairs</div>
              </div>
            </div>
          </div>
        </div>

        {/* After Controlled Changes Card */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                After Controlled Changes
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Rotated Phones, Handles & Paraphrased Text</p>
            </div>
            <Badge variant="purple" size="sm">Perturbation Run</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Exact Identifier */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-600 dark:text-slate-400 font-sans font-medium">Exact Identifier</div>
                <div className="text-[10px] text-slate-400">Single phone/handle match</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-rose-600 dark:text-rose-400">F1: 3.5%</div>
                <div className="text-[10px] text-slate-400">3/169 pairs</div>
              </div>
            </div>

            {/* Text Only */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-600 dark:text-slate-400 font-sans font-medium">Text Only</div>
                <div className="text-[10px] text-slate-400">Paraphrased text degrades match</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-rose-600 dark:text-rose-400">F1: 2.4%</div>
                <div className="text-[10px] text-slate-400">3/169 pairs</div>
              </div>
            </div>

            {/* Combined Approach */}
            <div className="p-3 bg-sky-50/60 dark:bg-sky-950/30 rounded-lg border border-sky-200 dark:border-sky-800/50 flex items-center justify-between">
              <div>
                <div className="text-sky-900 dark:text-sky-300 font-sans font-semibold">Combined Approach</div>
                <div className="text-[10px] text-sky-700 dark:text-sky-400">Multi-Signal Graph Fusion</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-sky-600 dark:text-sky-400">F1: 54.0%</div>
                <div className="text-[10px] text-sky-700 dark:text-sky-400 font-medium">71/169 pairs retained</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Card */}
      <Card
        title="Benchmark F1-Score Comparison (%)"
        subtitle="Comparing baseline methods against the combined multi-signal approach"
      >
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={f1ChartData}
              margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} />
              <XAxis
                dataKey="name"
                stroke={isDark ? '#64748B' : '#94A3B8'}
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke={isDark ? '#64748B' : '#94A3B8'}
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
              />
              <Bar
                dataKey="Exact Identifier"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Text Only"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Combined Approach"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Key Conclusion Card */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-700 dark:text-sky-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Key Benchmark Conclusion</span>
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          The combined approach retained more known relationships after controlled changes than the baseline methods in this synthetic experiment.
        </p>
      </div>
    </div>
  );
};
export default EvaluationPage;
