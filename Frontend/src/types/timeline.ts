export type TimelineLaneType = 
  | 'AD_BURST'
  | 'PHONE_ROTATION'
  | 'HANDLE_PIVOT'
  | 'GEO_MIGRATION'
  | 'PAYMENT_CRYPTO';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  lane: TimelineLaneType;
  title: string;
  description: string;
  entityId: string;
  entityLabel: string;
  location?: {
    city: string;
    state: string;
  };
  adIds: string[];
  candidateScore: number;
  isPivotPoint?: boolean;
  pivotFrom?: string;
  pivotTo?: string;
  rawAdSnippet?: string;
}

export interface TimelinePhase {
  phaseNumber: number;
  name: string;
  dateRange: string;
  primaryLocation: string;
  activeIdentifiers: string[];
  adCount: number;
  operationalBehavior: string;
}
