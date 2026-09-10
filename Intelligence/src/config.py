"""
Central configuration for the intelligence engine prototype.

IMPORTANT: These are experimental prototype weights/thresholds chosen for a
48-hour demo. They are NOT validated, scientifically-tuned parameters.
Everything lives here so a single change propagates through scoring,
graph-building and evaluation.
"""

# Relationship-score weights (prototype formula from the work plan).
# Must sum to 1.0.
SIGNAL_WEIGHTS = {
    "text": 0.25,
    "visual": 0.20,
    "identifier": 0.15,
    "temporal": 0.15,
    "behaviour": 0.15,
    "graph_context": 0.10,
}

assert abs(sum(SIGNAL_WEIGHTS.values()) - 1.0) < 1e-9, "weights must sum to 1.0"

# Edge is kept in the working graph if combined score >= this.
# (Empirically, on this synthetic dataset, same-operation pairs score ~0.40-0.55
#  while unrelated pairs score ~0.10-0.25 on average -- see README "Threshold
#  selection" note. 0.42 gives ~0.83 precision / ~0.65 recall.)
GRAPH_EDGE_THRESHOLD = 0.42

# Edge is promoted to a strong "candidate operation" link if combined score >= this.
CLUSTER_EDGE_THRESHOLD = 0.46

# Edge is written out to evidence.json if combined score >= this.
EVIDENCE_THRESHOLD = 0.42

# Per-signal thresholds used only for generating human-readable evidence text.
EVIDENCE_SIGNAL_THRESHOLDS = {
    "text_high": 0.60,
    "identifier_exact": 0.95,
    "identifier_partial": 0.40,
    "temporal_high": 0.60,
    "behaviour_high": 0.60,
    "visual_high": 0.60,
    "low": 0.25,  # below this, a signal counts as a "contradiction"
}

# Baseline thresholds used only inside evaluate.py, kept separate from the
# proposed-approach thresholds above so baselines aren't unfairly handicapped.
BASELINE_TEXT_ONLY_THRESHOLD = 0.5

RANDOM_SEED = 42
