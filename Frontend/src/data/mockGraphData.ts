import { GraphData, GraphNode, GraphEdge } from '../types';

export const MOCK_GRAPH_DATA: GraphData = {
  operationCode: 'OP-031',
  nodes: [
    // Central Operation Anchor
    {
      id: 'op-031',
      label: 'Candidate Cluster OP-031',
      type: 'operation',
      subType: 'Candidate Operational Cluster',
      riskScore: 0.87,
      synthetic: true,
      metadata: {
        totalRecords: 18,
        timeSpan: '115 Days (Nov 2025 - Feb 2026)',
        corridor: 'Dallas → Houston → Austin → San Antonio',
        score: '0.87 [0.81 - 0.92]'
      },
      x: 500,
      y: 350
    },

    // 4 Location Nodes
    {
      id: 'loc-dallas',
      label: 'Dallas, TX',
      type: 'location',
      synthetic: true,
      metadata: { state: 'TX', city: 'Dallas', occurrences: 5, timeRange: 'Nov 2025' },
      x: 220,
      y: 160
    },
    {
      id: 'loc-houston',
      label: 'Houston, TX',
      type: 'location',
      synthetic: true,
      metadata: { state: 'TX', city: 'Houston', occurrences: 5, timeRange: 'Dec 2025' },
      x: 780,
      y: 160
    },
    {
      id: 'loc-austin',
      label: 'Austin, TX',
      type: 'location',
      synthetic: true,
      metadata: { state: 'TX', city: 'Austin', occurrences: 4, timeRange: 'Jan 2026' },
      x: 220,
      y: 540
    },
    {
      id: 'loc-sanantonio',
      label: 'San Antonio, TX',
      type: 'location',
      synthetic: true,
      metadata: { state: 'TX', city: 'San Antonio', occurrences: 4, timeRange: 'Feb 2026' },
      x: 780,
      y: 540
    },

    // 3 Phone Nodes (rotational sequence)
    {
      id: 'phone-214',
      label: '+1 (214) 555-0184',
      type: 'phone',
      subType: 'Synthetic Phone Identifier',
      firstSeen: '2025-11-03',
      lastSeen: '2025-11-28',
      riskScore: 0.92,
      synthetic: true,
      metadata: { carrier: 'Synthetic Phone', adsCount: 5, activePhase: 'Phase 1: Dallas' },
      x: 320,
      y: 220
    },
    {
      id: 'phone-713',
      label: '+1 (713) 555-0829',
      type: 'phone',
      subType: 'Synthetic Phone Identifier',
      firstSeen: '2025-12-02',
      lastSeen: '2025-12-30',
      riskScore: 0.94,
      synthetic: true,
      metadata: { carrier: 'Synthetic Phone', adsCount: 5, activePhase: 'Phase 2: Houston' },
      x: 680,
      y: 220
    },
    {
      id: 'phone-512',
      label: '+1 (512) 555-0371',
      type: 'phone',
      subType: 'Synthetic Phone Identifier',
      firstSeen: '2026-01-05',
      lastSeen: '2026-02-26',
      riskScore: 0.95,
      synthetic: true,
      metadata: { carrier: 'Synthetic Phone', adsCount: 8, activePhase: 'Phase 3 & 4: Austin & SA' },
      x: 500,
      y: 580
    },

    // 2 Usernames
    {
      id: 'handle-vipluxe',
      label: '@vip_luxe_tx',
      type: 'username',
      subType: 'Synthetic Username Identifier',
      firstSeen: '2025-11-03',
      lastSeen: '2025-12-30',
      riskScore: 0.91,
      synthetic: true,
      metadata: { platform: 'Messaging Platform', adsCount: 8, linkedPhases: 'Dallas & Houston' },
      x: 500,
      y: 140
    },
    {
      id: 'handle-lonestar',
      label: '@lonestar_concierge99',
      type: 'username',
      subType: 'Synthetic Username Identifier',
      firstSeen: '2026-01-02',
      lastSeen: '2026-02-26',
      riskScore: 0.93,
      synthetic: true,
      metadata: { platform: 'Messaging Platform', adsCount: 10, linkedPhases: 'Austin & San Antonio' },
      x: 500,
      y: 460
    },

    // Account Deposit Reference
    {
      id: 'crypto-usdt',
      label: '0x71C8...4F9B (Account)',
      type: 'account',
      subType: 'Synthetic Account Identifier',
      riskScore: 0.97,
      synthetic: true,
      metadata: { network: 'Synthetic Account', occurrences: 14, function: 'Verification Reference' },
      x: 500,
      y: 260
    },

    // Image Hashes
    {
      id: 'img-phash-e3a1',
      label: 'pHash-e3a1-90c4',
      type: 'image',
      subType: 'Synthetic Visual Hash (14 ads)',
      riskScore: 0.90,
      synthetic: true,
      metadata: { matchCount: 14, visualDistance: '0.04 (Near Exact)', perturbation: 'Watermark crop & color balance shift' },
      x: 350,
      y: 350
    },
    {
      id: 'img-phash-7b22',
      label: 'pHash-7b22-11fa',
      type: 'image',
      subType: 'Synthetic Visual Hash (9 ads)',
      riskScore: 0.88,
      synthetic: true,
      metadata: { matchCount: 9, visualDistance: '0.06 (Strong Match)', perturbation: 'Mirror flipped & filter applied' },
      x: 650,
      y: 350
    },

    // Key Sample Synthetic Ad Nodes
    {
      id: 'ad-001',
      label: 'SYN-AD-001 (Dallas)',
      type: 'advertisement',
      firstSeen: '2025-11-03',
      riskScore: 0.94,
      synthetic: true,
      metadata: { city: 'Dallas', score: 0.94, phone: '+1 (214) 555-0184', handle: '@vip_luxe_tx' },
      x: 180,
      y: 260
    },
    {
      id: 'ad-005',
      label: 'SYN-AD-005 (Dallas End)',
      type: 'advertisement',
      firstSeen: '2025-11-28',
      riskScore: 0.90,
      synthetic: true,
      metadata: { city: 'Dallas', score: 0.90, phone: '+1 (214) 555-0184' },
      x: 240,
      y: 320
    },
    {
      id: 'ad-006',
      label: 'SYN-AD-006 (Houston Start)',
      type: 'advertisement',
      firstSeen: '2025-12-02',
      riskScore: 0.95,
      synthetic: true,
      metadata: { city: 'Houston', score: 0.95, phone: '+1 (713) 555-0829', handle: '@vip_luxe_tx' },
      x: 760,
      y: 260
    },
    {
      id: 'ad-010',
      label: 'SYN-AD-010 (Houston Pivot)',
      type: 'advertisement',
      firstSeen: '2025-12-30',
      riskScore: 0.94,
      synthetic: true,
      metadata: { city: 'Houston', score: 0.94, phone: '+1 (713) 555-0829', handle: '@vip_luxe_tx' },
      x: 820,
      y: 320
    },
    {
      id: 'ad-011',
      label: 'SYN-AD-011 (Austin Start)',
      type: 'advertisement',
      firstSeen: '2026-01-05',
      riskScore: 0.96,
      synthetic: true,
      metadata: { city: 'Austin', score: 0.96, phone: '+1 (512) 555-0371', handle: '@lonestar_concierge99' },
      x: 240,
      y: 440
    },
    {
      id: 'ad-014',
      label: 'SYN-AD-014 (Austin Anomaly)',
      type: 'advertisement',
      firstSeen: '2026-02-01',
      riskScore: 0.79,
      flagged: true,
      synthetic: true,
      metadata: { city: 'Austin', score: 0.79, anomaly: 'Conflicting contact email reported' },
      x: 180,
      y: 500
    },
    {
      id: 'ad-015',
      label: 'SYN-AD-015 (San Antonio)',
      type: 'advertisement',
      firstSeen: '2026-02-08',
      riskScore: 0.95,
      synthetic: true,
      metadata: { city: 'San Antonio', score: 0.95, phone: '+1 (512) 555-0371', handle: '@lonestar_concierge99' },
      x: 760,
      y: 440
    },
    {
      id: 'ad-018',
      label: 'SYN-AD-018 (SA / Latest)',
      type: 'advertisement',
      firstSeen: '2026-02-26',
      riskScore: 0.94,
      synthetic: true,
      metadata: { city: 'San Antonio', score: 0.94, phone: '+1 (512) 555-0371', handle: '@lonestar_concierge99' },
      x: 820,
      y: 500
    }
  ],
  edges: [
    // Op Cluster Links
    {
      id: 'e-op-phone214',
      source: 'op-031',
      target: 'phone-214',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.92,
      signals: { textSim: 0.90, visualSim: 0.88, identifierSim: 1.0, temporalSim: 0.85, behavioralSim: 0.90, graphContext: 0.88 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-phone713',
      source: 'op-031',
      target: 'phone-713',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.94,
      signals: { textSim: 0.92, visualSim: 0.89, identifierSim: 1.0, temporalSim: 0.86, behavioralSim: 0.92, graphContext: 0.90 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-phone512',
      source: 'op-031',
      target: 'phone-512',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.95,
      signals: { textSim: 0.93, visualSim: 0.90, identifierSim: 1.0, temporalSim: 0.89, behavioralSim: 0.93, graphContext: 0.92 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-handle1',
      source: 'op-031',
      target: 'handle-vipluxe',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.91,
      signals: { textSim: 0.91, visualSim: 0.87, identifierSim: 1.0, temporalSim: 0.84, behavioralSim: 0.88, graphContext: 0.85 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-handle2',
      source: 'op-031',
      target: 'handle-lonestar',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.93,
      signals: { textSim: 0.92, visualSim: 0.89, identifierSim: 1.0, temporalSim: 0.88, behavioralSim: 0.91, graphContext: 0.87 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-crypto',
      source: 'op-031',
      target: 'crypto-usdt',
      relationshipType: 'ASSOCIATED_WITH',
      confidenceScore: 0.97,
      signals: { textSim: 0.94, visualSim: 0.92, identifierSim: 1.0, temporalSim: 0.95, behavioralSim: 0.96, graphContext: 0.98 },
      reviewStatus: 'ACCEPTED',
      evidenceSnippet: 'Single continuous ERC-20 USDT deposit address used across all 4 operational phases from Nov 2025 to Feb 2026.'
    },
    {
      id: 'e-op-img1',
      source: 'op-031',
      target: 'img-phash-e3a1',
      relationshipType: 'SIMILAR_IMAGE',
      confidenceScore: 0.90,
      signals: { textSim: 0.85, visualSim: 0.96, identifierSim: 0.80, temporalSim: 0.88, behavioralSim: 0.86, graphContext: 0.90 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-op-img2',
      source: 'op-031',
      target: 'img-phash-7b22',
      relationshipType: 'SIMILAR_IMAGE',
      confidenceScore: 0.88,
      signals: { textSim: 0.84, visualSim: 0.94, identifierSim: 0.78, temporalSim: 0.85, behavioralSim: 0.84, graphContext: 0.87 },
      reviewStatus: 'ACCEPTED'
    },

    // Cross-Entity Pivot Links
    {
      id: 'e-pivot-ph1-ph2',
      source: 'phone-214',
      target: 'phone-713',
      relationshipType: 'BEHAVIORAL_MATCH',
      confidenceScore: 0.89,
      signals: { textSim: 0.91, visualSim: 0.88, identifierSim: 0.75, temporalSim: 0.92, behavioralSim: 0.94, graphContext: 0.86 },
      reviewStatus: 'PENDING',
      evidenceSnippet: 'Phone 1 (+1 214) deactivated Nov 28; Phone 2 (+1 713) activated Dec 02 with identical Telegram handle @vip_luxe_tx and same USDT address.'
    },
    {
      id: 'e-pivot-ph2-ph3',
      source: 'phone-713',
      target: 'phone-512',
      relationshipType: 'BEHAVIORAL_MATCH',
      confidenceScore: 0.91,
      signals: { textSim: 0.92, visualSim: 0.89, identifierSim: 0.78, temporalSim: 0.94, behavioralSim: 0.93, graphContext: 0.88 },
      reviewStatus: 'PENDING',
      evidenceSnippet: 'Phone 2 deactivated Dec 30; Ad-010 explicitly signaled upcoming migration to Austin & handle rotation.'
    },
    {
      id: 'e-pivot-h1-h2',
      source: 'handle-vipluxe',
      target: 'handle-lonestar',
      relationshipType: 'ASSOCIATED_WITH',
      confidenceScore: 0.94,
      signals: { textSim: 0.93, visualSim: 0.91, identifierSim: 0.82, temporalSim: 0.95, behavioralSim: 0.94, graphContext: 0.92 },
      reviewStatus: 'PENDING',
      evidenceSnippet: 'SYN-AD-010 body explicitly listed both handles simultaneously during 48-hour handover window.'
    },

    // Ad to Identifier Links
    {
      id: 'e-ad001-ph214',
      source: 'ad-001',
      target: 'phone-214',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.95 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad001-h1',
      source: 'ad-001',
      target: 'handle-vipluxe',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.95 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad001-loc',
      source: 'ad-001',
      target: 'loc-dallas',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.95,
      signals: { textSim: 0.94, visualSim: 0.90, identifierSim: 0.95, temporalSim: 0.95, behavioralSim: 0.92, graphContext: 0.90 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad006-ph713',
      source: 'ad-006',
      target: 'phone-713',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.97, visualSim: 0.94, identifierSim: 1.0, temporalSim: 0.98, behavioralSim: 0.95, graphContext: 0.96 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad006-h1',
      source: 'ad-006',
      target: 'handle-vipluxe',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.98,
      signals: { textSim: 0.96, visualSim: 0.93, identifierSim: 1.0, temporalSim: 0.97, behavioralSim: 0.94, graphContext: 0.95 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad006-loc',
      source: 'ad-006',
      target: 'loc-houston',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.95,
      signals: { textSim: 0.95, visualSim: 0.91, identifierSim: 0.95, temporalSim: 0.95, behavioralSim: 0.93, graphContext: 0.91 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad011-ph512',
      source: 'ad-011',
      target: 'phone-512',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.97 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad011-h2',
      source: 'ad-011',
      target: 'handle-lonestar',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.97 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad011-loc',
      source: 'ad-011',
      target: 'loc-austin',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.95,
      signals: { textSim: 0.95, visualSim: 0.91, identifierSim: 0.95, temporalSim: 0.95, behavioralSim: 0.93, graphContext: 0.91 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad014-loc',
      source: 'ad-014',
      target: 'loc-austin',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.79,
      signals: { textSim: 0.78, visualSim: 0.85, identifierSim: 0.74, temporalSim: 0.80, behavioralSim: 0.75, graphContext: 0.81 },
      contradictions: ['Conflicting contact email reported on Ad-014; possible spoof or shared burner account.'],
      reviewStatus: 'PENDING'
    },
    {
      id: 'e-ad015-ph512',
      source: 'ad-015',
      target: 'phone-512',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.97 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad015-loc',
      source: 'ad-015',
      target: 'loc-sanantonio',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.95,
      signals: { textSim: 0.95, visualSim: 0.91, identifierSim: 0.95, temporalSim: 0.95, behavioralSim: 0.93, graphContext: 0.91 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad018-ph512',
      source: 'ad-018',
      target: 'phone-512',
      relationshipType: 'USES_IDENTIFIER',
      confidenceScore: 0.99,
      signals: { textSim: 0.98, visualSim: 0.95, identifierSim: 1.0, temporalSim: 0.99, behavioralSim: 0.96, graphContext: 0.97 },
      reviewStatus: 'ACCEPTED'
    },
    {
      id: 'e-ad018-loc',
      source: 'ad-018',
      target: 'loc-sanantonio',
      relationshipType: 'POSTED_FROM',
      confidenceScore: 0.95,
      signals: { textSim: 0.95, visualSim: 0.91, identifierSim: 0.95, temporalSim: 0.95, behavioralSim: 0.93, graphContext: 0.91 },
      reviewStatus: 'ACCEPTED'
    }
  ]
};
