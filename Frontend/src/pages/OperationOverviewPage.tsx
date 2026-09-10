import React, { useState } from 'react';
import { Operation, AdvertisementRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { 
  Network, 
  Clock, 
  FileCheck2, 
  GitCompare,
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
  Phone,
  CreditCard,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatDate, formatDateTime } from '../lib/utils';

export interface OperationOverviewPageProps {
  operation: Operation;
  onNavigateToGraph: () => void;
  onNavigateToTimeline: () => void;
  onNavigateToEvidence: () => void;
  onNavigateToChangeAware: () => void;
  searchQuery?: string;
}

export const OperationOverviewPage: React.FC<OperationOverviewPageProps> = ({
  operation,
  onNavigateToGraph,
  onNavigateToTimeline,
  onNavigateToEvidence,
  onNavigateToChangeAware,
  searchQuery = '',
}) => {
  const [adSearch, setAdSearch] = useState('');
  const [selectedAd, setSelectedAd] = useState<AdvertisementRecord | null>(null);
  const [showSignalDetails, setShowSignalDetails] = useState(false);

  const effectiveSearch = (adSearch || searchQuery).toLowerCase().trim();

  const filteredAds = operation.ads.filter(
    (ad) =>
      !effectiveSearch ||
      ad.adCode.toLowerCase().includes(effectiveSearch) ||
      ad.title.toLowerCase().includes(effectiveSearch) ||
      ad.location.city.toLowerCase().includes(effectiveSearch) ||
      (ad.identifiers.phone && ad.identifiers.phone.includes(effectiveSearch)) ||
      (ad.identifiers.handle && ad.identifiers.handle.toLowerCase().includes(effectiveSearch))
  );

  const isOp31 = operation.code === 'OP-031';
  const groundTruthCount = isOp31 ? 18 : operation.recordCount;
  const boundaryCount = isOp31 ? 3 : 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Candidate Operation
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {operation.code}
              </h1>
              <Badge variant="amber" size="sm" dot>
                {operation.status}
              </Badge>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 text-left md:text-right">
            <div className="text-xs text-slate-500 font-sans">Match Strength</div>
            <div className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
              {(operation.candidateScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Composition Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-slate-500 uppercase text-[11px]">Total Membership</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {operation.recordCount} Candidate Records
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40 text-center">
            <div className="text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">Ground-Truth</div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              {groundTruthCount} Ground-Truth Records
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40 text-center">
            <div className="text-amber-700 dark:text-amber-400 uppercase text-[11px]">Boundary Noise</div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5">
              {boundaryCount} Boundary Records
            </div>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          <button
            onClick={onNavigateToEvidence}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Review Evidence</span>
          </button>

          <button
            onClick={onNavigateToGraph}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold transition-colors cursor-pointer"
          >
            <Network className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Explore Graph</span>
          </button>

          <button
            onClick={onNavigateToTimeline}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Activity Timeline</span>
          </button>

          <button
            onClick={onNavigateToChangeAware}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold transition-colors cursor-pointer"
          >
            <GitCompare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Change-Aware Test</span>
          </button>
        </div>
      </div>

      {/* "Why are these records connected?" Signal Section */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Why are these records connected?</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-signal score breakdown across six analytical dimensions.
          </p>
        </div>

        {/* 6 Horizontal Signal Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {[
            { label: 'Text', score: operation.signalBreakdown.textSimilarity, desc: 'Semantic phrasing & template structure overlap' },
            { label: 'Visual', score: operation.signalBreakdown.visualSimilarity, desc: 'Promotional media embedding similarity' },
            { label: 'Identifier', score: operation.signalBreakdown.identifierSimilarity, desc: 'Phone, handle, and account correlation' },
            { label: 'Time', score: operation.signalBreakdown.temporalSimilarity, desc: 'Posting schedule & cadence consistency' },
            { label: 'Behaviour', score: operation.signalBreakdown.behavioralSimilarity, desc: 'Posting pattern and contact formatting' },
            { label: 'Graph', score: operation.signalBreakdown.graphContext, desc: '2-hop neighborhood network connectivity' },
          ].map((sig) => {
            const pct = Math.round(sig.score * 100);
            return (
              <div
                key={sig.label}
                className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-sans">
                    {sig.label}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {showSignalDetails && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans pt-0.5">
                    {sig.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expandable Details Toggle */}
        <button
          onClick={() => setShowSignalDetails(!showSignalDetails)}
          className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono cursor-pointer pt-1"
        >
          {showSignalDetails ? (
            <>
              <span>Hide Signal Descriptions</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Show Detailed Explanations</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Candidate Records Explorer Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white font-sans">
              Candidate Digital Records ({operation.ads.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Browse candidate digital records in this cluster.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adSearch}
              onChange={(e) => setAdSearch(e.target.value)}
              placeholder="Search by ID, city, phone..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 font-mono outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              onClick={() => setSelectedAd(ad)}
              className="p-3.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-sky-700 dark:text-sky-400">
                  {ad.id}
                </span>
                <span className="text-[11px] text-slate-500">
                  {formatDate(ad.timestamp)}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono line-clamp-2 italic bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80">
                "{ad.rawText}"
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <MapPin className="w-3 h-3" />
                  {ad.location.city}
                </span>
                <span className="text-slate-500">
                  Phone: {ad.identifiers.phone || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Preview Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400">Record {selectedAd.id}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-mono">{formatDate(selectedAd.timestamp)}</span>
              </div>
              <button
                onClick={() => setSelectedAd(null)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-mono text-sm px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Text Body</div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed mt-0.5">
                  "{selectedAd.rawText}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Location</div>
                  <div className="text-amber-600 dark:text-amber-300 font-bold mt-0.5">
                    {selectedAd.location.city}, {selectedAd.location.state}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Phone Identifier</div>
                  <div className="text-emerald-600 dark:text-emerald-300 font-bold mt-0.5">
                    {selectedAd.identifiers.phone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OperationOverviewPage;
