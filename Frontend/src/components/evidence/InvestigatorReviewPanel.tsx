import React, { useState } from 'react';
import { RelationshipEvidenceItem, AuditLogEntry } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  CheckCircle2, 
  XCircle, 
  Flag, 
  ArrowUpRight, 
  Send, 
  History, 
  FileText,
  UserCheck,
  Shield
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export interface InvestigatorReviewPanelProps {
  item: RelationshipEvidenceItem;
  onUpdateStatus: (itemId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'ESCALATED', notes: string) => void;
}

export const InvestigatorReviewPanel: React.FC<InvestigatorReviewPanelProps> = ({
  item,
  onUpdateStatus,
}) => {
  const [rationale, setRationale] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<'ACCEPTED' | 'REJECTED' | 'ESCALATED'>('ACCEPTED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rationale.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateStatus(item.id, selectedVerdict, rationale);
      setRationale('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Human Investigator Decision Console */}
      <Card
        title="Human-in-the-Loop Investigation Decision Console"
        subtitle={`Candidate Relationship: ${item.candidateLinkCode}`}
        badge={
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
            dot
          >
            STATUS: {item.reviewStatus}
          </Badge>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold font-mono text-slate-900 dark:text-slate-200 mb-1">
              <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Attribution Protocol Requirement</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Automated multi-signal scores provide candidate operational links. An authorized investigator must document reasoning before confirming or dismissing candidate linkages.
            </p>
          </div>

          {/* Action Selector Buttons */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-semibold">
              Select Investigator Verdict:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedVerdict('ACCEPTED')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedVerdict === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-500 shadow-sm dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500 dark:shadow-glow-success'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Confirm Link</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVerdict('REJECTED')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedVerdict === 'REJECTED'
                    ? 'bg-rose-100 text-rose-900 border-rose-500 shadow-sm dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-500 dark:shadow-glow-danger'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Reject / Dismiss</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVerdict('ESCALATED')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedVerdict === 'ESCALATED'
                    ? 'bg-purple-100 text-purple-900 border-purple-500 shadow-sm dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-500'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Escalate to Lead</span>
              </button>
            </div>
          </div>

          {/* Case Notes / Rationale */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
              Investigator Rationale & Case Notes:
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Document specific rationale (e.g., 'Verified shared account reference across Houston and Dallas records; visual image hash alignment confirmed')..."
              className="w-full bg-white dark:bg-slate-950/90 border border-slate-300 dark:border-slate-800 focus:border-sky-500 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono outline-none resize-none leading-relaxed transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[10px] font-mono text-slate-500">
              Session Investigator: <span className="text-slate-800 dark:text-slate-300 font-bold">INV-77042</span>
            </div>
            <button
              type="submit"
              disabled={!rationale.trim() || isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                rationale.trim() && !isSubmitting
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-glow-accent cursor-pointer'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : 'Commit Investigator Verdict'}</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Immutable Audit Trail Log */}
      <Card
        title="Immutable Investigation Audit Log"
        subtitle="Recorded investigator decision history and audit trail"
        badge={
          <Badge variant="outline" size="sm">
            {item.auditTrail.length} Logged Actions
          </Badge>
        }
      >
        {item.auditTrail.length === 0 ? (
          <div className="text-center py-6 text-xs font-mono text-slate-400 dark:text-slate-500">
            No previous investigator entries recorded for this relationship item.
          </div>
        ) : (
          <div className="space-y-3">
            {item.auditTrail.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800/80 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{log.investigatorId}</span>
                  </div>
                  <span className="text-slate-500">{formatDateTime(log.timestamp)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      log.action === 'ACCEPTED'
                        ? 'success'
                        : log.action === 'REJECTED'
                        ? 'danger'
                        : log.action === 'ESCALATED'
                        ? 'purple'
                        : 'default'
                    }
                    size="sm"
                  >
                    {log.action}
                  </Badge>
                </div>

                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs bg-white dark:bg-slate-900/60 p-2 rounded border border-slate-200 dark:border-slate-800">
                  {log.notes}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
