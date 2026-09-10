import { TimelineEvent, TimelinePhase } from '../types';

export const MOCK_TIMELINE_PHASES: TimelinePhase[] = [
  {
    phaseNumber: 1,
    name: 'Phase 1: Dallas Metropolitan Area',
    dateRange: 'Nov 03, 2025 – Nov 28, 2025',
    primaryLocation: 'Dallas, TX (Uptown / Downtown / Medical District)',
    activeIdentifiers: ['+1 (214) 555-0184', '@vip_luxe_tx', '0x71C8...4F9B'],
    adCount: 5,
    operationalBehavior: 'Initial candidate cluster activity using +1 (214) phone identifier. Regular 5-day ad posting cadence targeting upscale business hotel districts.'
  },
  {
    phaseNumber: 2,
    name: 'Phase 2: Houston Migration & Phone Rotation',
    dateRange: 'Dec 02, 2025 – Dec 30, 2025',
    primaryLocation: 'Houston, TX (Galleria / River Oaks / Energy Corridor)',
    activeIdentifiers: ['+1 (713) 555-0829', '@vip_luxe_tx', '0x71C8...4F9B'],
    adCount: 5,
    operationalBehavior: 'First observed identifier pivot: Phone rotated to +1 (713) while preserving @vip_luxe_tx username and common account identifier.'
  },
  {
    phaseNumber: 3,
    name: 'Phase 3: Austin Capital Region & Username Pivot',
    dateRange: 'Jan 05, 2026 – Feb 01, 2026',
    primaryLocation: 'Austin, TX (Downtown / The Domain / South Congress)',
    activeIdentifiers: ['+1 (512) 555-0371', '@lonestar_concierge99', '0x71C8...4F9B'],
    adCount: 4,
    operationalBehavior: 'Dual pivot observed: Phone shifted to +1 (512) and username rotated following Ad-010 handover announcement.'
  },
  {
    phaseNumber: 4,
    name: 'Phase 4: San Antonio Expansion & Corridor Continuity',
    dateRange: 'Feb 08, 2026 – Feb 26, 2026',
    primaryLocation: 'San Antonio, TX (Riverwalk / Stone Oak / Medical Center)',
    activeIdentifiers: ['+1 (512) 555-0371', '@lonestar_concierge99', '0x71C8...4F9B'],
    adCount: 4,
    operationalBehavior: 'Multi-location availability operating between Austin and San Antonio maintaining single active contact line.'
  }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  // Phase 1: Dallas
  {
    id: 'evt-001',
    timestamp: '2025-11-03T10:14:00Z',
    lane: 'GEO_MIGRATION',
    title: 'Cluster Inception: Dallas, TX',
    description: 'First identified synthetic ad cluster activity in Dallas Uptown area.',
    entityId: 'loc-dallas',
    entityLabel: 'Dallas, TX',
    location: { city: 'Dallas', state: 'TX' },
    adIds: ['ad-001'],
    candidateScore: 0.94,
    rawAdSnippet: 'New in Uptown Dallas ✨ 100% Independent & Discreet. Contact: (214) 555-0184'
  },
  {
    id: 'evt-002',
    timestamp: '2025-11-03T10:14:00Z',
    lane: 'PHONE_ROTATION',
    title: 'Primary Phone Activated (+1 214)',
    description: 'Phone identifier +1 (214) 555-0184 advertised across initial batch.',
    entityId: 'phone-214',
    entityLabel: '+1 (214) 555-0184',
    adIds: ['ad-001', 'ad-002', 'ad-003', 'ad-004', 'ad-005'],
    candidateScore: 0.92
  },
  {
    id: 'evt-003',
    timestamp: '2025-11-03T10:14:00Z',
    lane: 'PAYMENT_CRYPTO',
    title: 'Account Identifier Observed (0x71C8...4F9B)',
    description: 'Verification deposit reference address 0x71C8...4F9B published in ad texts.',
    entityId: 'crypto-usdt',
    entityLabel: '0x71C8...4F9B',
    adIds: ['ad-001', 'ad-003', 'ad-005'],
    candidateScore: 0.97
  },
  {
    id: 'evt-004',
    timestamp: '2025-11-14T18:45:00Z',
    lane: 'AD_BURST',
    title: 'Mid-Month Dallas Ad Campaign',
    description: 'Coordinated ads published across classifieds-alpha and portal-beta.',
    entityId: 'ad-003',
    entityLabel: 'SYN-AD-003',
    location: { city: 'Dallas', state: 'TX' },
    adIds: ['ad-003', 'ad-004'],
    candidateScore: 0.91
  },
  {
    id: 'evt-005',
    timestamp: '2025-11-28T22:05:00Z',
    lane: 'GEO_MIGRATION',
    title: 'Dallas Deactivation Notice',
    description: 'Ad-005 posted travel departure notice: "Finishing Dallas tour. Moving south next week."',
    entityId: 'loc-dallas',
    entityLabel: 'Dallas → South Corridor',
    location: { city: 'Dallas', state: 'TX' },
    adIds: ['ad-005'],
    candidateScore: 0.90,
    isPivotPoint: true,
    pivotFrom: 'Dallas, TX',
    pivotTo: 'Houston, TX'
  },

  // Phase 2: Houston
  {
    id: 'evt-006',
    timestamp: '2025-12-02T11:20:00Z',
    lane: 'GEO_MIGRATION',
    title: 'Houston Operation Commences',
    description: 'First ads active in Houston Galleria district 96 hours after Dallas deactivation.',
    entityId: 'loc-houston',
    entityLabel: 'Houston, TX',
    location: { city: 'Houston', state: 'TX' },
    adIds: ['ad-006'],
    candidateScore: 0.95
  },
  {
    id: 'evt-007',
    timestamp: '2025-12-02T11:20:00Z',
    lane: 'PHONE_ROTATION',
    title: 'Controlled Pivot 1: Phone Rotation (+1 713)',
    description: 'Phone identifier +1 (713) 555-0829 replaces +1 (214). Username & account reference remain constant.',
    entityId: 'phone-713',
    entityLabel: '+1 (713) 555-0829',
    adIds: ['ad-006', 'ad-007', 'ad-008', 'ad-009', 'ad-010'],
    candidateScore: 0.94,
    isPivotPoint: true,
    pivotFrom: '+1 (214) 555-0184',
    pivotTo: '+1 (713) 555-0829'
  },
  {
    id: 'evt-008',
    timestamp: '2025-12-22T08:35:00Z',
    lane: 'AD_BURST',
    title: 'Houston Energy Corridor Ad',
    description: 'Ad-009 published with proxy routing and unique email handle (Anomaly Flagged).',
    entityId: 'ad-009',
    entityLabel: 'SYN-AD-009',
    location: { city: 'Houston', state: 'TX' },
    adIds: ['ad-009'],
    candidateScore: 0.81
  },
  {
    id: 'evt-009',
    timestamp: '2025-12-30T17:15:00Z',
    lane: 'HANDLE_PIVOT',
    title: 'Username Handover Announcement',
    description: 'Ad-010 explicitly announces username transition: "@vip_luxe_tx shifting to @lonestar_concierge99 soon".',
    entityId: 'handle-lonestar',
    entityLabel: '@lonestar_concierge99',
    location: { city: 'Houston', state: 'TX' },
    adIds: ['ad-010'],
    candidateScore: 0.94,
    isPivotPoint: true,
    pivotFrom: '@vip_luxe_tx',
    pivotTo: '@lonestar_concierge99'
  },

  // Phase 3: Austin
  {
    id: 'evt-010',
    timestamp: '2026-01-05T12:00:00Z',
    lane: 'GEO_MIGRATION',
    title: 'Austin Operation Commences',
    description: 'Initial deployment in Downtown Austin high-rise suites.',
    entityId: 'loc-austin',
    entityLabel: 'Austin, TX',
    location: { city: 'Austin', state: 'TX' },
    adIds: ['ad-011'],
    candidateScore: 0.96
  },
  {
    id: 'evt-011',
    timestamp: '2026-01-05T12:00:00Z',
    lane: 'PHONE_ROTATION',
    title: 'Controlled Pivot 2: Phone Rotation (+1 512)',
    description: 'Phone identifier +1 (512) 555-0371 activated alongside new @lonestar_concierge99 username.',
    entityId: 'phone-512',
    entityLabel: '+1 (512) 555-0371',
    adIds: ['ad-011', 'ad-012', 'ad-013', 'ad-014', 'ad-015', 'ad-016', 'ad-017', 'ad-018'],
    candidateScore: 0.95,
    isPivotPoint: true,
    pivotFrom: '+1 (713) 555-0829',
    pivotTo: '+1 (512) 555-0371'
  },

  // Phase 4: San Antonio & Corridor
  {
    id: 'evt-012',
    timestamp: '2026-02-08T13:30:00Z',
    lane: 'GEO_MIGRATION',
    title: 'Corridor Expansion: San Antonio Riverwalk',
    description: 'Ads expand to San Antonio Riverwalk while maintaining Austin +1-512 line.',
    entityId: 'loc-sanantonio',
    entityLabel: 'San Antonio, TX',
    location: { city: 'San Antonio', state: 'TX' },
    adIds: ['ad-015', 'ad-016', 'ad-017', 'ad-018'],
    candidateScore: 0.95
  },
  {
    id: 'evt-013',
    timestamp: '2026-02-26T14:22:00Z',
    lane: 'AD_BURST',
    title: 'Latest Active Ad Burst (Dual-City)',
    description: 'Ad-018 published offering synchronized appointments across Austin and San Antonio.',
    entityId: 'ad-018',
    entityLabel: 'SYN-AD-018',
    location: { city: 'San Antonio', state: 'TX' },
    adIds: ['ad-018'],
    candidateScore: 0.94
  }
];
