"""
Section 7/8: compare three approaches against ground truth, on BOTH the
original dataset and the changed (evasion-simulated) dataset:
  1. exact_identifier baseline
  2. text_only baseline
  3. proposed combined approach (features + scoring + graph_context)

Ground truth relationship = any pair of records sharing the same
non-noise operation_id (OP-031, OP-002, OP-003). NOISE-* ids are unique
per record, so they never form a ground-truth pair (true negatives).
"""
import itertools

import pandas as pd

from config import BASELINE_TEXT_ONLY_THRESHOLD, GRAPH_EDGE_THRESHOLD


def ground_truth_pairs(df) -> set:
    pairs = set()
    by_op = {}
    for _, r in df.iterrows():
        if r["operation_id"] and not r["operation_id"].startswith("NOISE"):
            by_op.setdefault(r["operation_id"], []).append(r["ad_id"])
    for members in by_op.values():
        for a, b in itertools.combinations(sorted(members), 2):
            pairs.add((a, b))
    return pairs


def _prf(predicted: set, truth: set, universe_size: int):
    tp = len(predicted & truth)
    fp = len(predicted - truth)
    fn = len(truth - predicted)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
    return {
        "known_relationships_total": len(truth),
        "known_relationships_recovered": tp,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "false_positives": fp,
    }


def evaluate_dataset(df: pd.DataFrame, pairs_df: pd.DataFrame, scored_pairs: pd.DataFrame) -> dict:
    truth = ground_truth_pairs(df)

    exact_id_pred = {
        (r["source"], r["target"]) for _, r in pairs_df.iterrows() if r["identifier"] >= 0.95
    }
    text_only_pred = {
        (r["source"], r["target"]) for _, r in pairs_df.iterrows()
        if r["text"] >= BASELINE_TEXT_ONLY_THRESHOLD
    }
    combined_pred = {
        (r["source"], r["target"]) for _, r in scored_pairs.iterrows()
        if r["score"] >= GRAPH_EDGE_THRESHOLD
    }

    n = len(df)
    return {
        "exact_identifier_baseline": _prf(exact_id_pred, truth, n),
        "text_only_baseline": _prf(text_only_pred, truth, n),
        "proposed_combined_approach": _prf(combined_pred, truth, n),
    }
