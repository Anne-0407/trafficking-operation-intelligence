import { DriftSimulationStep, MetricComparison, BenchmarkDatasetResult } from '../types';

export const MOCK_DRIFT_SIMULATION_STEPS: DriftSimulationStep[] = [
  {
    stepNumber: 1,
    monthLabel: 'Month 1 (Nov 2025)',
    timestamp: '2025-11-15T00:00:00Z',
    controlledChange: 'Initial Cluster Activity in Dallas with +1 (214) Phone & @vip_luxe_tx Username',
    adversaryAction: 'Initial Cluster Activity in Dallas with +1 (214) Phone & @vip_luxe_tx Username',
    changeType: 'IDENTIFIER_ROTATION',
    evasionType: 'IDENTIFIER_ROTATION',
    rawEventDetails: '5 synthetic ads posted in Dallas using phone +1 (214) 555-0184 and synthetic account reference 0x71C8...4F9B.',
    baseline: {
      clusterStatus: 'CONNECTED',
      detectedAdsInCluster: 5,
      totalActiveAds: 5,
      attributionScore: 0.94,
      lossReason: 'Direct single-identifier exact matching works on initial single-batch data.'
    },
    proposed: {
      clusterStatus: 'CONNECTED',
      detectedAdsInCluster: 5,
      totalActiveAds: 5,
      attributionScore: 0.94,
      inferredBridgeMechanism: 'Multi-signal anchor established (visual similarity + account reference + template similarity).',
      preservedCohesionScore: 0.96
    }
  },
  {
    stepNumber: 2,
    monthLabel: 'Month 2 (Dec 2025)',
    timestamp: '2025-12-15T00:00:00Z',
    controlledChange: 'Controlled Change 1: Phone Rotates to +1 (713) with Houston Location Shift',
    adversaryAction: 'Controlled Change 1: Phone Rotates to +1 (713) with Houston Location Shift',
    changeType: 'CROSS_CITY_MIGRATION',
    evasionType: 'CROSS_CITY_MIGRATION',
    rawEventDetails: 'Phone +1-214 is retired; new ads appear in Houston with phone +1-713 and identical visual image hashes.',
    baseline: {
      clusterStatus: 'FRAGMENTED',
      detectedAdsInCluster: 5,
      totalActiveAds: 10,
      attributionScore: 0.48,
      lossReason: 'BASELINE FRAGMENTATION: Direct phone exact-match splits Houston ads into a disconnected new cluster "OP-NEW-092". Lost 50% cluster recall.'
    },
    proposed: {
      clusterStatus: 'INTACT_CHANGE_AWARE',
      detectedAdsInCluster: 10,
      totalActiveAds: 10,
      attributionScore: 0.91,
      inferredBridgeMechanism: 'Change-Aware graph linked +1-214 and +1-713 via persistent username @vip_luxe_tx and identical visual image pHash.',
      preservedCohesionScore: 0.93
    }
  },
  {
    stepNumber: 3,
    monthLabel: 'Month 3 (Jan 2026)',
    timestamp: '2026-01-15T00:00:00Z',
    controlledChange: 'Controlled Change 2: Dual Rotation to +1 (512) and @lonestar_concierge99 in Austin',
    adversaryAction: 'Controlled Change 2: Dual Rotation to +1 (512) and @lonestar_concierge99 in Austin',
    changeType: 'COMBINED_MULTI_PIVOT',
    evasionType: 'COMBINED_MULTI_PIVOT',
    rawEventDetails: 'Both contact phone AND username rotate simultaneously during Austin deployment.',
    baseline: {
      clusterStatus: 'DISCONNECTED',
      detectedAdsInCluster: 5,
      totalActiveAds: 14,
      attributionScore: 0.21,
      lossReason: 'BASELINE DISCONNECTION: Static baseline creates 3 isolated clusters. Fails to associate Austin ads with candidate operational cluster.'
    },
    proposed: {
      clusterStatus: 'BRIDGE_DISCOVERED',
      detectedAdsInCluster: 14,
      totalActiveAds: 14,
      attributionScore: 0.89,
      inferredBridgeMechanism: 'Handover transition reference in Ad-010 + synthetic account reference + visual pHash preserved cluster continuity.',
      preservedCohesionScore: 0.88
    }
  },
  {
    stepNumber: 4,
    monthLabel: 'Month 4 (Feb 2026)',
    timestamp: '2026-02-26T00:00:00Z',
    controlledChange: 'Multi-Location Expansion: Synchronized Availability across Austin & San Antonio',
    adversaryAction: 'Multi-Location Expansion: Synchronized Availability across Austin & San Antonio',
    changeType: 'TEXT_OBFUSCATION',
    evasionType: 'TEXT_OBFUSCATION',
    rawEventDetails: 'Text variations introduced ("D!screet", "V*I*P") with cross-city availability in San Antonio.',
    baseline: {
      clusterStatus: 'DISCONNECTED',
      detectedAdsInCluster: 5,
      totalActiveAds: 18,
      attributionScore: 0.17,
      lossReason: 'Static direct matching fails to associate cross-city candidate operation (Detected 5/18 ads; 27% recall).'
    },
    proposed: {
      clusterStatus: 'INTACT_CHANGE_AWARE',
      detectedAdsInCluster: 18,
      totalActiveAds: 18,
      attributionScore: 0.87,
      inferredBridgeMechanism: 'Proposed Change-Aware Graph connects 18/18 synthetic ads across 4 cities, 3 phone numbers, and 2 usernames (100% candidate recall).',
      preservedCohesionScore: 0.87
    }
  }
];

