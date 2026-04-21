/**
 * Doctor Patients — Live patient list from /api/patients
 * Stitch ref: 89775c4d5315467aa0aef655e84733a8
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ChevronRight, ArrowLeft, User,
  AlertCircle, Activity, CheckCircle2, Phone, Mail, Loader2
} from "lucide-react";
import { appointmentsApi, patientsApi, type ApiAppointment, type ApiPatient } from "../../../services/healthcareApi";

interface DoctorPatientsProps {
  onNavigate: (page: string, extra?: Record<string, string>) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
}

type RiskFilter = "all" | "high" | "medium" | "low";

function RiskBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    high: { bg: "rgba(186,26,26,0.1)", color: "#ba1a1a", icon: <AlertCircle size={11} /> },
    medium: { bg: "rgba(174,118,0,0.1)", color: "#ae7600", icon: <Activity size={11} /> },
    low: { bg: "rgba(25,110,60,0.1)", color: "#197040", icon: <CheckCircle2 size={11} /> },
    unknown: { bg: "rgba(100,100,100,0.1)", color: "#666", icon: null },
  };
  const c = cfg[level] ?? cfg.unknown;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: c.bg, color: c.color, borderRadius: "9999px", padding: "0.25rem 0.625rem", fontSize: "0.6875rem", fontWeight: 700, fontFamily: "'Manrope', sans-serif", textTransform: "capitalize" }}>
      {c.icon}{level}
    </span>
  );
}

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ onNavigate, setSelectedPatientId }) => {
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      patientsApi.list(),
      appointmentsApi.list(),
    ]).then(([pRes, aRes]) => {
      if (cancelled) return;
      if (pRes.status === "fulfilled") setPatients(pRes.value);
      if (aRes.status === "fulfilled") setAppointments(aRes.value);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const mergedPatients: ApiPatient[] = useMemo(() => {
    const map = new Map<number, ApiPatient>();

    for (const patient of patients) {
      map.set(patient.id, patient);
    }

    for (const appt of appointments) {
      if (appt.status !== "scheduled") continue;
      if (map.has(appt.patient_id)) continue;

      map.set(appt.patient_id, {
        id: appt.patient_id,
        name: appt.patient_name,
        email: "No email on file",
        age: null,
        gender: null,
        phone: null,
        dob: null,
        address: null,
        guardian_name: null,
        diagnosis_date: null,
        risk_level: "unknown",
        clinical_notes: null,
        doctor_id: appt.doctor_id ?? null,
      });
    }

    return Array.from(map.values());
  }, [patients, appointments]);

  const filtered: ApiPatient[] = useMemo(() =>
    mergedPatients.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === "all" || p.risk_level === riskFilter;
      return matchSearch && matchRisk;
    }), [mergedPatients, search, riskFilter]);

  const handleViewPatient = (id: number, dest: "doctor-patient-detail" | "doctor-analysis") => {
    setSelectedPatientId(String(id));
    onNavigate(dest, { patientId: String(id) });
  };

  const RISK_FILTERS: { id: RiskFilter; label: string; color: string }[] = [
    { id: "all", label: "All Patients", color: "var(--ink-mid)" },
    { id: "high", label: "High Risk", color: "#ba1a1a" },
    { id: "medium", label: "Moderate", color: "#ae7600" },
    { id: "low", label: "Low Risk", color: "#197040" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #191d11 0%, #253317 100%)", padding: "1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button onClick={() => onNavigate("doctor-dashboard")} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: "0.875rem" }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#fff", letterSpacing: "-0.02em" }}>Patient Management</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", marginTop: "0.375rem" }}>
            {loading ? "Loading…" : `${mergedPatients.length} patient${mergedPatients.length !== 1 ? "s" : ""} in your care`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Search + Filter bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="tonal-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
            <Search size={16} color="var(--ink-light)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient name or email…"
              style={{ width: "100%", paddingLeft: "2.5rem", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "0.875rem", border: "1.5px solid var(--surface-highest)", background: "var(--surface-low)", fontSize: "0.9rem", color: "var(--ink-dark)", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = "var(--olive)"; e.target.style.boxShadow = "0 0 0 3px rgba(90,100,0,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--surface-highest)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Filter size={15} color="var(--ink-light)" />
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {RISK_FILTERS.map(f => (
                <button key={f.id} onClick={() => setRiskFilter(f.id)}
                  style={{
                    padding: "0.4375rem 0.875rem", borderRadius: "9999px", border: "1.5px solid", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.75rem", transition: "all 180ms ease",
                    borderColor: riskFilter === f.id ? f.color : "var(--surface-highest)",
                    background: riskFilter === f.id ? `${f.color}12` : "transparent",
                    color: riskFilter === f.id ? f.color : "var(--ink-light)",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "3rem", color: "var(--ink-light)" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem" }}>Loading patients…</span>
          </div>
        )}

        {/* Patient cards */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {filtered.map((patient, i) => (
              <motion.div key={patient.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }}
                className="tonal-card"
                style={{ padding: "1.375rem 1.5rem", cursor: "pointer" }}
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(25,29,17,0.1)" }}
                onClick={() => handleViewPatient(patient.id, "doctor-patient-detail")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive), var(--forest))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.875rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                    {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--ink-dark)" }}>{patient.name}</span>
                      <RiskBadge level={patient.risk_level} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <User size={12} /> {patient.age ?? "—"} yrs · {patient.gender ?? "—"}
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Mail size={12} /> {patient.email}
                      </span>
                      {patient.phone && (
                        <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Phone size={12} /> {patient.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
                    <button onClick={e => { e.stopPropagation(); handleViewPatient(patient.id, "doctor-patient-detail"); }}
                      className="btn-lime" style={{ fontSize: "0.8125rem", padding: "0.4375rem 0.875rem" }}>
                      View Profile <ChevronRight size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleViewPatient(patient.id, "doctor-analysis"); }}
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4375rem 0.875rem", border: "1.5px solid var(--surface-highest)", borderRadius: "0.875rem", background: "none", color: "var(--ink-mid)", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "0.8125rem", transition: "all 180ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--olive)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--olive)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--surface-highest)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-mid)"; }}>
                      Analysis
                    </button>
                  </div>
                </div>

                {/* Footer */}
                {patient.guardian_name && (
                  <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: "1px solid var(--surface-highest)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)" }}>👨‍👩‍👦 {patient.guardian_name}</span>
                    {patient.diagnosis_date && <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)" }}>📋 Diagnosed: {new Date(patient.diagnosis_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                  </div>
                )}
              </motion.div>
            ))}

            {!filtered.length && !loading && (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--ink-light)" }}>
                <Search size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
                <div style={{ fontSize: "1.0625rem", fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>
                  {mergedPatients.length ? "No patients match your filter" : "No patients yet"}
                </div>
                <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  {mergedPatients.length ? "Try adjusting your search or filter" : "Patients who register with the Patient role will appear here"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default DoctorPatients;
