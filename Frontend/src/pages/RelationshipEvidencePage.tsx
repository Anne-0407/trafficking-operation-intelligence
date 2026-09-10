import React, { useState, useMemo } from 'react';
import { Operation, RelationshipEvidenceItem } from '../types';
import { Badge } from '../components/common/Badge';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export interface RelationshipEvidencePageProps {
  operation: Operation;
  evidenceItems: RelationshipEvidenceItem[];
  onUpdateEvidenceStatus: (itemId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'ESCALATED', notes: string) => void;
}

export const RelationshipEvidencePage: React.FC<RelationshipEvidencePageProps> = ({
  operation,
  evidenceItems,
  onUpdateEvidenceStatus,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(evidenceItems[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ESCALATED'>('ALL');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [showRecordComparison, setShowRecordComparison] = useState<boolean>(true);

  // Filter evidence items
  const filteredItems = useMemo(() => {
    return evidenceItems.filter((item) => {
      // Status Filter
      if (statusFilter === 'PENDING' && item.reviewStatus !== 'PENDING') return false;
      if (statusFilter === 'ACCEPTED' && item.reviewStatus !== 'ACCEPTED') return false;
      if (statusFilter === 'REJECTED' && item.reviewStatus !== 'REJECTED') return false;
      if (statusFilter === 'ESCALATED' && item.reviewStatus !== 'ESCALATED') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = item.candidateLinkCode.toLowerCase().includes(q);
        const matchSrc = item.sourceEntity.id.toLowerCase().includes(q) || item.sourceEntity.label.toLowerCase().includes(q);
        const matchTgt = item.targetEntity.id.toLowerCase().includes(q) || item.targetEntity.label.toLowerCase().includes(q);
        const matchEvidence = item.signals.some((s) => s.evidenceSnippets.some((e) => e.toLowerCase().includes(q)));
        return matchCode || matchSrc || matchTgt || matchEvidence;
      }

      return true;
    });
  }, [evidenceItems, statusFilter, searchQuery]);

  // Active selected item (fallback to first filtered item if current not in filter)
  const currentItem = useMemo(() => {
    const found = evidenceItems.find((item) => item.id === selectedItemId);
    if (found) return found;
    return filteredItems[0] || evidenceItems[0];
  }, [evidenceItems, selectedItemId, filteredItems]);

  // Find source & target ad records in the active operation or records
  const srcAd = operation.ads.find((a) => a.id === currentItem?.sourceEntity.id);
  const tgtAd = operation.ads.find((a) => a.id === currentItem?.targetEntity.id);

  // Handle Review Submission
  const handleReviewAction = (status: 'ACCEPTED' | 'REJECTED' | 'ESCALATED') => {
    if (!currentItem) return;
    const defaultNotes = 
      status === 'ACCEPTED' 
        ? 'Accepted as candidate investigative lead based on multi-signal correlation.'
        : status === 'REJECTED'
        ? 'Dismissed as candidate noise.'
        : 'Marked for supervisor/lead investigator review.';
    
    const notesToSave = reviewNotes.trim() || defaultNotes;
    onUpdateEvidenceStatus(currentItem.id, status, notesToSave);
    setReviewNotes('');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              {operation.code} CANDIDATE RELATIONSHIPS
            </span>
            <Badge variant="amber" size="sm" dot>
              Investigator Review Required
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Candidate Relationship & Evidence Review
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect pair-wise match strength, signal contributions, supporting evidence, and contradictions between candidate digital records.
          </p>
        </div>
      </div>

      {/* Two-Panel Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Candidate Relationships Queue (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white font-sans">
              Candidate Relationships
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {filteredItems.length} of {evidenceItems.length}
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records e.g. AD017..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 font-mono outline-none"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap gap-1 text-[11px] font-mono">
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-700'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'PENDING' ? 'Pending' : st === 'ACCEPTED' ? 'Accepted' : 'Dismissed'}
              </button>
            ))}
          </div>

          {/* Scrollable Relationship List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-mono">
                No matching candidate relationships.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === currentItem?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                        {item.candidateLinkCode}
                      </span>
                      <Badge
                        variant={
                          item.reviewStatus === 'ACCEPTED'
                            ? 'success'
                            : item.reviewStatus === 'REJECTED'
                            ? 'danger'
                            : item.reviewStatus === 'ESCALATED'
                            ? 'purple'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {item.reviewStatus === 'PENDING' ? 'Review Required' : item.reviewStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-sans mt-1">
                      <span>Match Strength</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {(item.candidateScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Mini Signal Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${item.candidateScore * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Selected Candidate Relationship Details (8 Cols) */}
        {currentItem ? (
          <div className="lg:col-span-8 space-y-5">
            {/* 1. Header & Source Record ↔ Target Record */}
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Candidate Relationship
                  </div>
                  <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                    <span>{currentItem.sourceEntity.id}</span>
                    <ArrowRight className="w-5 h-5 text-sky-500 shrink-0" />
                    <span>{currentItem.targetEntity.id}</span>
                  </h2>
                </div>

                <Badge
                  variant={
                    currentItem.reviewStatus === 'ACCEPTED'
                      ? 'success'
                      : currentItem.reviewStatus === 'REJECTED'
                      ? 'danger'
                      : currentItem.reviewStatus === 'ESCALATED'
                      ? 'purple'
                      : 'amber'
                  }
                  size="md"
                  dot
                >
                  Review Status: {currentItem.reviewStatus === 'PENDING' ? 'Requires Review' : currentItem.reviewStatus}
                </Badge>
              </div>

              {/* 2. Match Strength */}
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-lg p-4 border border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Match Strength
                  </span>
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {(currentItem.candidateScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${currentItem.candidateScore * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>Confidence Interval: [{(currentItem.confidenceBand[0] * 100).toFixed(0)}% – {(currentItem.confidenceBand[1] * 100).toFixed(0)}%]</span>
                  <span>Engine Threshold: ≥ 52%</span>
                </div>
              </div>

              {/* 3. Relationship Signals (6 Horizontal Bars) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Relationship Signals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {currentItem.signals.map((sig) => {
                    const labelShort = 
                      sig.id === 'sig-text' ? 'Text'
                      : sig.id === 'sig-visual' ? 'Visual'
                      : sig.id === 'sig-ident' ? 'Identifier'
                      : sig.id === 'sig-temp' ? 'Time'
                      : sig.id === 'sig-behav' ? 'Behaviour'
                      : 'Graph';

                    const pct = Math.round(sig.score * 100);

                    return (
                      <div
                        key={sig.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {labelShort}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 80
                                ? 'bg-emerald-500'
                                : pct >= 50
                                ? 'bg-sky-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate">
                          {sig.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Supporting Evidence & 5. Contradictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Supporting Evidence */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Supporting Evidence</span>
                  </h4>
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentItem.signals.flatMap((s) => s.evidenceSnippets).length > 0 ? (
                      currentItem.signals
                        .flatMap((s) => s.evidenceSnippets)
                        .slice(0, 5)
                        .map((snippet, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                            <span>{snippet}</span>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-start gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>Multi-signal correlation exceeds operational threshold.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contradictions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Contradictions & Variations</span>
                  </h4>
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentItem.contradictions.length > 0 ? (
                      currentItem.contradictions.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                          <span>{c.description || c.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 dark:text-slate-400 italic text-[11px]">
                        No major contradictions detected between these records.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 6. Record Comparison Preview (Collapsible) */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowRecordComparison(!showRecordComparison)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-sky-500" />
                    <span>Compare Record Content ({currentItem.sourceEntity.id} vs {currentItem.targetEntity.id})</span>
                  </span>
                  {showRecordComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRecordComparison && (
                  <div className="p-4 bg-white dark:bg-slate-900/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    {/* Source Record */}
                    <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="font-mono font-bold text-sky-700 dark:text-sky-400">
                        Source Record: {currentItem.sourceEntity.id}
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 italic font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                        "{srcAd?.rawText || 'Synthetic record text body'}"
                      </p>
                      <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>Location: {srcAd?.location.city || 'Texas District'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>Phone: {srcAd?.identifiers.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-cyan-500" />
                          <span>Account: {srcAd?.identifiers.account || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Posting Time: {srcAd?.timestamp ? formatDateTime(srcAd.timestamp) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Target Record */}
                    <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="font-mono font-bold text-sky-700 dark:text-sky-400">
                        Target Record: {currentItem.targetEntity.id}
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 italic font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                        "{tgtAd?.rawText || 'Synthetic record text body'}"
                      </p>
                      <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>Location: {tgtAd?.location.city || 'Texas District'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>Phone: {tgtAd?.identifiers.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-cyan-500" />
                          <span>Account: {tgtAd?.identifiers.account || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Posting Time: {tgtAd?.timestamp ? formatDateTime(tgtAd.timestamp) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Investigator Review Actions */}
              <div className="bg-slate-50 dark:bg-slate-950/90 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Investigator Review
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Investigator: <strong className="text-slate-800 dark:text-slate-200">INV-77042</strong>
                  </span>
                </div>

                {/* Case Notes Textarea */}
                <div>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter investigator review notes or justification (optional)..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 font-sans outline-none resize-none"
                  />
                </div>

                {/* 3 Review Verdict Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => handleReviewAction('ACCEPTED')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept as Lead</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction('ESCALATED')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Mark for Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction('REJECTED')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-200 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-300 font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Dismiss</span>
                  </button>
                </div>

                {/* Audit Log Trail if present */}
                {currentItem.auditTrail.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 text-[11px] font-mono">
                    <div className="text-slate-500">Decision History:</div>
                    {currentItem.auditTrail.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {log.action} by {log.investigatorId}
                        </span>
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-mono text-xs">
            Select a candidate relationship from the queue to view evidence decomposition.
          </div>
        )}
      </div>
    </div>
  );
};
export default RelationshipEvidencePage;
