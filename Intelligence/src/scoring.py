"""
Combines base signals into a single 0-1 relationship score using the
prototype weights in config.py, then adds a graph-context signal (common
neighbours) via a second pass, since that needs a first-pass graph to exist.
"""
import networkx as nx
import pandas as pd

from config import SIGNAL_WEIGHTS, GRAPH_EDGE_THRESHOLD


def _base_score(row) -> float:
    w = SIGNAL_WEIGHTS
    return (
        w["text"] * row["text"]
        + w["visual"] * row["visual"]
        + w["identifier"] * row["identifier"]
        + w["temporal"] * row["temporal"]
        + w["behaviour"] * row["behaviour"]
    )


def score_pairs(pairs_df: pd.DataFrame) -> pd.DataFrame:
    """Two-pass scoring:
      Pass 1: weighted sum of the 5 base signals (graph_context = 0), used to
              build a provisional graph.
      Pass 2: graph_context = normalized count of shared neighbours in that
              provisional graph (Jaccard of neighbour sets). Recombine with
              full weights including graph_context.
    """
    pairs_df = pairs_df.copy()
    non_graph_weight = sum(v for k, v in SIGNAL_WEIGHTS.items() if k != "graph_context")
    pairs_df["_base_norm"] = pairs_df.apply(_base_score, axis=1) / non_graph_weight

    g = nx.Graph()
    for _, r in pairs_df.iterrows():
        if r["_base_norm"] >= GRAPH_EDGE_THRESHOLD:
            g.add_edge(r["source"], r["target"])

    def graph_context(a, b):
        if a not in g or b not in g:
            return 0.0
        na, nb = set(g.neighbors(a)), set(g.neighbors(b))
        if not na or not nb:
            return 0.0
        inter = len(na & nb)
        union = len(na | nb)
        return inter / union if union else 0.0

    pairs_df["graph_context"] = pairs_df.apply(
        lambda r: round(graph_context(r["source"], r["target"]), 4), axis=1
    )
    pairs_df["score"] = pairs_df.apply(
        lambda r: round(
            SIGNAL_WEIGHTS["text"] * r["text"]
            + SIGNAL_WEIGHTS["visual"] * r["visual"]
            + SIGNAL_WEIGHTS["identifier"] * r["identifier"]
            + SIGNAL_WEIGHTS["temporal"] * r["temporal"]
            + SIGNAL_WEIGHTS["behaviour"] * r["behaviour"]
            + SIGNAL_WEIGHTS["graph_context"] * r["graph_context"],
            4,
        ),
        axis=1,
    )
    pairs_df = pairs_df.drop(columns=["_base_norm"])
    return pairs_df.sort_values("score", ascending=False).reset_index(drop=True)
