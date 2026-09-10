export interface SignalDimension {
  id: string;
  name: string;
  score: number; // 0.00 to 1.00
  weight: number; // e.g. 0.20
  contribution: number;
  description: string;
  technicalDetails: string;
  evidenceSnippets: string[];
}

export interface ContradictionRecord {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  penaltyApplied: number; // e.g. -0.08
  affectedEntities: string[];
  investigatorGuidance: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  investigatorId: string;
  action: 'ACCEPTED' | 'REJECTED' | 'ESCALATED' | 'NOTE_ADDED' | 'FLAGGED_ANOMALY';
  notes: string;
  verdictRationale?: string;
  previousScore?: number;
}

export interface RelationshipEvidenceItem {
  id: string;
  candidateLinkCode: string;
  sourceEntity: {
    id: string;
    label: string;
    type: string;
  };
  targetEntity: {
    id: string;
    label: string;
    type: string;
  };
  candidateScore: number;
  confidenceBand: [number, number];
  reviewStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ESCALATED';
  signals: SignalDimension[];
  contradictions: ContradictionRecord[];
  auditTrail: AuditLogEntry[];
  lastUpdated: string;
}
