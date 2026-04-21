"""
app.py — Autism Gene AI Platform — Full REST API
SQLite-backed, ML-model integrated, CORS-open for any localhost port.
"""
from __future__ import annotations
import json
from datetime import datetime
from io import StringIO

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from models import db, User, Patient, Appointment, AnalysisResult
from utils import preprocess_and_predict, preprocess_and_predict_screening

# ══════════════════════════════════════════════════════════════════
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Allow any localhost port (dev convenience)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173",
                                         "http://localhost:5174",
                                         "http://localhost:5175",
                                         "http://localhost:3000",
                                         "http://127.0.0.1:5173",
                                         "http://127.0.0.1:5174"]}},
     supports_credentials=True)

# ── DB init + seed ────────────────────────────────────────────────
def seed_demo_data():
    """Create demo doctor + patient accounts if the DB is empty."""
    if User.query.count() > 0:
        return

    print("[Seed] Creating demo accounts…")

    # Doctor
    doc = User(
        name="Dr. Priya Nair",
        email="doctor@aiims.edu",
        password_hash=generate_password_hash("doctor123"),
        role="doctor",
        institution="AIIMS New Delhi",
    )
    db.session.add(doc)
    db.session.flush()  # get doc.id

    # Patient user
    pat_user = User(
        name="Arjun Sharma",
        email="patient@gmail.com",
        password_hash=generate_password_hash("patient123"),
        role="patient",
    )
    db.session.add(pat_user)
    db.session.flush()

    # Patient profile
    pat = Patient(
        user_id=pat_user.id,
        doctor_id=doc.id,
        dob=datetime.strptime("2017-03-14", "%Y-%m-%d").date(),
        gender="Male",
        phone="+91 98765 43210",
        address="42, Lajpat Nagar II, New Delhi – 110024",
        guardian_name="Rajesh Sharma (Father)",
        risk_level="high",
        clinical_notes="Initial screening. Parents report delayed speech, limited eye contact.",
    )
    db.session.add(pat)
    db.session.commit()
    print("[Seed] Demo accounts ready — doctor@aiims.edu / patient@gmail.com")


# ── Helper ────────────────────────────────────────────────────────
def current_user_id() -> int | None:
    """Read X-User-Id header sent by the React frontend."""
    uid = request.headers.get("X-User-Id")
    try:
        return int(uid) if uid else None
    except (ValueError, TypeError):
        return None


def require_user():
    uid = current_user_id()
    if not uid:
        return None, (jsonify({"error": "Unauthorized"}), 401)
    user = User.query.get(uid)
    if not user:
        return None, (jsonify({"error": "User not found"}), 404)
    return user, None


# ══════════════════════════════════════════════════════════════════
# HEALTH
# ══════════════════════════════════════════════════════════════════
@app.route("/")
def home():
    return "Autism Prediction API Running 🚀"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# ══════════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════════
@app.route("/api/auth/signup", methods=["POST"])
def auth_signup():
    data = request.get_json() or {}
    name        = data.get("name", "").strip()
    email       = data.get("email", "").strip().lower()
    password    = data.get("password", "")
    role        = data.get("role", "patient")
    institution = data.get("institution", "").strip()

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role=role,
        institution=institution or None,
    )
    db.session.add(user)
    db.session.flush()

    # Auto-create patient profile
    if role == "patient":
        pat = Patient(user_id=user.id, risk_level="unknown")
        db.session.add(pat)

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 201


@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data     = request.get_json() or {}
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"user": user.to_dict()}), 200


@app.route("/api/auth/me", methods=["GET"])
def auth_me():
    user, err = require_user()
    if err:
        return err
    return jsonify({"user": user.to_dict()}), 200


# ══════════════════════════════════════════════════════════════════
# PATIENTS  (doctor-scoped)
# ══════════════════════════════════════════════════════════════════
@app.route("/api/patients", methods=["GET"])
def list_patients():
    user, err = require_user()
    if err:
        return err

    if user.role == "doctor":
        patients = Patient.query.filter_by(doctor_id=user.id).all()
    else:
        # patient can only see themselves
        p = Patient.query.filter_by(user_id=user.id).first()
        patients = [p] if p else []

    return jsonify({"patients": [p.to_dict() for p in patients]}), 200


