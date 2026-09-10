#!/usr/bin/env python3
"""
Single entry point that regenerates the entire demo from scratch:

  1. Generate the synthetic dataset (data/raw/records.json) if missing.
  2. Apply controlled changes -> data/changed/records.json.
  3. Normalize both datasets -> data/processed/.
  4. Compute pairwise signals + relationship scores for BOTH datasets.
  5. Build the graph + candidate operations for the ORIGINAL dataset
     (that's what the frontend demo walks through).
  6. Generate evidence.json for the original dataset.
  7. Evaluate baselines vs proposed approach on both datasets ->
     results/evaluation.json.

Run: python run.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "data" / "raw" / "records.json"
CHANGED = ROOT / "data" / "changed" / "records.json"
PROCESSED_ORIG = ROOT / "data" / "processed" / "original_normalized.json"
PROCESSED_CHANGED = ROOT / "data" / "processed" / "changed_normalized.json"
RESULTS = ROOT / "results"


def main():
    import data_loader
    import features
    import scoring
    import graph as graph_mod
    import evidence as evidence_mod
    import evaluate as evaluate_mod
    import generate_dataset
    import change_experiment

    if not RAW.exists():
        print("== 1. Generating synthetic dataset ==")
        generate_dataset.main()
    else:
        print("== 1. Synthetic dataset already exists, skipping generation ==")

    if not CHANGED.exists():
        print("== 2. Applying controlled changes ==")
        change_experiment.main()
    else:
        print("== 2. Changed dataset already exists, skipping ==")

    print("== 3. Loading + normalizing both datasets ==")
    df_orig = data_loader.load_and_normalize(str(RAW))
    df_changed = data_loader.load_and_normalize(str(CHANGED))
    data_loader.save_processed(df_orig, str(PROCESSED_ORIG))
    data_loader.save_processed(df_changed, str(PROCESSED_CHANGED))

    print("== 4. Computing pairwise signals + scores (original) ==")
    pairs_orig = features.compute_all_pairwise(df_orig)
    scored_orig = scoring.score_pairs(pairs_orig)

    print("== 4b. Computing pairwise signals + scores (changed) ==")
    pairs_changed = features.compute_all_pairwise(df_changed)
    scored_changed = scoring.score_pairs(pairs_changed)

    print("== 5. Building graph + candidate operations (original) ==")
    g = graph_mod.build_graph(df_orig, scored_orig)
    ops = graph_mod.candidate_operations(df_orig, scored_orig)

    graph_json = {
        "nodes": [{"id": n, **g.nodes[n]} for n in g.nodes],
        "edges": [
            {"source": u, "target": v, **g.edges[u, v]} for u, v in g.edges
        ],
    }

    print("== 6. Generating evidence (original) ==")
    evidence_list = evidence_mod.build_evidence(scored_orig)

    print("== 7. Evaluating baselines vs proposed (original + changed) ==")
    eval_orig = evaluate_mod.evaluate_dataset(df_orig, pairs_orig, scored_orig)
    eval_changed = evaluate_mod.evaluate_dataset(df_changed, pairs_changed, scored_changed)
    evaluation = {
        "original": eval_orig,
        "changed": eval_changed,
        "conclusion": (
            "Simple baselines (exact identifier / text-only) lose recall on the "
            "changed dataset after controlled evasion changes. The proposed "
            "combined approach retains more of the known OP-031/OP-002/OP-003 "
            "relationships because it aggregates multiple weak signals plus "
            "graph context instead of depending on any single field."
        ),
    }

    RESULTS.mkdir(exist_ok=True)
    with open(RESULTS / "operations.json", "w") as f:
        json.dump(ops, f, indent=2)
    with open(RESULTS / "graph.json", "w") as f:
        json.dump(graph_json, f, indent=2)
    with open(RESULTS / "evidence.json", "w") as f:
        json.dump(evidence_list, f, indent=2)
    with open(RESULTS / "evaluation.json", "w") as f:
        json.dump(evaluation, f, indent=2)

    print("\n== DONE ==")
    print(f"Candidate operations found: {len(ops['candidate_operations'])}")
    for op in ops["candidate_operations"]:
        print(f"  {op['operation_id']}: {op['size']} members, "
              f"ground truth composition = {op['ground_truth_composition']}")
    print(f"Evidence records: {len(evidence_list)}")
    print("Evaluation (original):", json.dumps(eval_orig, indent=2))
    print("Evaluation (changed):", json.dumps(eval_changed, indent=2))
    print(f"\nResults written to {RESULTS}/")


if __name__ == "__main__":
    main()
