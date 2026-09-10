import { RelationshipEvidenceItem, SignalDimension, ContradictionRecord, AuditLogEntry } from '../types';

export const MOCK_SIGNALS_OP031: SignalDimension[] = [
  {
    id: 'sig-text',
    name: 'Semantic & Text Similarity',
    score: 0.91,
    weight: 0.20,
    contribution: 0.182,
    description: 'Semantic embedding alignment and structural template similarity across 18 synthetic ads.',
    technicalDetails: 'Dense embedding cosine distance (0.91) combined with syntactic structure reuse (opening emoji ✨, "100% Independent & Discreet" boilerplate, and identical screening disclaimers).',
    evidenceSnippets: [
      '“100% Independent & Discreet. Clean & safe. Strict screening.” (Appeared in 15 of 18 records)',
      '“Text now for verification... Deposit required via USDT” (Identical payment escrow call-to-action)'
    ]
  },
  {
    id: 'sig-visual',
    name: 'Visual Similarity',
    score: 0.88,
    weight: 0.20,
    contribution: 0.176,
    description: 'Perceptual image similarity across promotional images with crop and filter variations.',
    technicalDetails: '14 ads share pHash `e3a1-90c4` (Hamming distance ≤ 4). Horizontal mirror flipping, chromatic hue shift (+8%), and watermark cropping were detected by visual perceptual hashing.',
    evidenceSnippets: [
      'Image Hash `phash-e3a1-90c4` matched across Dallas, Houston, Austin, and San Antonio records.',
      'Image Hash `phash-7b22-11fa` co-occurred as secondary promo image across 9 records.'
    ]
  },
  {
    id: 'sig-ident',
    name: 'Identifier Similarity',
    score: 0.82,
    weight: 0.20,
    contribution: 0.164,
    description: 'Sequential contact identifier usage and transitional co-occurrence.',
    technicalDetails: 'Direct identifier matches inside each city phase (+1-214 in Dallas, +1-713 in Houston, +1-512 in Austin/SA). Bridge linkage identified in Ad-010 where both `@vip_luxe_tx` and `@lonestar_concierge99` were co-referenced during handover.',
    evidenceSnippets: [
      'Continuous account identifier `0x71C8...4F9B` present across 14 ads.',
      'Sequential phone identifier timeline: Dallas (Nov) → Houston (Dec) → Austin / San Antonio (Jan-Feb).'
    ]
  },
  {
    id: 'sig-temp',
    name: 'Temporal Similarity',
    score: 0.84,
    weight: 0.15,
    contribution: 0.126,
    description: 'Inter-ad interval cadence and sequential city-to-city active time windows.',
    technicalDetails: 'Posting frequency shows uniform 3-5 day cadence. Zero temporal overlap during inter-city migrations: Dallas ads halted Nov 28, Houston activated Dec 02; Houston halted Dec 30, Austin activated Jan 05.',
    evidenceSnippets: [
      'Strict non-overlapping sequential bursts consistent with a single coordinated candidate operation.',
      'Synchronized weekend promotion bumps at 18:00 - 22:00 CST across all 4 target cities.'
    ]
  },
  {
    id: 'sig-behav',
    name: 'Behavioural Similarity',
    score: 0.89,
    weight: 0.15,
    contribution: 0.134,
    description: 'Operational booking workflows, pricing format syntax, and screening steps.',
    technicalDetails: 'Identical client screening workflow ("Strict screening / No unverified calls / Deposit required before address release"). Pricing format syntax and booking phrasing are identical.',
    evidenceSnippets: [
      'Consistent pre-booking verification workflow referencing synthetic account.',
      'Identical punctuation style (double sparkles ✨ and bullet bar delimiters |).'
    ]
  },
  {
    id: 'sig-graph',
    name: 'Graph Context',
    score: 0.82,
    weight: 0.10,
    contribution: 0.082,
    description: 'Bipartite graph Jaccard similarity and common 2-hop neighborhood density.',
    technicalDetails: 'High graph centrality clustering around account node `0x71C8...4F9B` and image cluster `phash-e3a1-90c4`. Graph modularity score confirms strong single-cluster cohesion.',
    evidenceSnippets: [
      '2-hop graph connectivity score 0.82 across all 18 synthetic ad records.',
      'No peripheral bridging to unrelated synthetic baseline clusters.'
    ]
  }
];

