export type OperationalClusterStatus = 
  | 'Requires Investigator Review'
  | 'Under Active Investigation'
  | 'Review Complete - High Confidence'
  | 'Review Complete - Candidate Dismissed';

export type RiskTier = 'High' | 'Medium' | 'Low';

export interface LocationRecord {
  city: string;
  state: string;
  count: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface IdentifierSummary {
  type: 'Phone' | 'Username' | 'Account' | 'Email';
  value: string;
  firstSeen: string;
  lastSeen: string;
  adCount: number;
  rotationSequenceIndex?: number;
}

export interface AdvertisementRecord {
  id: string;
  adCode: string;
  sourceDomain: string;
  timestamp: string;
  title: string;
  rawText: string;
  location: {
    city: string;
    state: string;
    neighborhood?: string;
  };
  identifiers: {
    phone?: string;
    handle?: string;
    email?: string;
    account?: string;
  };
  imageHashes: string[];
  candidateScore: number;
  candidateOperationId: string;
  signalHighlights: string[];
  flaggedAnomaly?: string;
}

export interface Operation {
  id: string;
  code: string; // e.g. "OP-031"
  name: string;
  status: OperationalClusterStatus;
  candidateScore: number; // e.g. 0.87
  uncertaintyInterval: [number, number]; // [0.81, 0.92]
  recordCount: number; // 18 records
  locationCount: number; // 4 locations
  identifierCount: number; // 7 identifiers
  dateRange: {
    start: string;
    end: string;
  };
  riskTier: RiskTier;
  tags: string[];
  summary: string;
  primaryHypothesis: string;
  contradictionsCount: number;
  investigatorReviewStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ESCALATED';
  lastActivity: string;
  locations: LocationRecord[];
  identifiers: IdentifierSummary[];
  ads: AdvertisementRecord[];
  signalBreakdown: {
    textSimilarity: number;
    visualSimilarity: number;
    identifierSimilarity: number;
    temporalSimilarity: number;
    behavioralSimilarity: number;
    graphContext: number;
  };
}
