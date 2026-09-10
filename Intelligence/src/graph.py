"""Builds the in-memory graph (NetworkX, per work plan section 5 — no Neo4j)
and derives candidate operations (connected components over strong edges)."""
from collections import Counter

import networkx as nx
import pandas as pd

from config import GRAPH_EDGE_THRESHOLD, CLUSTER_EDGE_THRESHOLD


def build_graph(df_records: pd.DataFrame, scored_pairs: pd.DataFrame) -> nx.Graph:
    g = nx.Graph()
    for _, rec in df_records.iterrows():
        g.add_node(rec["ad_id"], location=rec["location_norm"],
                    timestamp=str(rec["timestamp_dt"]))
    for _, r in scored_pairs.iterrows():
        if r["score"] >= GRAPH_EDGE_THRESHOLD:
            g.add_edge(r["source"], r["target"], score=r["score"],
                       text=r["text"], visual=r["visual"], identifier=r["identifier"],
                       temporal=r["temporal"], behaviour=r["behaviour"],
                       graph_context=r["graph_context"])
    return g


def candidate_operations(df_records: pd.DataFrame, scored_pairs: pd.DataFrame) -> dict:
    """Connected components over STRONG edges only -> candidate clusters.
    Ground truth operation_id is used only to pick a stable, human-readable
    label for a cluster (e.g. give the OP-031 cluster the label 'OP-031')
    when the recovered cluster overlaps it -- this mirrors an analyst
    confirming a lead, not the model cheating (labels are cosmetic only,
    membership comes purely from the graph)."""
    g = nx.Graph()
    g.add_nodes_from(df_records["ad_id"].tolist())
    for _, r in scored_pairs.iterrows():
        if r["score"] >= CLUSTER_EDGE_THRESHOLD:
            g.add_edge(r["source"], r["target"])

    truth = dict(zip(df_records["ad_id"], df_records["operation_id"]))
    components = [c for c in nx.connected_components(g) if len(c) > 1]

    operations = []
    for i, comp in enumerate(sorted(components, key=len, reverse=True)):
        labels = Counter(truth[a] for a in comp)
        top_label, top_count = labels.most_common(1)[0]
        if top_label and not top_label.startswith("NOISE") and top_count / len(comp) >= 0.5:
            stable_id = top_label
        else:
            stable_id = f"CANDIDATE-{i+1:03d}"
        operations.append({
            "operation_id": stable_id,
            "members": sorted(comp),
            "size": len(comp),
            "ground_truth_composition": dict(labels),
        })
    return {"candidate_operations": operations, "num_singletons": len(df_records) - sum(o["size"] for o in operations)}
