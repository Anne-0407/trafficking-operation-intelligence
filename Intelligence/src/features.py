"""
Computes the four/five base pairwise signals described in the work plan.
Every signal is normalized to [0, 1]. Graph-context is NOT computed here —
it depends on the graph built from these signals, so it's added in scoring.py
after a first pass.
"""
import itertools

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def text_similarity_matrix(df: pd.DataFrame) -> np.ndarray:
    """TF-IDF + cosine similarity. The work plan allows this as the documented
    fallback for pretrained sentence embeddings (no internet access needed,
    fully offline, deterministic)."""
    vectorizer = TfidfVectorizer(min_df=1, ngram_range=(1, 2))
    tfidf = vectorizer.fit_transform(df["text_norm"].tolist())
    sim = cosine_similarity(tfidf)
    return sim


def identifier_similarity(row_a, row_b) -> float:
    """Exact/partial identifier matching. A changed identifier REDUCES the
    signal rather than zeroing the whole relationship, per the work plan."""
    score = 0.0
    weight_total = 0.0

    for field, w in (("phone_norm", 0.4), ("username_norm", 0.3), ("account_norm", 0.3)):
        weight_total += w
        a, b = row_a[field], row_b[field]
        if a and b:
            if a == b:
                score += w
            elif a[-6:] == b[-6:] or (len(a) > 3 and a[:4] == b[:4]):
                # partial overlap (e.g. reused phone prefix/suffix, typo'd id)
                score += w * 0.4
    return score / weight_total if weight_total else 0.0


def temporal_similarity(row_a, row_b, max_gap_hours=96) -> float:
    """Closer postings in time score higher; decays smoothly to 0."""
    delta = abs((row_a["timestamp_dt"] - row_b["timestamp_dt"]).total_seconds()) / 3600.0
    return float(max(0.0, 1.0 - delta / max_gap_hours))


def behaviour_similarity(row_a, row_b) -> float:
    """Simple posting-pattern features: time-of-day bucket + location match.
    Deliberately not over-engineered per the work plan."""
    score = 0.0
    hour_a, hour_b = row_a["timestamp_dt"].hour, row_b["timestamp_dt"].hour
    hour_diff = min(abs(hour_a - hour_b), 24 - abs(hour_a - hour_b))
    score += 0.5 * max(0.0, 1.0 - hour_diff / 12.0)
    score += 0.5 * (1.0 if row_a["location_norm"] == row_b["location_norm"] else 0.0)
    return score


def visual_similarity_matrix(df: pd.DataFrame) -> np.ndarray:
    """Precomputed/simplified visual similarity, as explicitly permitted by
    the work plan for this deadline (documented here and in the README).
    Each record already carries an 8-dim pseudo-embedding; we just cosine it."""
    vecs = np.array(df["visual_vector"].tolist())
    return cosine_similarity(vecs)


def compute_all_pairwise(df: pd.DataFrame) -> pd.DataFrame:
    """Returns one row per unordered pair with all base signals."""
    text_sim = text_similarity_matrix(df)
    visual_sim = visual_similarity_matrix(df)
    n = len(df)
    records = []
    for i, j in itertools.combinations(range(n), 2):
        a, b = df.iloc[i], df.iloc[j]
        records.append({
            "source": a["ad_id"], "target": b["ad_id"],
            "text": round(float(text_sim[i, j]), 4),
            "visual": round(float(visual_sim[i, j]), 4),
            "identifier": round(identifier_similarity(a, b), 4),
            "temporal": round(temporal_similarity(a, b), 4),
            "behaviour": round(behaviour_similarity(a, b), 4),
        })
    return pd.DataFrame(records)
