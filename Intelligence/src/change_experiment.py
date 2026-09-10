"""
Section 7 of the work plan (highest priority). Applies controlled,
documented changes to a subset of OP-031 records to simulate an operation
trying to evade simple matching: new identifiers, paraphrased text, a
perturbed visual vector, and a different location string. Ground truth
operation_id is preserved (it's the label we're trying to still recover).
"""
import copy
import json
import random
from pathlib import Path

import numpy as np

from config import RANDOM_SEED

RAW_PATH = Path(__file__).resolve().parent.parent / "data" / "raw" / "records.json"
OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "changed" / "records.json"

SYNONYM_SWAPS = {
    "available": "open", "flexible": "adjustable", "message": "text",
    "details": "info", "week": "period", "clients": "guests",
    "evenings": "nights", "weekend": "weekend period", "limited": "reduced",
    "verify": "confirm", "photos": "pictures", "guaranteed": "assured",
}

LOCATION_ALIASES = {
    "riverside district": "the river area",
    "harbor point": "the port side",
    "midtown": "city center",
    "lakeside": "by the lake",
    "north terminal": "the north hub",
    "old mill quarter": "the mill area",
    "eastgate": "east side",
    "union square": "the square",
}


def paraphrase_text(text: str, rng: random.Random) -> str:
    words = text.split()
    for i, w in enumerate(words):
        key = w.lower().strip(".,!")
        if key in SYNONYM_SWAPS and rng.random() < 0.7:
            words[i] = SYNONYM_SWAPS[key]
    rng.shuffle(words[: min(3, len(words))])  # light reorder of the opening
    return " ".join(words)


def perturb_visual(vec, rng, magnitude=0.35):
    arr = np.array(vec)
    noise = np.random.RandomState(rng.randint(0, 10**6)).normal(0, magnitude, len(arr))
    new_vec = arr + noise
    return (new_vec / np.linalg.norm(new_vec)).round(4).tolist()


def new_identifier(kind: str, rng: random.Random) -> str:
    if kind == "phone":
        return f"555-0{rng.randint(100, 999)}"
    if kind == "username":
        return "user" + str(rng.randint(1000, 9999))
    return "ACC" + str(rng.randint(1000, 9999))


def main():
    rng = random.Random(RANDOM_SEED + 1)
    np.random.seed(RANDOM_SEED + 1)

    with open(RAW_PATH) as f:
        records = json.load(f)

    changed = copy.deepcopy(records)
    op031_idx = [i for i, r in enumerate(changed) if r["operation_id"] == "OP-031"]
    to_change = rng.sample(op031_idx, k=max(1, len(op031_idx) // 2))

    changes_log = []
    for i in to_change:
        rec = changed[i]
        applied = []
        if rng.random() < 0.8:
            rec["phone"] = new_identifier("phone", rng); applied.append("identifier_replacement:phone")
        if rng.random() < 0.6:
            rec["username"] = new_identifier("username", rng); applied.append("identifier_replacement:username")
        rec["text"] = paraphrase_text(rec["text"], rng); applied.append("text_paraphrasing")
        rec["visual_vector"] = perturb_visual(rec["visual_vector"], rng); applied.append("visual_transformation")
        if rng.random() < 0.5:
            loc_key = rec["location"].lower()
            rec["location"] = LOCATION_ALIASES.get(loc_key, rec["location"])
            applied.append("location_variation")
        changes_log.append({"ad_id": rec["ad_id"], "changes_applied": applied})

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(changed, f, indent=2)

    log_path = OUT_PATH.parent / "change_log.json"
    with open(log_path, "w") as f:
        json.dump(changes_log, f, indent=2)

    print(f"Applied controlled changes to {len(to_change)} OP-031 records.")
    print(f"Wrote {OUT_PATH} and {log_path}")


if __name__ == "__main__":
    main()
