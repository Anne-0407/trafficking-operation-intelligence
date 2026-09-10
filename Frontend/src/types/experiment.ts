export type ControlledChangeType = 
  | 'IDENTIFIER_ROTATION'
  | 'CROSS_CITY_MIGRATION'
  | 'TEXT_OBFUSCATION'
  | 'COMBINED_MULTI_PIVOT';

export type AdversaryEvasionType = ControlledChangeType;

export interface DriftSimulationStep {
  stepNumber: number;
  monthLabel: string;
  timestamp: string;
  controlledChange: string;
  adversaryAction?: string;
  changeType: ControlledChangeType;
  evasionType?: ControlledChangeType;
  rawEventDetails: string;
  
  // Baseline attribution performance (Static Rule/Direct Match)
  baseline: {
    clusterStatus: 'FRAGMENTED' | 'DISCONNECTED' | 'PARTIAL' | 'CONNECTED';
    detectedAdsInCluster: number;
    totalActiveAds: number;
    attributionScore: number;
    lossReason: string;
  };
  
  // Proposed Change-Aware Temporal Graph Engine performance
  proposed: {
    clusterStatus: 'INTACT_CHANGE_AWARE' | 'BRIDGE_DISCOVERED' | 'CONNECTED';
    detectedAdsInCluster: number;
    totalActiveAds: number;
    attributionScore: number;
    inferredBridgeMechanism: string;
    preservedCohesionScore: number;
  };
}

export interface MetricComparison {
  metric: string;
  baselineScore: number;
  proposedScore: number;
  deltaPercent: string;
  unit: string;
  description: string;
}

export interface BenchmarkDatasetResult {
  datasetName: string;
  sampleSize: number;
  evasionTypesTested: string[];
  precision: {
    baseline: number;
    proposed: number;
  };
  recall: {
    baseline: number;
    proposed: number;
  };
  f1Score: {
    baseline: number;
    proposed: number;
  };
  detectionLagDays: {
    baseline: number;
    proposed: number;
  };
  clusterPurity: {
    baseline: number;
    proposed: number;
  };
}
