export type NodeType = 
  | 'operation' 
  | 'advertisement' 
  | 'phone' 
  | 'username' 
  | 'email'
  | 'account'
  | 'image' 
  | 'location' 
  | 'time';

export type EdgeRelationshipType =
  | 'uses'
  | 'similar_to'
  | 'posted_from'
  | 'posted_at'
  | 'appears_with'
  | 'temporally_related'
  | 'behaviorally_similar'
  | 'possibly_same_entity'
  | 'supports'
  | 'USES_IDENTIFIER'
  | 'POSTED_FROM'
  | 'ASSOCIATED_WITH'
  | 'SIMILAR_IMAGE'
  | 'TEMPORAL_COOCCURRENCE'
  | 'BEHAVIORAL_MATCH';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  subType?: string;
  firstSeen?: string;
  lastSeen?: string;
  riskScore?: number;
  flagged?: boolean;
  synthetic: boolean;
  metadata: {
    city?: string;
    state?: string;
    value?: string;
    carrier?: string;
    hash?: string;
    occurrences?: number;
    platform?: string;
    [key: string]: any;
  };
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: EdgeRelationshipType;
  confidenceScore: number; // 0.0 to 1.0
  signals: {
    textSim: number;
    visualSim: number;
    identifierSim: number;
    temporalSim: number;
    behavioralSim: number;
    graphContext: number;
  };
  contradictions?: string[];
  reviewStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ESCALATED';
  evidenceSnippet?: string;
}

export interface GraphData {
  operationCode: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
