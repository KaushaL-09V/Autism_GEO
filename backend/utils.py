import numpy as np
import pandas as pd
import pickle
from pathlib import Path
from tensorflow.keras.models import load_model

BASE_DIR = Path(__file__).resolve().parent

# Gene-expression model artifacts
gene_model = load_model(str(BASE_DIR / "model" / "autism_ann_model.h5"))

with open(BASE_DIR / "model" / "scaler.pkl", "rb") as f:
    gene_scaler = pickle.load(f)

with open(BASE_DIR / "model" / "feature_columns.pkl", "rb") as f:
    gene_feature_columns = pickle.load(f)

try:
    with open(BASE_DIR / "model" / "selector.pkl", "rb") as f:
        gene_selector = pickle.load(f)
except Exception:
    gene_selector = None

# Screening-behavior model artifacts
with open(BASE_DIR / "screening_data_model" / "autism_model.pkl", "rb") as f:
    screening_model = pickle.load(f)

with open(BASE_DIR / "screening_data_model" / "scaler.pkl", "rb") as f:
    screening_scaler = pickle.load(f)

with open(BASE_DIR / "screening_data_model" / "features.pkl", "rb") as f:
    screening_features = pickle.load(f)

with open(BASE_DIR / "screening_data_model" / "label_encoder.pkl", "rb") as f:
    screening_label_encoder = pickle.load(f)

YES_NO_COLUMNS = {
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10_Autism_Spectrum_Quotient",
    "Jaundice",
    "Family_mem_with_ASD",
}

# NOTE: These mappings mirror label-encoding behavior used in training.
SCREENING_CATEGORY_MAPS = {
    "Sex": {"F": 0, "M": 1, "Female": 0, "Male": 1},
    "Ethnicity": {
        "Asian": 0,
        "Black": 1,
        "Hispanic": 2,
        "Latino": 3,
        "Middle Eastern": 4,
        "Others": 5,
        "Pasifika": 6,
        "South Asian": 7,
        "Turkish": 8,
        "White European": 9,
        "others": 5,
    },
    "Jaundice": {"No": 0, "Yes": 1, "no": 0, "yes": 1},
    "Family_mem_with_ASD": {"No": 0, "Yes": 1, "no": 0, "yes": 1},
    "Who_completed_the_test": {
        "Doctor": 0,
        "Family Member": 1,
        "Health care professional": 2,
        "Parent": 3,
        "Relative": 4,
        "Self": 5,
    },
}


def _to_binary(value, feature_name):
    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float)):
        if value in (0, 1):
            return int(value)
        raise ValueError(f"Feature '{feature_name}' expects 0/1 or Yes/No")

    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in ("1", "yes", "y", "true"):
            return 1
        if normalized in ("0", "no", "n", "false"):
            return 0

    raise ValueError(f"Feature '{feature_name}' expects 0/1 or Yes/No")


def _normalize_screening_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object")

    normalized = dict(payload)

    # Allow the frontend to send A10 alias while preserving trained feature name.
    if (
        "A10_Autism_Spectrum_Quotient" not in normalized
        and "A10" in normalized
    ):
        normalized["A10_Autism_Spectrum_Quotient"] = normalized["A10"]

    missing = [col for col in screening_features if col not in normalized]
    if missing:
        raise ValueError(f"Missing required features: {', '.join(missing)}")

    model_input = {}

    for col in screening_features:
        raw_value = normalized[col]

        if col in YES_NO_COLUMNS:
            model_input[col] = _to_binary(raw_value, col)
            continue

        if col == "Age_Years":
            try:
                model_input[col] = int(raw_value)
            except (TypeError, ValueError):
                raise ValueError("Feature 'Age_Years' must be a valid number")
            continue

        if col in SCREENING_CATEGORY_MAPS:
            mapping = SCREENING_CATEGORY_MAPS[col]

            if raw_value in mapping:
                model_input[col] = mapping[raw_value]
                continue

            if isinstance(raw_value, str):
                candidate = raw_value.strip()
                if candidate in mapping:
                    model_input[col] = mapping[candidate]
                    continue

            allowed = ", ".join(sorted({str(k) for k in mapping.keys()}))
            raise ValueError(
                f"Invalid value for '{col}': {raw_value}. Allowed values: {allowed}"
            )

        # Numeric fallback.
        try:
            model_input[col] = float(raw_value)
        except (TypeError, ValueError):
            raise ValueError(f"Feature '{col}' has invalid value: {raw_value}")

    return pd.DataFrame([model_input], columns=screening_features)


def preprocess_and_predict(df):
    
    # Expecting: Gene, Value
    df.columns = ["Gene", "Value"]
    
    sample_dict = dict(zip(df["Gene"], df["Value"]))
    
    # Align features
    sample_vector = [sample_dict.get(gene, 0) for gene in gene_feature_columns]
    sample_vector = np.array(sample_vector).reshape(1, -1)
    
    # Log transform
    sample_vector = np.log2(sample_vector + 1)
    
    # Scale
    sample_vector = gene_scaler.transform(sample_vector)
    
    # Feature selection
    if gene_selector:
        sample_vector = gene_selector.transform(sample_vector)
    
    # Prediction
    prob = gene_model.predict(sample_vector, verbose=0)[0][0]
    pred = int(prob > 0.5)
    
    return pred, float(prob)


def preprocess_and_predict_screening(payload):
    df_input = _normalize_screening_payload(payload)

    scaled = screening_scaler.transform(df_input)

    if hasattr(screening_model, "predict_proba"):
        prob = float(screening_model.predict_proba(scaled)[0][1])
        pred = int(prob >= 0.5)
    else:
        pred = int(screening_model.predict(scaled)[0])
        prob = float(pred)

    # Keep label mapping aligned with saved encoder classes when available.
    classes = getattr(screening_label_encoder, "classes_", None)
    if classes is not None and len(classes) >= 2:
        predicted_label = str(classes[pred])
    else:
        predicted_label = "Yes" if pred == 1 else "No"

    prediction = "Autism" if predicted_label.lower() == "yes" else "Control"

    return {
        "prediction": prediction,
        "raw_label": predicted_label,
        "pred": pred,
        "probability": prob,
        "used_features": screening_features,
    }