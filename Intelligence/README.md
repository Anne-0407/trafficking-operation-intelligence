# Partner Intelligence Engine — 48-Hour Prototype

Synthetic data → multi-signal relationship scoring → candidate operation
clusters → evidence → controlled-change robustness experiment → baseline vs.
proposed evaluation. This is the AI/data/intelligence half of the demo; a
partner's frontend renders the JSON this repo produces.

**Everything here is synthetic.** No real people, phone numbers, images,
accounts or locations are used anywhere. No live scraping, no face
recognition, no autonomous accusations — outputs are candidate investigative
leads with evidence and contradictions attached, meant to be reviewed by a
human analyst.

## Quick start

```bash
python3 -m venv venv && source venv/bin/activate   # optional
pip install -r requirements.txt
python run.py
```

That single command regenerates the whole pipeline from scratch and writes
everything under `results/`. It's idempotent: if `data/raw/records.json` or
`data/changed/records.json` already exist, it reuses them instead of
regenerating (delete those files, or run the scripts in `src/` directly, to
force fresh synthetic data).

To force a completely fresh dataset:
```bash
rm -rf data/raw data/changed data/processed results
python run.py
```

## What gets produced

| File | Contents |
|---|---|
| `data/raw/records.json` | 50 synthetic ad-style records, ~18 in the main scenario `OP-031`, two smaller distractor clusters (`OP-002`, `OP-003`), and 23 unrelated "noise" records (a few sharing exactly one weak signal with OP-031 on purpose). |
| `data/changed/records.json` | Same dataset with controlled, documented evasion changes applied to half of the OP-031 records (see `data/changed/change_log.json` for exactly what changed on each record). |
| `data/processed/*.json` | Normalized versions of both datasets. |
| `results/operations.json` | Candidate operation clusters recovered purely from the graph (connected components over strong edges), each tagged with its ground-truth composition for validation. |
| `results/graph.json` | Nodes + edges (with all component scores) for the frontend to render. |
| `results/evidence.json` | Per-relationship evidence/contradiction cards, e.g. `{"source":"AD017","target":"AD024","score":0.86,"signals":{...},"evidence":[...],"contradictions":[...]}`. |
| `results/evaluation.json` | Exact-identifier baseline vs. text-only baseline vs. proposed combined approach, computed on both the original and changed datasets. |

## Pipeline (`src/`)

1. **`generate_dataset.py`** — builds the synthetic dataset with ground truth
   (`operation_id`, kept out of anything the scoring code uses).
2. **`change_experiment.py`** — applies controlled changes (identifier
   replacement, text paraphrasing, visual-vector perturbation, location
   aliasing) to ~half of OP-031 to simulate evasion.
3. **`data_loader.py`** — loads + normalizes text, phone, username, account,
   location and timestamp fields.
4. **`features.py`** — computes the five base pairwise signals, each 0-1:
   - **Text**: TF-IDF + cosine similarity (the documented fallback for
     pretrained sentence embeddings, fully offline/deterministic).
   - **Identifier**: exact/partial matching across phone, username, account.
     A changed identifier *reduces* the signal rather than zeroing the whole
     relationship.
   - **Temporal**: decay function on time-gap between postings.
   - **Behavioural**: time-of-day similarity + location match. Deliberately
     simple, per the work plan ("do not over-engineer").
   - **Visual**: precomputed/simplified — each record carries an 8-dim
     pseudo-embedding (deterministic, seeded per visual "concept"); we cosine
     those. This stands in for a real vision model, as the work plan
     explicitly allows for this deadline.
5. **`scoring.py`** — combines the five signals with the prototype weights
   (`0.25 text + 0.20 visual + 0.15 identifier + 0.15 temporal + 0.15
   behaviour + 0.10 graph_context`), then adds `graph_context` in a second
   pass (Jaccard similarity of neighbour sets in a provisional graph). All
   weights live in `src/config.py`.
6. **`graph.py`** — builds the NetworkX graph and extracts candidate
   operations as connected components over strong edges. Ground-truth labels
   are used only to give a recovered cluster a stable, human-readable name
   (e.g. `OP-031`) when it substantially overlaps that ground truth —
   membership itself comes entirely from the graph, not from the label.
7. **`evidence.py`** — rule-based evidence/contradiction text per strong
   relationship (explainable over clever, per the work plan).
8. **`evaluate.py`** — ground truth = any pair of records sharing the same
   non-noise `operation_id`. Compares three approaches on both datasets.

## Threshold selection

Thresholds in `src/config.py` were chosen empirically by inspecting the
score distribution on the synthetic dataset: known-relationship pairs
cluster around 0.40–0.55, unrelated pairs around 0.10–0.25. `0.42` gives
roughly 0.86 precision / 0.89 recall on the original dataset. These are
prototype thresholds tuned to this synthetic dataset, not validated
production values.

## Results summary (regenerate with `python run.py`)

On the **original** dataset the combined approach recovers the large majority
of known relationships (F1 ≈ 0.87) while both baselines badly under-recover
(exact-identifier F1 ≈ 0.03, text-only F1 ≈ 0.10 — most OP-031 records
deliberately don't share an exact identifier or near-duplicate text).

On the **changed** dataset (after controlled evasion changes to half of
OP-031), the text-only baseline collapses to F1 ≈ 0.02 and the combined
approach degrades more gracefully to F1 ≈ 0.54 — the demo conclusion the
work plan asks for: *simple matching loses relationships after controlled
changes; the combined approach retains more of them.* Exact numbers are
in `results/evaluation.json` and will vary slightly if the dataset is
regenerated with a different `RANDOM_SEED`.

## Git workflow

This repo is meant to be pushed to a branch such as `partner/intelligence-engine`,
not directly to `main`. Output JSON structures (`operations.json`,
`graph.json`, `evidence.json`, `evaluation.json`) are considered stable for
the frontend — flag it before changing their shape.

## Limitations (intentional, for a 48-hour prototype)

- Visual similarity is a precomputed/simplified stand-in, not a real vision
  model.
- Weights in `config.py` are hand-picked prototype values, not fit/validated
  against a larger labeled dataset.
- Behavioural signal is intentionally simple (time-of-day + location).
- Evidence generation is rule-based (threshold-driven), not learned.
- The dataset is small (50 records) and synthetic, by design — this is a
  proof-of-concept, not a production system.
