/**
 * PatientDetail — Full Clinical Profile (Doctor View)
 * Stitch ref: 26a0b7bc86054a059875c6d225c08157
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar,
  AlertCircle, Activity, CheckCircle2, FileText,
  ChevronRight, Edit3, TrendingUp, FlaskConical, Loader2
} from "lucide-react";
import { patientsApi, resultsApi, appointmentsApi, type ApiPatient, type ApiResult, type ApiAppointment } from "../../../services/healthcareApi";

interface PatientDetailProps {
  onNavigate: (page: string, extra?: Record<string,string>) => void;
  patientId: string;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity:0, y:16 },
  animate: { opacity:1, y:0 },
  transition: { duration:0.4, delay, ease:"easeOut" },
});

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", padding:"0.75rem 0", borderBottom:"1px solid var(--surface-highest)" }}>
      <span style={{ color:"var(--olive)", flexShrink:0, marginTop:"0.0625rem" }}>{icon}</span>
      <div>
        <div style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--ink-light)", fontFamily:"'Manrope', sans-serif", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.1875rem" }}>{label}</div>
        <div style={{ fontSize:"0.9rem", color:"var(--ink-dark)", fontFamily:"'Inter', sans-serif", lineHeight:1.5 }}>{value || "–"}</div>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const cfg: Record<string,{ bg:string; color:string }> = {
    high:   { bg:"rgba(186,26,26,0.12)", color:"#ba1a1a" },
    medium: { bg:"rgba(174,118,0,0.12)", color:"#ae7600" },
    low:    { bg:"rgba(25,110,60,0.12)", color:"#197040" },
  };
  const c = cfg[level] ?? { bg:"rgba(100,100,100,0.12)", color:"#666" };
  return (
    <span style={{ background:c.bg, color:c.color, borderRadius:"9999px", padding:"0.3125rem 0.875rem", fontSize:"0.8125rem", fontWeight:800, fontFamily:"'Manrope', sans-serif", textTransform:"capitalize" }}>
      {level === "high" ? <AlertCircle size={13} style={{ display:"inline", marginRight:"0.3rem", verticalAlign:"middle" }}/> : null}{level} Risk
    </span>
  );
}

const PatientDetail: React.FC<PatientDetailProps> = ({ onNavigate, patientId }) => {
  const [patient,   setPatient]   = useState<ApiPatient | null>(null);
  const [results,   setResults]   = useState<ApiResult[]>([]);
  const [appts,     setAppts]     = useState<ApiAppointment[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!patientId) return;
    const id = Number(patientId);
    setLoading(true);
    Promise.allSettled([
      patientsApi.get(id, true),
      resultsApi.list(id),
      appointmentsApi.list(),
    ]).then(([pRes, rRes, aRes]) => {
      if (pRes.status === "fulfilled") setPatient(pRes.value);
      if (rRes.status === "fulfilled") setResults(rRes.value);
      if (aRes.status === "fulfilled") setAppts(aRes.value.filter(a => a.patient_id === id));
      setLoading(false);
    });
  }, [patientId]);

  const latestRes = results[0];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--ink-light)" }}>
      <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}>Loading patient profile…</span>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!patient) return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--ink-light)" }}>
      <AlertCircle size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>Patient not found</div>
      <button onClick={() => onNavigate("doctor-patients")} className="btn-lime" style={{ marginTop: "1rem" }}>Back to Patients</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--surface)", paddingBottom:"3rem" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg, #191d11 0%, #253317 100%)", padding:"1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <button onClick={() => onNavigate("doctor-patients")} style={{ display:"flex", alignItems:"center", gap:"0.375rem", background:"none", border:"none", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:"0.875rem", fontFamily:"'Inter', sans-serif", marginBottom:"0.875rem" }}>
            <ArrowLeft size={14}/> Patient Management
          </button>
          {/* Patient banner */}
          <div style={{ display:"flex", alignItems:"center", gap:"1.25rem", flexWrap:"wrap" }}>
            <div style={{ width:"4rem", height:"4rem", borderRadius:"50%", background:"linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%)", display:"flex", alignItems:"center", justifyContent:"center", color:"#191d11", fontSize:"1.25rem", fontWeight:900, fontFamily:"'Manrope', sans-serif", flexShrink:0, boxShadow:"0 4px 16px rgba(234,254,69,0.3)" }}>
              {patient.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"0.3125rem" }}>
                <h1 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:900, fontSize:"1.75rem", color:"#fff", letterSpacing:"-0.02em" }}>{patient.name}</h1>
                <RiskBadge level={patient.risk_level}/>
              </div>
              <div style={{ display:"flex", gap:"1.25rem", flexWrap:"wrap" }}>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.875rem" }}>Age {patient.age} · {patient.gender}</span>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.875rem" }}>{patient.email}</span>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.875rem" }}>{patient.phone}</span>
              </div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:"0.625rem", flexWrap:"wrap" }}>
              <button onClick={() => onNavigate("doctor-analysis", { patientId: String(patient.id) })} className="btn-lime" style={{ justifyContent:"center" }}>
                <TrendingUp size={14}/> View Analysis
              </button>
              <button onClick={() => onNavigate("doctor-upload", { patientId: String(patient.id) })}
                style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.625rem 1.125rem", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:"0.875rem", background:"rgba(255,255,255,0.07)", color:"#fff", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:600, fontSize:"0.875rem" }}>
                <FlaskConical size={14}/> Upload Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"2rem 1.5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"1.5rem", alignItems:"start" }}>

          {/* LEFT: Demographics */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <motion.div {...fadeUp(0.05)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.25rem" }}>
                <User size={15} color="var(--olive)"/>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Demographics</span>
              </div>
              <InfoRow icon={<Calendar size={14}/>}  label="Date of Birth"       value={patient.dob ? new Date(patient.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "N/A"} />
              <InfoRow icon={<User size={14}/>}       label="Gender"              value={patient.gender ?? "–"} />
              <InfoRow icon={<Phone size={14}/>}      label="Contact"             value={patient.phone ?? "–"} />
              <InfoRow icon={<Mail size={14}/>}       label="Email"               value={patient.email} />
              <InfoRow icon={<MapPin size={14}/>}     label="Address"             value={patient.address ?? "–"} />
              <InfoRow icon={<User size={14}/>}       label="Guardian / Parent"   value={patient.guardian_name ?? "N/A"} />
              <InfoRow icon={<Calendar size={14}/>}   label="Diagnosis Date"      value={patient.diagnosis_date ? new Date(patient.diagnosis_date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "Pending"} />
            </motion.div>

            {/* Latest Result Summary */}
            {latestRes && (
              <motion.div {...fadeUp(0.1)} className="tonal-card" style={{ padding:"1.5rem", border:"1.5px solid rgba(90,100,0,0.2)", background:"rgba(90,100,0,0.03)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
                  <Activity size={15} color="var(--olive)"/>
                  <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Latest Assessment</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.875rem" }}>
                  <div>
                    <div style={{ fontSize:"1.625rem", fontWeight:900, color:latestRes.prediction==="Autism"?"#ba1a1a":"#197040", fontFamily:"'Manrope', sans-serif" }}>{(latestRes.probability*100).toFixed(0)}%</div>
                    <div style={{ fontSize:"0.875rem", fontWeight:700, color:"var(--ink-dark)" }}>{latestRes.prediction}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"0.75rem", color:"var(--ink-light)" }}>{latestRes.assessment_type}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--ink-light)" }}>{new Date(latestRes.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                </div>
                {/* Mini probability bar */}
                <div style={{ height:"8px", background:"var(--surface-highest)", borderRadius:"9999px", overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${latestRes.probability*100}%` }} transition={{ duration:0.9, delay:0.3, ease:"easeOut" }}
                    style={{ height:"100%", borderRadius:"9999px", background:latestRes.probability>=0.7?"#ba1a1a":latestRes.probability>=0.4?"#ae7600":"#197040" }} />
                </div>
                <button onClick={() => onNavigate("doctor-analysis",{patientId: String(patient.id)})} style={{ display:"flex", alignItems:"center", gap:"0.375rem", marginTop:"1rem", background:"none", border:"none", cursor:"pointer", color:"var(--olive)", fontWeight:600, fontSize:"0.8125rem", fontFamily:"'Inter', sans-serif", padding:0 }}>
                  View Full Analysis <ChevronRight size={13}/>
                </button>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Notes + History */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            {/* Clinical Notes */}
            <motion.div {...fadeUp(0.1)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <FileText size={15} color="var(--olive)"/>
                  <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Clinical Notes</span>
                </div>
                <button style={{ display:"flex", alignItems:"center", gap:"0.25rem", background:"none", border:"1px solid var(--surface-highest)", borderRadius:"0.5rem", padding:"0.3125rem 0.625rem", cursor:"pointer", fontSize:"0.75rem", color:"var(--ink-mid)", fontFamily:"'Inter', sans-serif" }}>
                  <Edit3 size={12}/> Edit
                </button>
              </div>
              <div style={{ fontSize:"0.9rem", color:"var(--ink-mid)", lineHeight:1.75, fontFamily:"'Inter', sans-serif", background:"var(--surface)", padding:"1rem", borderRadius:"0.75rem", border:"1px solid var(--surface-highest)" }}>
                {patient.clinical_notes ?? "No clinical notes recorded."}
              </div>
            </motion.div>

            {/* Assessment History */}
            <motion.div {...fadeUp(0.15)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <TrendingUp size={15} color="var(--olive)"/>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Assessment History</span>
              </div>
              {results.length ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {results.map((res) => (
                    <div key={res.id} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem", background:"var(--surface)", borderRadius:"0.875rem", border:"1px solid var(--surface-highest)" }}>
                      <div style={{ width:"2.5rem", height:"2.5rem", borderRadius:"0.625rem", background:res.prediction==="Autism"?"rgba(186,26,26,0.1)":"rgba(25,110,60,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {res.prediction==="Autism" ? <AlertCircle size={16} color="#ba1a1a"/> : <CheckCircle2 size={16} color="#197040"/>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:"0.875rem", color:"var(--ink-dark)" }}>{res.assessment_type} analysis</div>
                        <div style={{ fontSize:"0.75rem", color:"var(--ink-light)" }}>{new Date(res.created_at).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:"1rem", fontWeight:800, color:res.prediction==="Autism"?"#ba1a1a":"#197040", fontFamily:"'Manrope', sans-serif" }}>{(res.probability*100).toFixed(0)}%</div>
                        <div style={{ fontSize:"0.75rem", color:"var(--ink-light)" }}>{res.prediction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", color:"var(--ink-light)", padding:"2rem", fontSize:"0.875rem" }}>No assessments on file</div>
              )}
            </motion.div>

            {/* Appointment history */}
            <motion.div {...fadeUp(0.2)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <Calendar size={15} color="var(--olive)"/>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Appointment History</span>
              </div>
              {appts.length ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                  {appts.map(appt => (
                    <div key={appt.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 1rem", background:"var(--surface)", borderRadius:"0.75rem", border:"1px solid var(--surface-highest)" }}>
                      <div>
                        <div style={{ fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:"0.875rem", color:"var(--ink-dark)" }}>{appt.appt_type.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</div>
                        <div style={{ fontSize:"0.75rem", color:"var(--ink-light)" }}>{new Date(appt.scheduled_at).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})} · {new Date(appt.scheduled_at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</div>
                      </div>
                      <span style={{ fontSize:"0.6875rem", fontWeight:700, fontFamily:"'Manrope', sans-serif", padding:"0.2rem 0.5rem", borderRadius:"9999px", textTransform:"capitalize",
                        background: appt.status==="completed"?"rgba(25,110,60,0.1)":appt.status==="cancelled"?"rgba(186,26,26,0.1)":"rgba(90,100,0,0.1)",
                        color: appt.status==="completed"?"#197040":appt.status==="cancelled"?"#ba1a1a":"var(--olive)",
                      }}>{appt.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", color:"var(--ink-light)", padding:"1.5rem", fontSize:"0.875rem" }}>No appointment history</div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
