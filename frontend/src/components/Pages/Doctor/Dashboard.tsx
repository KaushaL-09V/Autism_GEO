/**
 * DoctorDashboard — Live data from /api/patients + /api/appointments
 * Stitch ref: 6a3bb5ed96f144cbb0d8a04b238f9e14
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Users, Calendar, AlertCircle, ChevronRight,
  Clock, TrendingUp, Activity, Stethoscope, Loader2
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { patientsApi, appointmentsApi, type ApiPatient, type ApiAppointment } from "../../../services/healthcareApi";

interface DoctorDashboardProps {
  onNavigate: (page: string, extra?: Record<string, string>) => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

function StatCard({ icon, value, label, sub, color, delay }: { icon: React.ReactNode; value: string | number; label: string; sub?: string; color: string; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)} className="tonal-card" style={{ padding: "1.375rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>{label}</div>
          <div style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.75rem", color: "var(--ink-light)", marginTop: "0.375rem" }}>{sub}</div>}
        </div>
        <div style={{ width: "2.625rem", height: "2.625rem", borderRadius: "0.75rem", background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
      </div>
    </motion.div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    high:    { bg: "rgba(186,26,26,0.1)",  color: "#ba1a1a" },
    medium:  { bg: "rgba(174,118,0,0.1)",  color: "#ae7600" },
    low:     { bg: "rgba(25,110,60,0.1)",  color: "#197040" },
    unknown: { bg: "rgba(100,100,100,0.1)", color: "#666" },
  };
  const c = cfg[level] ?? cfg.unknown;
  return <span style={{ background: c.bg, color: c.color, borderRadius: "9999px", padding: "0.2rem 0.625rem", fontSize: "0.6875rem", fontWeight: 700, fontFamily: "'Manrope', sans-serif", textTransform: "capitalize" }}>{level}</span>;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [patients,      setPatients]      = useState<ApiPatient[]>([]);
  const [appointments,  setAppointments]  = useState<ApiAppointment[]>([]);
  const [loading,       setLoading]       = useState(true);

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

  const upcoming = appointments.filter(a => a.status === "scheduled").slice(0, 4);
  const highRisk = patients.filter(p => p.risk_level === "high").length;

  const riskDist = [
    { name: "High",   count: patients.filter(p => p.risk_level === "high").length,   color: "#ba1a1a" },
    { name: "Medium", count: patients.filter(p => p.risk_level === "medium").length, color: "#ae7600" },
    { name: "Low",    count: patients.filter(p => p.risk_level === "low").length,    color: "#197040" },
  ];

  const formatApptTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>

      {/* ── Hero ── */}
      <motion.div {...fadeUp(0)} style={{ background: "linear-gradient(135deg, #191d11 0%, #253317 55%, #2b4731 100%)", padding: "2.5rem 2rem 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(234,254,69,0.05)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
            <Stethoscope size={14} color="var(--lime)" />
            <span style={{ fontSize: "0.75rem", color: "var(--lime)", fontWeight: 600, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Clinical Dashboard</span>
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
            Welcome, <span style={{ color: "var(--lime)" }}>{user?.name ?? "Doctor"}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6 }}>
            {loading ? "Loading your clinical data…" : (
              <>You have <strong style={{ color: "#fff" }}>{upcoming.length} appointment{upcoming.length !== 1 ? "s" : ""}</strong> coming up and <strong style={{ color: highRisk > 0 ? "#ff9999" : "#fff" }}>{highRisk} high-risk patient{highRisk !== 1 ? "s" : ""}</strong> requiring attention.</>
            )}
          </p>
        </div>
      </motion.div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "3rem", color: "var(--ink-light)" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem" }}>Fetching clinical data…</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
              <StatCard icon={<Users size={20} />}       value={patients.length}     label="Total Patients"   sub={`${highRisk} high risk`} color="var(--olive)" delay={0.05} />
              <StatCard icon={<Calendar size={20} />}    value={upcoming.length}     label="Upcoming Appts"   sub="Next 7 days"              color="#2d6a9f"       delay={0.1}  />
              <StatCard icon={<AlertCircle size={20} />} value={highRisk}            label="High Risk Alerts" sub="Require attention"        color="#ba1a1a"       delay={0.15} />
              <StatCard icon={<Activity size={20} />}    value={appointments.length} label="Total Appts"      sub="All time"                 color="#7c3fa0"       delay={0.2}  />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {/* Upcoming Appointments */}
              <motion.div {...fadeUp(0.2)} className="tonal-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Upcoming Appointments</span>
                  </div>
                  <button onClick={() => onNavigate("doctor-patients")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif" }}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {upcoming.length ? upcoming.map(appt => {
                    const { date, time } = formatApptTime(appt.scheduled_at);
                    return (
                      <motion.div key={appt.id} whileHover={{ x: 3 }}
                        style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.875rem", background: "var(--surface)", borderRadius: "0.875rem", border: "1px solid var(--surface-highest)", cursor: "pointer" }}
                        onClick={() => onNavigate("doctor-patient-detail", { patientId: String(appt.patient_id) })}>
                        <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: "rgba(90,100,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--olive)", fontFamily: "'Manrope', sans-serif" }}>{date.split(" ")[0].toUpperCase()}</span>
                          <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", lineHeight: 1 }}>{date.split(" ")[1]}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--ink-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{appt.patient_name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)", marginTop: "0.125rem" }}>
                            <Clock size={12} style={{ display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} />{time} · {appt.duration_min}min
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-mid)", marginTop: "0.25rem", fontStyle: "italic" }}>{appt.reason}</div>
                        </div>
                        <span style={{ background: "rgba(25,110,60,0.1)", color: "#197040", borderRadius: "9999px", padding: "0.2rem 0.625rem", fontSize: "0.6875rem", fontWeight: 700, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                          {appt.appt_type.replace(/-/g, " ")}
                        </span>
                      </motion.div>
                    );
                  }) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--ink-light)", fontSize: "0.9rem" }}>No upcoming appointments</div>
                  )}
                </div>
              </motion.div>

              {/* Risk Distribution */}
              <motion.div {...fadeUp(0.25)} className="tonal-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <TrendingUp size={16} color="var(--olive)" />
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Patient Risk Distribution</span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={riskDist} barSize={36}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fill: "var(--ink-mid)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--ink-light)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "rgba(90,100,0,0.06)" }} formatter={(v: number) => [v, "Patients"]} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  {riskDist.map(d => (
                    <div key={d.name} style={{ flex: 1, textAlign: "center", padding: "0.625rem 0.5rem", background: `${d.color}0d`, borderRadius: "0.625rem", border: `1px solid ${d.color}25` }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: d.color, fontFamily: "'Manrope', sans-serif" }}>{d.count}</div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>{d.name}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* My Patients table */}
            <motion.div {...fadeUp(0.3)} className="tonal-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={16} color="var(--olive)" />
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>My Patients</span>
                </div>
                <button onClick={() => onNavigate("doctor-patients")} className="btn-lime" style={{ fontSize: "0.8125rem", padding: "0.4375rem 0.875rem" }}>
                  Manage Patients <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid var(--surface-highest)" }}>
                      {["Patient", "Age", "Risk Level", "Doctor ID", "Action"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                        style={{ borderBottom: "1px solid var(--surface-highest)", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--surface)"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                        onClick={() => onNavigate("doctor-patient-detail", { patientId: String(p.id) })}>
                        <td style={{ padding: "0.875rem 0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive), var(--forest))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.6875rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                              {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--ink-dark)" }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.875rem", color: "var(--ink-mid)" }}>{p.age ?? "—"} yrs</td>
                        <td style={{ padding: "0.875rem 0.75rem" }}><RiskBadge level={p.risk_level} /></td>
                        <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.8125rem", color: "var(--ink-light)" }}>{p.doctor_id ?? "—"}</td>
                        <td style={{ padding: "0.875rem 0.75rem" }}>
                          <div style={{ display: "flex", gap: "0.375rem" }}>
                            <button onClick={e => { e.stopPropagation(); onNavigate("doctor-patient-detail", { patientId: String(p.id) }); }} style={{ padding: "0.3125rem 0.625rem", border: "1px solid var(--surface-highest)", borderRadius: "0.5rem", background: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--olive)", fontWeight: 600 }}>View</button>
                            <button onClick={e => { e.stopPropagation(); onNavigate("doctor-analysis", { patientId: String(p.id) }); }} style={{ padding: "0.3125rem 0.625rem", border: "1px solid var(--surface-highest)", borderRadius: "0.5rem", background: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--ink-mid)", fontWeight: 600 }}>Analysis</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {!patients.length && (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--ink-light)", fontSize: "0.9rem" }}>
                    No patients assigned yet. Patients who sign up will appear here.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default DoctorDashboard;
