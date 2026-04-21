/**
 * PatientDashboard — Live data from /api/appointments + /api/results
 * Stitch refs: be79d1d58c754d6eb9e48069ca4f68ef / ed4bbd3a82924686a6d8c35e06c2b45d
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, FlaskConical, ChevronRight, ClipboardList,
  Activity, AlertCircle, CheckCircle2, Clock, BookOpen,
  TrendingUp, Bell, Loader2
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { appointmentsApi, resultsApi, type ApiAppointment, type ApiResult } from "../../../services/healthcareApi";

interface PatientDashboardProps {
  onNavigate: (page: string) => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

function RiskBadge({ prob }: { prob: number }) {
  const level = prob >= 0.7 ? "high" : prob >= 0.4 ? "medium" : "low";
  const cfg = {
    high:   { bg: "rgba(186,26,26,0.1)",  color: "#ba1a1a", label: "High Risk",  icon: <AlertCircle size={13} /> },
    medium: { bg: "rgba(174,118,0,0.1)",  color: "#ae7600", label: "Moderate",   icon: <Activity size={13} /> },
    low:    { bg: "rgba(25,110,60,0.1)",  color: "#197040", label: "Low Risk",   icon: <CheckCircle2 size={13} /> },
  }[level];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: cfg.bg, color: cfg.color, borderRadius: "9999px", padding: "0.25rem 0.625rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [results,      setResults]      = useState<ApiResult[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      appointmentsApi.list(),
      resultsApi.list(),
    ]).then(([apptRes, resRes]) => {
      if (cancelled) return;
      if (apptRes.status === "fulfilled") setAppointments(apptRes.value);
      if (resRes.status  === "fulfilled") setResults(resRes.value);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const nextAppt     = appointments.find(a => a.status === "scheduled");
  const latestResult = results[0] ?? null;
  const firstName    = user?.name?.split(" ")[0] ?? "Patient";

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const QUICK_ACTIONS = [
    { id: "patient-assessment",       icon: <ClipboardList size={22} />, label: "Start Assessment",  desc: "Complete behavioral questionnaire", color: "var(--olive)" },
    { id: "patient-book-appointment", icon: <Calendar size={22} />,      label: "Book Appointment",  desc: "Schedule with your doctor",         color: "#2d6a9f" },
    { id: "patient-results",          icon: <TrendingUp size={22} />,    label: "View My Results",   desc: "See previous analysis reports",     color: "#197040" },
    { id: "support",                  icon: <BookOpen size={22} />,      label: "Resource Library",  desc: "Educational guides & coping tools", color: "#7c3fa0" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>

      {/* ── Hero ── */}
      <motion.div {...fadeUp(0)} style={{ background: "linear-gradient(135deg, #253317 0%, #2b4731 50%, #191d11 100%)", padding: "2.5rem 2rem 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(234,254,69,0.06)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
            <Bell size={14} color="var(--lime)" />
            <span style={{ fontSize: "0.75rem", color: "var(--lime)", fontWeight: 600, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Patient Portal</span>
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.625rem" }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span style={{ color: "var(--lime)" }}>{firstName}</span> 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6 }}>
            Here's an overview of your health journey. Stay consistent with your assessments.
          </p>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
            {[
              { label: "Assessments Completed", value: loading ? "…" : String(results.length),                         icon: <ClipboardList size={16} /> },
              { label: "Next Appointment",       value: loading ? "…" : nextAppt ? "Scheduled" : "None",                icon: <Calendar size={16} /> },
              { label: "Overall Risk Level",     value: loading ? "…" : latestResult?.prediction ?? "No data",          icon: <Activity size={16} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "rgba(255,255,255,0.07)", borderRadius: "0.875rem", padding: "0.75rem 1.25rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "var(--lime)" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)", fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#fff", fontFamily: "'Manrope', sans-serif" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "2rem", color: "var(--ink-light)" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem" }}>Loading your health data…</span>
          </div>
        )}

        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

            {/* ── Next Appointment ── */}
            <motion.div {...fadeUp(0.1)} className="tonal-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <Calendar size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Next Appointment</span>
                  </div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.1875rem", color: "var(--ink-dark)", letterSpacing: "-0.015em" }}>
                    {nextAppt ? nextAppt.appt_type.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "No Upcoming Appointment"}
                  </h3>
                </div>
                {nextAppt && <span style={{ background: "rgba(25,110,60,0.1)", color: "#197040", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Confirmed</span>}
              </div>
              {nextAppt ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Clock size={14} color="var(--ink-light)" />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink-dark)", fontFamily: "'Inter', sans-serif" }}>{formatDate(nextAppt.scheduled_at)}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)" }}>{formatTime(nextAppt.scheduled_at)} · {nextAppt.duration_min} min</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.55 }}>
                      <strong style={{ color: "var(--olive)" }}>{nextAppt.doctor_name}</strong> — {nextAppt.reason}
                    </div>
                  </div>
                  <button onClick={() => onNavigate("patient-book-appointment")} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "1.5px solid var(--surface-highest)", borderRadius: "0.75rem", padding: "0.5625rem 1rem", fontSize: "0.8125rem", fontWeight: 600, color: "var(--ink-mid)", cursor: "pointer", width: "100%", justifyContent: "center", transition: "all 200ms ease" }}>
                    Reschedule <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <button onClick={() => onNavigate("patient-book-appointment")} className="btn-lime" style={{ width: "100%", justifyContent: "center" }}>
                  Book Appointment <ChevronRight size={14} />
                </button>
              )}
            </motion.div>

            {/* ── Latest Result ── */}
            <motion.div {...fadeUp(0.15)} className="tonal-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                <FlaskConical size={16} color="var(--olive)" />
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Latest Assessment</span>
              </div>
              {latestResult ? (
                <>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.1875rem", color: "var(--ink-dark)", letterSpacing: "-0.015em", marginBottom: "1rem" }}>
                    {latestResult.assessment_type === "genomic" ? "Genomic Analysis" : "Behavioral Screening"} Result
                  </h3>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8125rem", color: "var(--ink-mid)", fontFamily: "'Inter', sans-serif" }}>ASD Probability</span>
                      <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif" }}>{(latestResult.probability * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: "8px", background: "var(--surface-highest)", borderRadius: "9999px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${latestResult.probability * 100}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: "9999px", background: latestResult.probability >= 0.7 ? "linear-gradient(90deg,#ba1a1a,#e53935)" : latestResult.probability >= 0.4 ? "linear-gradient(90deg,#ae7600,#f59e0b)" : "linear-gradient(90deg,#197040,#22c55e)" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <RiskBadge prob={latestResult.probability} />
                    <span style={{ fontSize: "0.75rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif" }}>
                      {new Date(latestResult.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <button onClick={() => onNavigate("patient-results")} className="btn-lime" style={{ width: "100%", justifyContent: "center" }}>
                    View Full Report <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.1875rem", color: "var(--ink-dark)", marginBottom: "1rem" }}>No assessments yet</h3>
                  <p style={{ color: "var(--ink-light)", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>Complete your first behavioral assessment to see predictions here.</p>
                  <button onClick={() => onNavigate("patient-assessment")} className="btn-lime" style={{ width: "100%", justifyContent: "center" }}>
                    Start Assessment <ChevronRight size={14} />
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <motion.div {...fadeUp(0.2)}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.1875rem", color: "var(--ink-dark)", letterSpacing: "-0.015em", marginBottom: "1rem" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {QUICK_ACTIONS.map(({ id, icon, label, desc, color }, i) => (
              <motion.button key={id} {...fadeUp(0.22 + i * 0.05)} onClick={() => onNavigate(id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.875rem", padding: "1.25rem", background: "var(--surface-white)", borderRadius: "1.125rem", border: "1.5px solid var(--surface-highest)", cursor: "pointer", transition: "all 220ms ease", textAlign: "left" }}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(25,29,17,0.1)" }} whileTap={{ scale: 0.98 }}>
                <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--ink-dark)", marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)", lineHeight: 1.5 }}>{desc}</div>
                </div>
                <ChevronRight size={14} color="var(--ink-light)" style={{ alignSelf: "flex-end" }} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default PatientDashboard;
