import numpy as np
import pandas as pd
import pickle
from tensorflow.keras.models import load_model

# Load everything once
model = load_model("model/autism_ann_model.h5")

with open("model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("model/feature_columns.pkl", "rb") as f:
    feature_columns = pickle.load(f)

try:
    with open("model/selector.pkl", "rb") as f:
        selector = pickle.load(f)
except:
    selector = None


def preprocess_and_predict(df):
    
    # Expecting: Gene, Value
    df.columns = ["Gene", "Value"]
    
    sample_dict = dict(zip(df["Gene"], df["Value"]))
    
    # Align features
    sample_vector = [sample_dict.get(gene, 0) for gene in feature_columns]
    sample_vector = np.array(sample_vector).reshape(1, -1)
    
    # Log transform
    sample_vector = np.log2(sample_vector + 1)
    
    # Scale
    sample_vector = scaler.transform(sample_vector)
    
    # Feature selection
    if selector:
        sample_vector = selector.transform(sample_vector)
    
    # Prediction
    prob = model.predict(sample_vector)[0][0]
    pred = int(prob > 0.5)
    
    return pred, float(prob)