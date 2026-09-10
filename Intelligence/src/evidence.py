"""Turns strong pairwise relationships into human-readable evidence +
contradictions. Rule-based on purpose: for a 48-hour prototype, explainable
beats clever. The frontend renders these as evidence cards."""
import pandas as pd

from config import EVIDENCE_THRESHOLD, EVIDENCE_SIGNAL_THRESHOLDS as T


def _evidence_for_row(r) -> dict:
    evidence, contradictions = [], []

    if r["text"] >= T["text_high"]:
        evidence.append("Similar semantic content")
    if r["identifier"] >= T["identifier_exact"]:
        evidence.append("Shared exact identifier (phone/username/account)")
    elif r["identifier"] >= T["identifier_partial"]:
        evidence.append("Partial identifier overlap")
    if r["temporal"] >= T["temporal_high"]:
        evidence.append("Consistent posting timing")
    if r["behaviour"] >= T["behaviour_high"]:
        evidence.append("Similar posting behaviour pattern")
    if r["visual"] >= T["visual_high"]:
        evidence.append("Similar visual characteristics")

    if r["identifier"] < T["low"]:
        contradictions.append("Different identifiers")
    if r["temporal"] < T["low"]:
        contradictions.append("Postings far apart in time")
    if r["visual"] < T["low"]:
        contradictions.append("Dissimilar visual characteristics")

    return {
        "source": r["source"], "target": r["target"], "score": r["score"],
        "signals": {
            "text": r["text"], "visual": r["visual"], "identifier": r["identifier"],
            "temporal": r["temporal"], "behaviour": r["behaviour"],
            "graph_context": r["graph_context"],
        },
        "evidence": evidence or ["Combined weak-signal correlation"],
        "contradictions": contradictions,
    }


def build_evidence(scored_pairs: pd.DataFrame) -> list:
    strong = scored_pairs[scored_pairs["score"] >= EVIDENCE_THRESHOLD]
    return [_evidence_for_row(r) for _, r in strong.iterrows()]