export const MOCK_CONTRADICTIONS_OP031: ContradictionRecord[] = [
  {
    id: 'contra-001',
    severity: 'MEDIUM',
    title: 'Conflicting Contact Email on Record SYN-AD-014',
    description: 'SYN-AD-014 (Austin, Feb 01) introduced a disposable email handle `booking_tx_south@anonmail.net` not observed in any preceding or subsequent ads.',
    penaltyApplied: -0.05,
    affectedEntities: ['SYN-AD-014', 'loc-austin'],
    investigatorGuidance: 'Investigate whether SYN-AD-014 represents an unauthorized copycat/scraper ad reusing cluster photos or an auxiliary contact method.'
  },
  {
    id: 'contra-002',
    severity: 'LOW',
    title: 'Geographic Routing Discrepancy on SYN-AD-009',
    description: 'Ad posting telemetry for SYN-AD-009 recorded an egress proxy location in Virginia rather than Texas ISP.',
    penaltyApplied: -0.03,
    affectedEntities: ['SYN-AD-009', 'loc-houston'],
    investigatorGuidance: 'Consistent with commercial VPN or posting aggregator proxy usage; does not refute candidate cluster linkage.'
  }
];

export const MOCK_AUDIT_LOG_OP031: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-02-27T08:30:00Z',
    investigatorId: 'INV-77042 (Authorized Analyst)',
    action: 'NOTE_ADDED',
    notes: 'Initial automated candidate cluster generated by intelligence engine with candidate score 0.87 [0.81 - 0.92]. Flagged for human investigator review.'
  },
  {
    id: 'log-002',
    timestamp: '2026-02-27T09:15:00Z',
    investigatorId: 'INV-77042 (Authorized Analyst)',
    action: 'FLAGGED_ANOMALY',
    notes: 'Verified anomaly on Ad-014 email. Applied -0.05 confidence adjustment while maintaining cluster hypothesis due to shared account reference.'
  }
];

export const MOCK_RELATIONSHIP_EVIDENCE_ITEMS: RelationshipEvidenceItem[] = [
  {
    id: 'rel-001',
    candidateLinkCode: 'REL-TX-001 (Dallas → Houston Pivot)',
    sourceEntity: {
      id: 'phone-214',
      label: '+1 (214) 555-0184 (Dallas Phone)',
      type: 'Phone'
    },
    targetEntity: {
      id: 'phone-713',
      label: '+1 (713) 555-0829 (Houston Phone)',
      type: 'Phone'
    },
    candidateScore: 0.89,
    confidenceBand: [0.83, 0.94],
    reviewStatus: 'PENDING',
    signals: MOCK_SIGNALS_OP031,
    contradictions: [MOCK_CONTRADICTIONS_OP031[1]],
    auditTrail: MOCK_AUDIT_LOG_OP031,
    lastUpdated: '2026-02-27T09:15:00Z'
  },
  {
    id: 'rel-002',
    candidateLinkCode: 'REL-TX-002 (Houston → Austin Pivot)',
    sourceEntity: {
      id: 'handle-vipluxe',
      label: '@vip_luxe_tx (Username)',
      type: 'Username'
    },
    targetEntity: {
      id: 'handle-lonestar',
      label: '@lonestar_concierge99 (Username)',
      type: 'Username'
    },
    candidateScore: 0.94,
    confidenceBand: [0.90, 0.97],
    reviewStatus: 'PENDING',
    signals: MOCK_SIGNALS_OP031,
    contradictions: [],
    auditTrail: [],
    lastUpdated: '2026-02-27T08:30:00Z'
  },
  {
    id: 'rel-003',
    candidateLinkCode: 'REL-TX-003 (Account Reference Anchor)',
    sourceEntity: {
      id: 'crypto-usdt',
      label: '0x71C8...4F9B (Account)',
      type: 'Account'
    },
    targetEntity: {
      id: 'op-031',
      label: 'Candidate Cluster OP-031',
      type: 'Candidate Operation'
    },
    candidateScore: 0.97,
    confidenceBand: [0.94, 0.99],
    reviewStatus: 'ACCEPTED',
    signals: MOCK_SIGNALS_OP031,
    contradictions: [],
    auditTrail: [
      {
        id: 'log-003',
        timestamp: '2026-02-27T09:40:00Z',
        investigatorId: 'INV-77042 (Authorized Analyst)',
        action: 'ACCEPTED',
        notes: 'Confirmed account identifier reference across 14 ad records spanning all 4 cities.'
      }
    ],
    lastUpdated: '2026-02-27T09:40:00Z'
  }
];
