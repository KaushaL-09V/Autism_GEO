"""
models.py — SQLAlchemy models for the Autism Gene AI Platform
Database: SQLite (dev) / MySQL (prod via DATABASE_URL env var)
"""
from __future__ import annotations
from datetime import datetime, date
import json
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ─────────────────────────────────────────────────────────────────
class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(200), nullable=False)
    email         = db.Column(db.String(200), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False, default="mock_hash")
    role          = db.Column(db.String(20), nullable=False, default="patient")  # patient | doctor
    institution   = db.Column(db.String(200))
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    patient_profile    = db.relationship("Patient", foreign_keys="Patient.user_id",  backref="user",   uselist=False)
    doctor_patients    = db.relationship("Patient", foreign_keys="Patient.doctor_id", backref="doctor")
    appointments_given = db.relationship("Appointment", foreign_keys="Appointment.doctor_id", backref="doctor")

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "email":       self.email,
            "role":        self.role,
            "institution": self.institution,
        }


# ─────────────────────────────────────────────────────────────────
class Patient(db.Model):
    __tablename__ = "patients"

    id                = db.Column(db.Integer, primary_key=True)
    user_id           = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    doctor_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    dob               = db.Column(db.Date)
    gender            = db.Column(db.String(20))
    phone             = db.Column(db.String(30))
    address           = db.Column(db.Text)
    guardian_name     = db.Column(db.String(200))
    emergency_contact = db.Column(db.String(100))
    diagnosis_date    = db.Column(db.Date)
    risk_level        = db.Column(db.String(20), default="unknown")  # high | medium | low | unknown
    clinical_notes    = db.Column(db.Text)
    created_at        = db.Column(db.DateTime, default=datetime.utcnow)

    appointments = db.relationship("Appointment", foreign_keys="Appointment.patient_id", backref="patient")
    results      = db.relationship("AnalysisResult", backref="patient")

    def _age(self):
        if not self.dob:
            return None
        today = date.today()
        return today.year - self.dob.year - (
            (today.month, today.day) < (self.dob.month, self.dob.day)
        )

    def to_dict(self, include_history=False):
        data = {
            "id":              self.id,
            "name":            self.user.name  if self.user   else "",
            "email":           self.user.email if self.user   else "",
            "age":             self._age(),
            "gender":          self.gender,
            "phone":           self.phone,
            "dob":             self.dob.isoformat()           if self.dob            else None,
            "address":         self.address,
            "guardian_name":   self.guardian_name,
            "diagnosis_date":  self.diagnosis_date.isoformat() if self.diagnosis_date else None,
            "risk_level":      self.risk_level,
            "clinical_notes":  self.clinical_notes,
            "doctor_id":       self.doctor_id,
        }
        if include_history:
            data["results"]      = [r.to_dict() for r in self.results]
            data["appointments"] = [a.to_dict() for a in self.appointments]
        return data


# ─────────────────────────────────────────────────────────────────
class Appointment(db.Model):
    __tablename__ = "appointments"

    id           = db.Column(db.Integer, primary_key=True)
    patient_id   = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor_id    = db.Column(db.Integer, db.ForeignKey("users.id"),    nullable=False)
    scheduled_at = db.Column(db.DateTime, nullable=False)
    duration_min = db.Column(db.Integer, default=30)
    status       = db.Column(db.String(20), default="scheduled")  # scheduled | completed | cancelled
    appt_type    = db.Column(db.String(30), default="consultation")  # consultation | assessment | follow-up
    reason       = db.Column(db.Text)
    notes        = db.Column(db.Text)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":           self.id,
            "patient_id":   self.patient_id,
            "patient_name": self.patient.user.name if self.patient and self.patient.user else "",
            "doctor_id":    self.doctor_id,
            "doctor_name":  self.doctor.name       if self.doctor else "",
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "duration_min": self.duration_min,
            "status":       self.status,
            "appt_type":    self.appt_type,
            "reason":       self.reason,
            "notes":        self.notes,
        }


# ─────────────────────────────────────────────────────────────────
class AnalysisResult(db.Model):
    __tablename__ = "analysis_results"

    id              = db.Column(db.Integer, primary_key=True)
    patient_id      = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    assessment_type = db.Column(db.String(30), default="screening")  # screening | genomic
    prediction      = db.Column(db.String(20))   # Autism | Control
    probability     = db.Column(db.Float)
    raw_label       = db.Column(db.Integer)
    feature_data    = db.Column(db.Text)  # JSON string of feature importance
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":              self.id,
            "patient_id":      self.patient_id,
            "assessment_type": self.assessment_type,
            "prediction":      self.prediction,
            "probability":     self.probability,
            "raw_label":       self.raw_label,
            "feature_data":    json.loads(self.feature_data) if self.feature_data else None,
            "created_at":      self.created_at.isoformat()   if self.created_at   else None,
        }