export const MOCK_METRIC_COMPARISONS: MetricComparison[] = [
  {
    metric: 'Cluster Attribution Recall (Controlled Changes)',
    baselineScore: 0.278,
    proposedScore: 1.000,
    deltaPercent: '+259.7%',
    unit: 'Recall Rate',
    description: 'Proportion of ground-truth synthetic ads belonging to the candidate cluster successfully linked.'
  },
  {
    metric: 'Attribution Precision (False Positive Rejection)',
    baselineScore: 0.842,
    proposedScore: 0.941,
    deltaPercent: '+11.8%',
    unit: 'Precision Rate',
    description: 'Accuracy of candidate links while rejecting opportunistic copycat/scraper ad false positives.'
  },
  {
    metric: 'Synthetic Benchmark F1-Score (Prototype Benchmark)',
    baselineScore: 0.418,
    proposedScore: 0.969,
    deltaPercent: '+131.8%',
    unit: 'F1 Score',
    description: 'Harmonic mean of precision and recall on synthetic multi-pivot benchmark dataset (1,450 synthetic records).'
  },
  {
    metric: 'Controlled Identifier Pivot Detection Lag',
    baselineScore: 24.5,
    proposedScore: 1.2,
    deltaPercent: '-95.1%',
    unit: 'Days to Detect',
    description: 'Average days elapsed before a rotated identifier is correctly attributed to the existing candidate cluster.'
  },
  {
    metric: 'Cluster Fragmentation Index',
    baselineScore: 3.8,
    proposedScore: 1.0,
    deltaPercent: '-73.7%',
    unit: 'Clusters per Operation',
    description: 'Average number of fragmented clusters created per single candidate operational group (lower is better; 1.0 is ideal).'
  }
];

export const MOCK_BENCHMARK_DATASETS: BenchmarkDatasetResult[] = [
  {
    datasetName: 'Synthetic Benchmark Suite A: Phone Identifier Rotation',
    sampleSize: 450,
    evasionTypesTested: ['Phone Number Rotation', 'Area Code Shifting'],
    precision: { baseline: 0.86, proposed: 0.95 },
    recall: { baseline: 0.38, proposed: 0.98 },
    f1Score: { baseline: 0.53, proposed: 0.96 },
    detectionLagDays: { baseline: 18.2, proposed: 0.8 },
    clusterPurity: { baseline: 0.72, proposed: 0.94 }
  },
  {
    datasetName: 'Synthetic Benchmark Suite B: Multi-Channel Username Migration',
    sampleSize: 320,
    evasionTypesTested: ['Messaging Username Handover', 'Template Variations'],
    precision: { baseline: 0.81, proposed: 0.93 },
    recall: { baseline: 0.29, proposed: 0.94 },
    f1Score: { baseline: 0.43, proposed: 0.93 },
    detectionLagDays: { baseline: 22.0, proposed: 1.4 },
    clusterPurity: { baseline: 0.68, proposed: 0.91 }
  },
  {
    datasetName: 'Synthetic Benchmark Suite C: Multi-Location Candidate Clusters',
    sampleSize: 680,
    evasionTypesTested: ['Multi-City Availability', 'Image Perturbation & Filtering', 'Account Reference Continuity'],
    precision: { baseline: 0.88, proposed: 0.96 },
    recall: { baseline: 0.24, proposed: 0.97 },
    f1Score: { baseline: 0.38, proposed: 0.96 },
    detectionLagDays: { baseline: 31.5, proposed: 1.1 },
    clusterPurity: { baseline: 0.65, proposed: 0.95 }
  }
];
