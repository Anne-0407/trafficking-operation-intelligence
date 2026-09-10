"""Load raw synthetic records and normalize them for feature extraction."""
import json
import re
from datetime import datetime
from pathlib import Path

import pandas as pd


def _normalize_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _normalize_phone(phone: str) -> str:
    return re.sub(r"\D", "", phone or "")


def load_records(path: str) -> pd.DataFrame:
    with open(path) as f:
        raw = json.load(f)
    df = pd.DataFrame(raw)
    return df


def normalize(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["text_norm"] = df["text"].apply(_normalize_text)
    df["phone_norm"] = df["phone"].apply(_normalize_phone)
    df["username_norm"] = df["username"].str.lower().str.strip()
    df["account_norm"] = df["account_id"].str.upper().str.strip()
    df["location_norm"] = df["location"].str.lower().str.strip()
    df["timestamp_dt"] = pd.to_datetime(df["timestamp"])
    return df


def load_and_normalize(path: str) -> pd.DataFrame:
    return normalize(load_records(path))


def save_processed(df: pd.DataFrame, path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    cols = ["ad_id", "operation_id", "text_norm", "phone_norm", "username_norm",
            "account_norm", "visual_feature_id", "visual_vector", "location_norm",
            "timestamp_dt"]
    out = df[cols].copy()
    out["timestamp_dt"] = out["timestamp_dt"].astype(str)
    out.to_json(path, orient="records", indent=2)
