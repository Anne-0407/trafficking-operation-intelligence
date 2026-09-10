import React, { useState } from 'react';
import { TimelineEvent, TimelinePhase, TimelineLaneType } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Hash, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  Calendar
} from 'lucide-react';
import { formatDate, formatDateTime } from '../../lib/utils';

export interface TemporalLanesProps {
  phases: TimelinePhase[];
  events: TimelineEvent[];
}

export const TemporalLanes: React.FC<TemporalLanesProps> = ({
  phases,
  events,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(events[0] || null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const laneConfig: Record<TimelineLaneType, { label: string; icon: any; color: string; bg: string; border: string }> = {
    GEO_MIGRATION: { label: 'Location Change', icon: MapPin, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/40', border: 'border-amber-300 dark:border-amber-800/60' },
    PHONE_ROTATION: { label: 'Identifier Changed', icon: Phone, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/40', border: 'border-emerald-300 dark:border-emerald-800/60' },
    HANDLE_PIVOT: { label: 'Identifier Changed', icon: Hash, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/40', border: 'border-purple-300 dark:border-purple-800/60' },
    PAYMENT_CRYPTO: { label: 'Account Activity', icon: CreditCard, color: 'text-cyan-700 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-950/40', border: 'border-cyan-300 dark:border-cyan-800/60' },
    AD_BURST: { label: 'Record Posting', icon: FileText, color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-950/40', border: 'border-sky-300 dark:border-sky-800/60' },
  };

  const filteredEvents = selectedPhase
    ? events.filter((e) => {
        if (selectedPhase === 1) return e.timestamp.startsWith('2024-01-10') || e.timestamp.startsWith('2024-01-11');
        if (selectedPhase === 2) return e.timestamp.startsWith('2024-01-11') || e.timestamp.startsWith('2024-01-12');
        if (selectedPhase === 3) return e.timestamp.startsWith('2024-01-12') || e.timestamp.startsWith('2024-01-13');
        if (selectedPhase === 4) return e.timestamp.startsWith('2024-01-13') || e.timestamp.startsWith('2024-01-19');
        return true;
      })
    : events;

  return (
    <div className="space-y-6 font-sans">
      {/* Activity Timeline Phases Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              Activity Sequence Phases
            </h3>
          </div>
          {selectedPhase && (
            <button
              onClick={() => setSelectedPhase(null)}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono cursor-pointer"
            >
              Reset Phase Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase) => {
            const isSelected = selectedPhase === phase.phaseNumber;
            return (
              <div
                key={phase.phaseNumber}
                onClick={() => setSelectedPhase(isSelected ? null : phase.phaseNumber)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant={isSelected ? 'info' : 'outline'} size="sm">
                    Phase {phase.phaseNumber}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">{phase.adCount} Records</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono mb-1">{phase.name}</h4>
                <div className="text-[11px] text-sky-700 dark:text-sky-300 font-mono mb-2 font-medium">{phase.dateRange}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {phase.operationalBehavior}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chronological Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Event Stream (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-sans">
                Activity Chronology ({filteredEvents.length} Events)
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Sorted by Timestamp
            </div>
          </div>

          <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-[19px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
            {filteredEvents.map((evt) => {
              const cfg = laneConfig[evt.lane] || laneConfig.AD_BURST;
              const Icon = cfg.icon;
              const isSelected = selectedEvent?.id === evt.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`relative flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/70 dark:bg-slate-850 border-sky-500 shadow-sm ml-1.5'
                      : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Lane Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border z-10 shrink-0 ${
                      cfg.bg
                    } ${cfg.border} ${cfg.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {evt.entityId || evt.entityLabel}
                        </span>
                        {evt.isPivotPoint && (
                          <Badge variant="warning" size="sm">
                            Identifier Changed
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 shrink-0">
                        {formatDateTime(evt.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      {evt.location && (
                        <span className="text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />
                          {evt.location.city}, {evt.location.state}
                        </span>
                      )}
                      {evt.pivotFrom && evt.pivotTo && (
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {evt.pivotFrom} <ArrowRight className="w-3 h-3 text-amber-500" /> {evt.pivotTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Details (Right col) */}
        <div className="space-y-4">
          {selectedEvent ? (
            <Card
              title="Record Event Details"
              subtitle={`Recorded: ${formatDateTime(selectedEvent.timestamp)}`}
              badge={
                selectedEvent.isPivotPoint ? (
                  <Badge variant="warning" size="sm">
                    Identifier Changed
                  </Badge>
                ) : (
                  <Badge variant="info" size="sm">
                    Record Log
                  </Badge>
                )
              }
            >
              <div className="space-y-3.5 text-xs font-sans">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white font-mono mb-1">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Identifier Change Notification */}
                {selectedEvent.isPivotPoint && selectedEvent.pivotFrom && selectedEvent.pivotTo && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 rounded-lg text-amber-900 dark:text-amber-200">
                    <div className="font-bold font-mono text-xs mb-1">
                      Identifier Changed
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono bg-white dark:bg-slate-950/80 p-2 rounded border border-amber-200 dark:border-amber-900/60 mt-1">
                      <span className="text-slate-600 dark:text-slate-400">{selectedEvent.pivotFrom}</span>
                      <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedEvent.pivotTo}</span>
                    </div>
                  </div>
                )}

                {/* Raw Text Body */}
                {selectedEvent.rawAdSnippet && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                      Record Text Extract
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-mono text-[11px] italic bg-white dark:bg-slate-900/60 p-2 rounded border border-slate-200 dark:border-slate-800/60">
                      "{selectedEvent.rawAdSnippet}"
                    </p>
                  </div>
                )}

                {/* Linked Record ID */}
                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase mb-1 font-semibold">
                    Record Identifier
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {selectedEvent.adIds.map((adId) => (
                      <span
                        key={adId}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sky-800 dark:text-sky-300 text-[11px] font-medium"
                      >
                        {adId.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Strength */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Match Strength:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {(selectedEvent.candidateScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-6 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
              Click any event on the timeline to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