@app.route("/api/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    user, err = require_user()
    if err:
        return err

    pat = Patient.query.get_or_404(patient_id)
    include_history = request.args.get("include_history", "false").lower() == "true"
    return jsonify({"patient": pat.to_dict(include_history=include_history)}), 200


@app.route("/api/patients/<int:patient_id>/notes", methods=["PATCH"])
def update_clinical_notes(patient_id):
    user, err = require_user()
    if err:
        return err

    pat = Patient.query.get_or_404(patient_id)
    data = request.get_json() or {}
    if "clinical_notes" in data:
        pat.clinical_notes = data["clinical_notes"]
    if "risk_level" in data:
        pat.risk_level = data["risk_level"]
    db.session.commit()
    return jsonify({"patient": pat.to_dict()}), 200


# ══════════════════════════════════════════════════════════════════
# APPOINTMENTS
# ══════════════════════════════════════════════════════════════════
@app.route("/api/appointments", methods=["GET"])
def list_appointments():
    user, err = require_user()
    if err:
        return err

    if user.role == "doctor":
        appts = Appointment.query.filter_by(doctor_id=user.id).order_by(Appointment.scheduled_at).all()
    else:
        pat = Patient.query.filter_by(user_id=user.id).first()
        appts = Appointment.query.filter_by(patient_id=pat.id).order_by(Appointment.scheduled_at).all() if pat else []

    return jsonify({"appointments": [a.to_dict() for a in appts]}), 200


@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    user, err = require_user()
    if err:
        return err

    data = request.get_json() or {}
    try:
        scheduled_at = datetime.fromisoformat(data["scheduled_at"].replace("Z", ""))
    except (KeyError, ValueError):
        return jsonify({"error": "scheduled_at (ISO format) is required"}), 400

    # Resolve patient_id
    if user.role == "patient":
        pat = Patient.query.filter_by(user_id=user.id).first()
        if not pat:
            return jsonify({"error": "Patient profile not found"}), 404
        patient_id = pat.id
        doctor_id  = data.get("doctor_id") or pat.doctor_id
    else:
        patient_id = data.get("patient_id")
        doctor_id  = user.id

    appt = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        scheduled_at=scheduled_at,
        duration_min=data.get("duration_min", 30),
        status="scheduled",
        appt_type=data.get("appt_type", "consultation"),
        reason=data.get("reason", ""),
        notes=data.get("notes", ""),
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"appointment": appt.to_dict()}), 201


# ══════════════════════════════════════════════════════════════════
# RESULTS
# ══════════════════════════════════════════════════════════════════
@app.route("/api/results", methods=["GET"])
def list_results():
    user, err = require_user()
    if err:
        return err

    if user.role == "patient":
        pat = Patient.query.filter_by(user_id=user.id).first()
        results = AnalysisResult.query.filter_by(patient_id=pat.id).order_by(
            AnalysisResult.created_at.desc()
        ).all() if pat else []
    else:
        patient_id = request.args.get("patient_id")
        q = AnalysisResult.query
        if patient_id:
            q = q.filter_by(patient_id=int(patient_id))
        results = q.order_by(AnalysisResult.created_at.desc()).all()

    return jsonify({"results": [r.to_dict() for r in results]}), 200


@app.route("/api/results", methods=["POST"])
def save_result():
    user, err = require_user()
    if err:
        return err

    data = request.get_json() or {}

    # Resolve patient record
    if user.role == "patient":
        pat = Patient.query.filter_by(user_id=user.id).first()
    else:
        pat = Patient.query.get(data.get("patient_id"))

    if not pat:
        return jsonify({"error": "Patient record not found"}), 404

    result = AnalysisResult(
        patient_id=pat.id,
        assessment_type=data.get("assessment_type", "screening"),
        prediction=data.get("prediction", ""),
        probability=float(data.get("probability", 0)),
        raw_label=data.get("raw_label"),
        feature_data=json.dumps(data.get("feature_data")) if data.get("feature_data") else None,
    )
    db.session.add(result)

    # Update patient risk_level from latest prediction
    prob = float(data.get("probability", 0))
    pat.risk_level = "high" if prob >= 0.70 else "medium" if prob >= 0.40 else "low"
    db.session.commit()

    return jsonify({"result": result.to_dict()}), 201


# ══════════════════════════════════════════════════════════════════
# PREDICTION — Genomic CSV
# ══════════════════════════════════════════════════════════════════
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data     = request.get_json()
        csv_data = data.get("csv") if data else None
        if not csv_data:
            return jsonify({"success": False, "error": "No CSV data provided"}), 400

        df = pd.read_csv(StringIO(csv_data))
        pred, prob = preprocess_and_predict(df)
        result_label = "Autism" if pred == 1 else "Control"

        return jsonify({
            "success": True,
            "data": {"prediction": result_label, "probability": prob},
        })

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 422


# Multipart file upload variant (used by Doctor Upload page)
@app.route("/predict/upload", methods=["POST"])
def predict_upload():
    """Accepts multipart/form-data with a 'file' field (CSV)."""
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file_obj = request.files["file"]
        content  = file_obj.read().decode("utf-8")
        df       = pd.read_csv(StringIO(content))
        pred, prob = preprocess_and_predict(df)
        result_label = "Autism" if pred == 1 else "Control"

        return jsonify({
            "success": True,
            "data": {"prediction": result_label, "probability": prob},
        })

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 422


# ══════════════════════════════════════════════════════════════════
# PREDICTION — Behavioral Screening
# ══════════════════════════════════════════════════════════════════
@app.route("/predict/screening", methods=["POST"])
def predict_screening():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"success": False, "error": "No screening payload provided"}), 400

        result = preprocess_and_predict_screening(payload)

        return jsonify({
            "success": True,
            "data": {
                "prediction": result["prediction"],
                "probability": result["probability"],
                "raw_label":   result["raw_label"],
            },
            "meta": {
                "model":         "screening_data_model",
                "feature_count": len(result["used_features"]),
            },
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 422


# ══════════════════════════════════════════════════════════════════
# STARTUP
# ══════════════════════════════════════════════════════════════════
with app.app_context():
    db.create_all()
    seed_demo_data()
    print("[DB] Tables ready ✔")

if __name__ == "__main__":
    app.run(debug=True, port=5000)