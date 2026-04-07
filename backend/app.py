from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from utils import preprocess_and_predict

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Autism Prediction API Running 🚀"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("[Backend] Received request")
        data = request.get_json()
        print(f"[Backend] Request data keys: {data.keys() if data else 'None'}")

        csv_data = data.get("csv") if data else None
        print(f"[Backend] CSV data length: {len(csv_data) if csv_data else 0}")

        if not csv_data:
            print("[Backend] No CSV data provided")
            return jsonify({"success": False, "error": "No CSV data provided"}), 400

        # Parse CSV from string
        from io import StringIO
        print("[Backend] Parsing CSV...")
        df = pd.read_csv(StringIO(csv_data))
        print(f"[Backend] Parsed DataFrame shape: {df.shape}")
        print(f"[Backend] Columns: {df.columns.tolist()}")
        print(f"[Backend] First few rows:\n{df.head()}")

        print("[Backend] Calling preprocess_and_predict...")
        pred, prob = preprocess_and_predict(df)
        print(f"[Backend] Prediction: {pred}, Probability: {prob}")

        result = "Autism" if pred == 1 else "Control"

        response = {
            "success": True,
            "data": {
                "prediction": result,
                "probability": prob
            }
        }
        print(f"[Backend] Returning response: {response}")
        return jsonify(response)

    except Exception as e:
        print(f"[Backend] Error: {str(e)}", flush=True)
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 422


if __name__ == "__main__":
    app.run(debug=True)