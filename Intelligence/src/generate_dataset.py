"""
Generates the synthetic dataset used across the whole demo.

Safety note: every record below is fabricated for this prototype. No real
people, phone numbers, usernames, images or locations are used. This script
never touches the network and never scrapes anything.

Design goals (per work plan section 2):
  - One main scenario, OP-031 (~18 records) that the demo is built around.
  - Two smaller distractor "operations" (OP-002, OP-003) so the graph isn't
    just one blob and so the clustering step has to do real work.
  - A pool of unrelated noise records, INCLUDING some that share exactly one
    weak signal with OP-031 (e.g. same city, nothing else) so the demo is not
    a trivial exact-match exercise.
  - Every record gets a deterministic "visual_feature_id" plus an 8-dim
    pseudo-embedding. This stands in for a real vision model: the work plan
    explicitly allows precomputed/simplified visual similarity for this
    deadline. That simplification is documented here and in the README.
"""
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np

from config import RANDOM_SEED

OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "raw" / "records.json"

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

CITIES = ["Riverside District", "Harbor Point", "Midtown", "Lakeside", "North Terminal",
          "Old Mill Quarter", "Eastgate", "Union Square"]

TEXT_TEMPLATES = [
    "Available now near {loc}, flexible hours, message for details.",
    "New in {loc} this week, outcall only, text to book.",
    "Looking for clients around {loc}, available evenings.",
    "In town near {loc}, short notice ok, DM for rates.",
    "Special this weekend in {loc}, limited availability.",
    "Independent, based near {loc}, verify before booking.",
    "Fresh photos posted, currently in {loc}, hit me up.",
    "Weekly special near {loc}, quick response guaranteed.",
]

def paraphrase(text, loc):
    """Very light synonym/reorder paraphrase, used for OP-031 members so text
    similarity is high but not identical (matches the near-duplicate ad
    pattern real operations show)."""
    swaps = {
        "Available now": "Open now", "flexible hours": "flexible schedule",
        "message for details": "text for info", "New in": "Just arrived in",
        "outcall only": "outcalls only", "text to book": "message to book",
        "Looking for clients": "Seeking clients", "available evenings": "free evenings",
        "short notice ok": "last minute ok", "DM for rates": "message for pricing",
        "this weekend": "this Fri-Sun", "limited availability": "few slots left",
        "based near": "located near", "verify before booking": "verification required",
        "Fresh photos posted": "New pics up", "hit me up": "reach out",
        "Weekly special": "This week's special", "quick response guaranteed": "fast replies",
    }
    for k, v in swaps.items():
        if k in text:
            text = text.replace(k, v)
            break
    return text


def make_visual_vector(concept_id, noise=0.05):
    rng = np.random.RandomState(abs(hash(concept_id)) % (2**32))
    base = rng.normal(0, 1, 8)
    vec = base + np.random.normal(0, noise, 8)
    return (vec / np.linalg.norm(vec)).round(4).tolist()


def rand_phone(rng):
    return f"555-0{rng.randint(100, 999)}"


def rand_username(rng):
    return "user" + str(rng.randint(1000, 9999))


def rand_account(rng):
    return "ACC" + str(rng.randint(1000, 9999))


def build_operation(op_id, n_records, loc_pool, start_time, phone_share=0.6,
                     username_share=0.5, account_share=0.4, visual_concept=None,
                     time_jitter_hours=48):
    """Build a messy cluster: not every record shares every signal. Some
    records only share text style + rough timing + location; a couple share
    identifiers exactly; this mirrors how real coordinated postings look."""
    rng = random.Random(hash(op_id) % (2**32))
    records = []
    shared_phone = rand_phone(rng)
    shared_username = rand_username(rng)
    shared_account = rand_account(rng)
    visual_concept = visual_concept or op_id

    for i in range(n_records):
        loc = rng.choice(loc_pool)
        template = rng.choice(TEXT_TEMPLATES)
        text = template.format(loc=loc)
        if i % 2 == 0:
            text = paraphrase(text, loc)
        ts = start_time + timedelta(hours=rng.uniform(0, time_jitter_hours))

        phone = shared_phone if rng.random() < phone_share else rand_phone(rng)
        username = shared_username if rng.random() < username_share else rand_username(rng)
        account = shared_account if rng.random() < account_share else rand_account(rng)

        records.append({
            "ad_id": f"AD{{ID}}",
            "operation_id": op_id,
            "text": text,
            "phone": phone,
            "username": username,
            "account_id": account,
            "visual_feature_id": f"VF-{visual_concept}",
            "visual_vector": make_visual_vector(visual_concept, noise=0.15),
            "location": loc,
            "timestamp": ts.isoformat(),
        })
    return records


def build_noise(n_records, loc_pool, start_time, weak_overlap_loc=None):
    """Standalone unrelated records. A few deliberately reuse ONE weak signal
    (usually just a location) with OP-031 so a naive system that keys off a
    single signal will over-cluster."""
    rng = random.Random(1234 + n_records)
    records = []
    for i in range(n_records):
        loc = weak_overlap_loc if (weak_overlap_loc and i < 3) else rng.choice(loc_pool)
        template = rng.choice(TEXT_TEMPLATES)
        text = template.format(loc=loc)
        ts = start_time + timedelta(hours=rng.uniform(0, 24 * 10))
        records.append({
            "ad_id": f"AD{{ID}}",
            "operation_id": f"NOISE-{i}",
            "text": text,
            "phone": rand_phone(rng),
            "username": rand_username(rng),
            "account_id": rand_account(rng),
            "visual_feature_id": f"VF-noise-{i}",
            "visual_vector": make_visual_vector(f"noise-{i}", noise=0.15),
            "location": loc,
            "timestamp": ts.isoformat(),
        })
    return records


def main():
    start = datetime(2024, 1, 10, 9, 0, 0)

    op031 = build_operation("OP-031", 18, CITIES[:3], start,
                             phone_share=0.55, username_share=0.45, account_share=0.35,
                             visual_concept="op031", time_jitter_hours=96)
    op002 = build_operation("OP-002", 5, CITIES[3:5], start + timedelta(days=2),
                             phone_share=0.8, username_share=0.6, account_share=0.6,
                             visual_concept="op002", time_jitter_hours=36)
    op003 = build_operation("OP-003", 4, CITIES[5:7], start + timedelta(days=1),
                             phone_share=0.5, username_share=0.5, account_share=0.25,
                             visual_concept="op003", time_jitter_hours=48)
    noise = build_noise(23, CITIES, start, weak_overlap_loc=CITIES[0])

    all_records = op031 + op002 + op003 + noise
    random.Random(RANDOM_SEED).shuffle(all_records)

    for idx, rec in enumerate(all_records, start=1):
        rec["ad_id"] = f"AD{idx:03d}"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(all_records, f, indent=2)

    print(f"Wrote {len(all_records)} records to {OUT_PATH}")
    print(f"  OP-031: {len(op031)}  OP-002: {len(op002)}  OP-003: {len(op003)}  noise: {len(noise)}")


if __name__ == "__main__":
    main()
