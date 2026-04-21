/**
 * BookAppointmentPage — Posts to /api/appointments (real DB)
 * Stitch ref: 1a92ee915ba345b4b5e9c5162bb5ae7f
 */

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, ChevronLeft, ChevronRight, User,
  CheckCircle2, Loader2, Stethoscope, FileText, ArrowLeft
} from "lucide-react";
import { appointmentsApi, patientsApi, type ApiAppointment } from "../../../services/healthcareApi";
import { MOCK_DOCTORS, TIME_SLOTS } from "../../../data/mockData";

interface BookAppointmentPageProps {
  onNavigate: (page: string) => void;
}

const REASON_OPTIONS = [
  "Initial behavioral assessment",
  "Follow-up consultation",
  "Genomic analysis review",
  "Medication review",
  "Parent counseling session",
  "Progress evaluation",
  "Other",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarGrid({ year, month, selected, onSelect }: {
  year: number; month: number; selected: Date | null; onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.05em", padding: "0.25rem 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSel = selected && date.toDateString() === selected.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          const isSun = date.getDay() === 0;
          return (
            <button key={i} disabled={isPast || isSun} onClick={() => onSelect(date)}
              style={{
                aspectRatio: "1", border: "none", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: isSel ? 800 : 500, cursor: isPast || isSun ? "not-allowed" : "pointer", transition: "all 150ms ease",
                background: isSel ? "var(--ink-dark)" : isToday ? "rgba(234,254,69,0.2)" : "transparent",
                color: isSel ? "var(--lime)" : isPast || isSun ? "var(--surface-highest)" : isToday ? "var(--olive)" : "var(--ink-dark)",
                fontFamily: "'Inter', sans-serif",
              }}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem",
  border: "1.5px solid var(--surface-highest)", background: "var(--surface-low)",
  fontSize: "0.9rem", color: "var(--ink-dark)", outline: "none",
  transition: "border-color 200ms", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
};

const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ onNavigate }) => {
  const today = new Date();
  const [step, setStep] = useState(0);
  const [doctorId, setDoctorId] = useState(MOCK_DOCTORS[0].id);
  const [backendDoctorId, setBackendDoctorId] = useState<number | null>(null);
  const [savedAppointment, setSavedAppointment] = useState<ApiAppointment | null>(null);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedDoctor = useMemo(() => MOCK_DOCTORS.find(d => d.id === doctorId)!, [doctorId]);
  const canProceed = selDate && selTime && reason;

  useEffect(() => {
    let active = true;

    patientsApi
      .list()
      .then((patients) => {
        if (!active) return;
        setBackendDoctorId(patients[0]?.doctor_id ?? null);
      })
      .catch(() => {
        if (active) setBackendDoctorId(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const resolvedDoctorId = backendDoctorId ?? 1;

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  const handleBook = async () => {
    if (!canProceed) return;
    setLoading(true); setError("");
    try {
      const dt = new Date(selDate!);
      const [h, mStr] = selTime!.replace(" AM", "").replace(" PM", "").split(":").map(Number);
      const isPM = selTime!.includes("PM") && h !== 12;
      dt.setHours(isPM ? h + 12 : h, mStr ?? 0);

      const appointment = await appointmentsApi.create({
        scheduled_at: dt.toISOString(),
        duration_min: 30,
        appt_type: "consultation",
        doctor_id: resolvedDoctorId,
        reason,
        notes,
      });
      setSavedAppointment(appointment);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #253317 0%, #2b4731 100%)", padding: "1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <button onClick={() => onNavigate("patient-dashboard")} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: "0.875rem" }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#fff", letterSpacing: "-0.02em" }}>Book an Appointment</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", marginTop: "0.375rem" }}>Schedule a session with your specialist</p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <AnimatePresence mode="wait">
          {step === 2 ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="tonal-card" style={{ padding: "3rem", textAlign: "center" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                <CheckCircle2 size={64} color="#197040" style={{ marginBottom: "1.25rem" }} />
              </motion.div>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--ink-dark)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Appointment Confirmed!</h2>
              <p style={{ color: "var(--ink-mid)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Your appointment with <strong>{savedAppointment?.doctor_name || selectedDoctor.name}</strong> on{" "}
                <strong>{selDate?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong> at{" "}
                <strong>{selTime}</strong> has been confirmed and saved to the database.
              </p>
              <div style={{ background: "var(--surface)", borderRadius: "1rem", padding: "1.25rem", border: "1px solid var(--surface-highest)", marginBottom: "1.5rem", textAlign: "left" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    ["Doctor", savedAppointment?.doctor_name || selectedDoctor.name],
                    ["Date", selDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) ?? ""],
                    ["Time", selTime ?? ""],
                    ["Duration", "30 minutes"],
                    ["Reason", reason],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em" }}>{k}</div>
                      <div style={{ fontSize: "0.9rem", color: "var(--ink-dark)", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => onNavigate("patient-dashboard")} className="btn-lime" style={{ justifyContent: "center" }}>Go to Dashboard</button>
                <button onClick={() => { setStep(0); setSelDate(null); setSelTime(null); setSavedAppointment(null); }} style={{ padding: "0.75rem 1.5rem", border: "1.5px solid var(--surface-highest)", borderRadius: "0.875rem", background: "none", color: "var(--ink-mid)", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Book Another</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

              {/* Left */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Doctor selector */}
                <div className="tonal-card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <Stethoscope size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Select Doctor</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {MOCK_DOCTORS.map(doc => (
                      <button key={doc.id} onClick={() => setDoctorId(doc.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", borderRadius: "0.875rem", border: "1.5px solid", cursor: "pointer", transition: "all 180ms ease", textAlign: "left",
                          borderColor: doctorId === doc.id ? "var(--olive)" : "var(--surface-highest)",
                          background: doctorId === doc.id ? "rgba(90,100,0,0.07)" : "transparent",
                        }}>
                        <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive), var(--forest))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.75rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                          {doc.name.split(" ").filter((_, i) => i > 0).map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif" }}>{doc.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif" }}>{doc.specialization}</div>
                        </div>
                        {doctorId === doc.id && <CheckCircle2 size={16} color="var(--olive)" style={{ marginLeft: "auto" }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="tonal-card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <Calendar size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Select Date</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", borderRadius: "0.5rem", padding: "0.375rem", color: "var(--ink-mid)", display: "flex" }}><ChevronLeft size={18} /></button>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--ink-dark)" }}>{MONTHS[calMonth]} {calYear}</span>
                    <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", borderRadius: "0.5rem", padding: "0.375rem", color: "var(--ink-mid)", display: "flex" }}><ChevronRight size={18} /></button>
                  </div>
                  <CalendarGrid year={calYear} month={calMonth} selected={selDate} onSelect={setSelDate} />
                </div>
              </div>

              {/* Right */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Time slots */}
                <div className="tonal-card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <Clock size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Select Time</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} onClick={() => setSelTime(slot)}
                        style={{
                          padding: "0.5625rem 0.5rem", borderRadius: "0.625rem", border: "1.5px solid", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease", fontFamily: "'Inter', sans-serif",
                          borderColor: selTime === slot ? "var(--olive)" : "var(--surface-highest)",
                          background: selTime === slot ? "var(--ink-dark)" : "transparent",
                          color: selTime === slot ? "var(--lime)" : "var(--ink-mid)",
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div className="tonal-card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FileText size={16} color="var(--olive)" />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Reason for Visit</span>
                  </div>
                  <select value={reason} onChange={e => setReason(e.target.value)} style={{ ...inputStyle, marginBottom: "0.875rem" }}>
                    {REASON_OPTIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <label style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-mid)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Manrope', sans-serif", display: "block", marginBottom: "0.5rem" }}>Additional Notes (optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any additional information for your doctor…" style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
                </div>

                {/* Summary */}
                {selDate && selTime && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="tonal-card"
                    style={{ padding: "1.25rem", border: "1.5px solid rgba(90,100,0,0.3)", background: "rgba(90,100,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <User size={14} color="var(--olive)" />
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase" }}>Booking Summary</span>
                    </div>
                    {[
                      ["With", selectedDoctor.name],
                      ["Date", selDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })],
                      ["Time", selTime],
                      ["Reason", reason],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid rgba(90,100,0,0.1)" }}>
                        <span style={{ fontSize: "0.8125rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif" }}>{k}</span>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ink-dark)", fontFamily: "'Inter', sans-serif" }}>{v}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {error && <div style={{ background: "var(--error-container)", color: "var(--error)", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem" }}>{error}</div>}

                <button id="book-appt-submit" onClick={handleBook} disabled={!canProceed || loading} className="btn-lime"
                  style={{ width: "100%", justifyContent: "center", padding: "0.9375rem", fontSize: "0.9375rem", opacity: canProceed && !loading ? 1 : 0.5, cursor: canProceed && !loading ? "pointer" : "not-allowed" }}>
                  {loading
                    ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Booking…</>
                    : <><CheckCircle2 size={16} /> Confirm Appointment</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default BookAppointmentPage;
