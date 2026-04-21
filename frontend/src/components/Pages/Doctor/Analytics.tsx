/**
 * Doctor Analytics — Technical Analysis Report
 * Confidence scores, feature importance, radar chart.
 * Stitch ref: c16280779cb74c1baa9913d005f073de
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid
} from "recharts";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle2, Download, ChevronDown } from "lucide-react";
import { patientsApi, resultsApi, type ApiPatient, type ApiResult } from "../../../services/healthcareApi";

interface DoctorAnalyticsProps {
  onNavigate: (page: string, extra?: Record<string,string>) => void;
  patientId: string;
}

const fadeUp = (delay = 0) => ({
  initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0 }, transition:{ duration:0.4, delay, ease:"easeOut" },
});

const DoctorAnalytics: React.FC<DoctorAnalyticsProps> = ({ onNavigate, patientId }) => {
  const [patients,   setPatients]   = useState<ApiPatient[]>([]);
  const [allResults, setAllResults] = useState<ApiResult[]>([]);
  const [selPatient, setSelPatient] = useState(patientId || "");

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      patientsApi.list(),
      selPatient ? resultsApi.list(Number(selPatient)) : Promise.resolve([] as ApiResult[]),
    ]).then(([pRes, rRes]) => {
      if (cancelled) return;
      if (pRes.status === "fulfilled") {
        const pts = pRes.value;
        setPatients(pts);
        if (!selPatient && pts.length) setSelPatient(String(pts[0].id));
      }
      if (rRes.status === "fulfilled") setAllResults(rRes.value);
    });
    return () => { cancelled = true; };
  }, []);

  // Reload results when patient selector changes
  useEffect(() => {
    if (!selPatient) return;
    resultsApi.list(Number(selPatient)).then(setAllResults).catch(() => setAllResults([]));
  }, [selPatient]);

  const result = allResults[0] ?? null;

  const isAutism  = result?.prediction === "Autism";
  const risk      = result ? (result.probability>=0.7?"high":result.probability>=0.4?"medium":"low") : "low";
  const riskColor = risk==="high"?"#ba1a1a":risk==="medium"?"#ae7600":"#197040";

  // Derive charts from feature_data JSON (saved by AssessmentPage / Upload)
  const featureData = result?.feature_data as Record<string, number> | null ?? null;
  const featureBar = featureData
    ? Object.entries(featureData)
        .filter(([k]) => k.startsWith("A"))
        .map(([name, value]) => ({ name, value: Number(value), importance: Number(value) }))
    : [];

  const radarData = featureData
    ? [
        { subject: "Social",   value: ((featureData.A1??0)+(featureData.A2??0)+(featureData.A3??0)+(featureData.A4??0)+(featureData.A5??0))*20 },
        { subject: "Behavior", value: ((featureData.A6??0)+(featureData.A7??0)+(featureData.A8??0)+(featureData.A9??0))*25 },
        { subject: "Language", value: (featureData["A10_Autism_Spectrum_Quotient"]??0)*100 },
        { subject: "Sensory",  value: Math.round((result?.probability ?? 0)*80) },
        { subject: "Overall",  value: Math.round((result?.probability ?? 0)*100) },
      ]
    : [];

  return (
    <div style={{ minHeight:"100vh", background:"var(--surface)", paddingBottom:"3rem" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #191d11 0%, #253317 100%)", padding:"1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <button onClick={() => onNavigate("doctor-patients")} style={{ display:"flex", alignItems:"center", gap:"0.375rem", background:"none", border:"none", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:"0.875rem", fontFamily:"'Inter', sans-serif", marginBottom:"0.875rem" }}>
            <ArrowLeft size={14}/> Patient Management
          </button>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <h1 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.875rem", color:"#fff", letterSpacing:"-0.02em" }}>ANN Analysis Report</h1>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.9375rem", marginTop:"0.375rem" }}>Genomic & behavioral marker deep-analysis</p>
            </div>

            {/* Patient selector */}
            <div style={{ position:"relative" }}>
              <select value={selPatient} onChange={e=>setSelPatient(e.target.value)}
                style={{ appearance:"none", padding:"0.625rem 2.5rem 0.625rem 1rem", borderRadius:"0.875rem", border:"1px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.07)", color:"#fff", fontSize:"0.875rem", fontFamily:"'Inter', sans-serif", fontWeight:600, cursor:"pointer", outline:"none" }}>
                {patients.map(p => <option key={p.id} value={String(p.id)} style={{ background:"#1a2744", color:"#fff" }}>{p.name}</option>)}
              </select>
              <ChevronDown size={14} color="rgba(255,255,255,0.6)" style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
            </div>
          </div>
        </div>
      </div>

      {!result ? (
        <div style={{ textAlign:"center", padding:"4rem", color:"var(--ink-light)" }}>
          <AlertCircle size={40} style={{ marginBottom:"1rem", opacity:0.4 }}/>
          <div>No analysis results on file for this patient.</div>
          <button onClick={() => onNavigate("doctor-upload",{patientId:selPatient})} className="btn-lime" style={{ marginTop:"1rem" }}>Upload Genomic Data</button>
        </div>
      ) : (
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"2rem 1.5rem" }}>

          {/* ── Verdict banner ── */}
          <motion.div {...fadeUp(0)} className="tonal-card" style={{ padding:"1.75rem", marginBottom:"1.5rem", border:`1.5px solid ${riskColor}35`, background:`${riskColor}08` }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"1.5rem", alignItems:"center" }}>
              {[
                { label:"Prediction",       value: result?.prediction ?? "N/A", big:true, color:riskColor },
                { label:"ASD Probability",  value: result ? `${(result.probability*100).toFixed(1)}%` : "—", big:true, color:riskColor },
                { label:"Assessment Type",  value: result?.assessment_type ?? "—", big:false, color:"var(--ink-dark)" },
                { label:"Date",             value: result ? new Date(result.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—", big:false, color:"var(--ink-dark)" },
              ].map(({ label, value, big, color }) => (
                <div key={label}>
                  <div style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--ink-light)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.375rem" }}>{label}</div>
                  <div style={{ fontSize:big?"1.875rem":"1.25rem", fontWeight:900, color, fontFamily:"'Manrope', sans-serif", letterSpacing:big?"-0.03em":"-0.01em" }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1.25rem", paddingTop:"1.25rem", borderTop:"1px solid var(--surface-highest)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                {isAutism ? <AlertCircle size={15} color={riskColor}/> : <CheckCircle2 size={15} color={riskColor}/>}
                <span style={{ fontSize:"0.875rem", fontWeight:700, color:riskColor, fontFamily:"'Manrope', sans-serif" }}>
                  {isAutism ? "ASD Biomarkers Detected" : "No Significant ASD Biomarkers"}
                </span>
                <span style={{ fontSize:"0.8125rem", color:"var(--ink-light)" }}>— Analyzed {result ? new Date(result.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : ""}</span>
              </div>
              <button style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 1rem", border:"1.5px solid var(--surface-highest)", borderRadius:"0.75rem", background:"none", color:"var(--ink-mid)", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:600, fontSize:"0.8125rem" }}>
                <Download size={13}/> Export Report
              </button>
            </div>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>

            {/* Feature importance chart */}
            <motion.div {...fadeUp(0.1)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <TrendingUp size={15} color="var(--olive)"/>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Gene Expression / Feature Importance</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={featureBar} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-highest)" horizontal={false}/>
                  <XAxis type="number" tick={{ fontSize:11, fill:"var(--ink-light)" }} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="name" tick={{ fontSize:12, fontFamily:"'Inter', sans-serif", fill:"var(--ink-mid)" }} axisLine={false} tickLine={false} width={60}/>
                  <Tooltip formatter={(v:number) => [v.toFixed(2), "Expression"]} />
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {featureBar.map((_,i) => <Cell key={i} fill={i<2?"#ba1a1a":i<4?"#ae7600":"var(--olive)"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Behavioral radar */}
            <motion.div {...fadeUp(0.15)} className="tonal-card" style={{ padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Behavioral Profile Radar</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--surface-highest)"/>
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fontFamily:"'Inter', sans-serif", fill:"var(--ink-mid)" }}/>
                  <Radar name="Score" dataKey="value" stroke={riskColor} fill={riskColor} fillOpacity={0.18} strokeWidth={2.5}/>
                  <Tooltip formatter={(v:number) => [`${v}/100`, "Score"]}/>
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Feature table from feature_data */}
          <motion.div {...fadeUp(0.2)} className="tonal-card" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
            <div style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>Biomarker Detail Table</div>
            <div style={{ overflowX:"auto" }}>
              {featureBar.length ? (
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1.5px solid var(--surface-highest)" }}>
                      {["Feature","Value","Importance Bar"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"0.5rem 0.875rem", fontSize:"0.6875rem", fontWeight:700, color:"var(--ink-light)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.07em", textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureBar.map((f, i) => (
                      <tr key={f.name} style={{ borderBottom:"1px solid var(--surface-highest)" }}
                        onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="var(--surface)"}
                        onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                        <td style={{ padding:"0.75rem 0.875rem", fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"0.9rem", color:"var(--ink-dark)" }}>{f.name}</td>
                        <td style={{ padding:"0.75rem 0.875rem", fontFamily:"'Inter', sans-serif", fontSize:"0.875rem", color:"var(--ink-mid)" }}>{Number(f.value).toFixed(0)}</td>
                        <td style={{ padding:"0.75rem 0.875rem" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
                            <div style={{ flex:1, height:"6px", background:"var(--surface-highest)", borderRadius:"9999px", minWidth:"80px" }}>
                              <div style={{ height:"100%", borderRadius:"9999px", width:`${Number(f.importance)*100}%`, background:i<2?"#ba1a1a":i<4?"#ae7600":"var(--olive)" }}/>
                            </div>
                            <span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--ink-dark)", fontFamily:"'Manrope', sans-serif", width:"3rem", textAlign:"right" }}>{(Number(f.importance)*100).toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign:"center", color:"var(--ink-light)", padding:"1.5rem", fontSize:"0.875rem" }}>No feature data available for this assessment.</div>
              )}
            </div>
          </motion.div>

          {/* Clinical Recommendations */}
          <motion.div {...fadeUp(0.25)} className="tonal-card" style={{ padding:"1.5rem" }}>
            <div style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>Clinical Recommendations</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
              {(result?.prediction === "Autism" ? [
                "Schedule a comprehensive developmental evaluation with a certified pediatric neurologist.",
                "Initiate early intervention programs including Applied Behavior Analysis (ABA) therapy.",
                "Coordinate with speech-language pathologists for communication support.",
                "Provide family counseling and caregiver support resources.",
                "Plan a 3-month follow-up genomic panel to monitor biomarker progression.",
              ] : [
                "Continue regular developmental milestone monitoring every 6 months.",
                "Encourage social skills enrichment programs appropriate for age group.",
                "Maintain open communication with school counselors and educators.",
                "Schedule a follow-up assessment in 12 months or if behavioral changes occur.",
              ]).map((rec, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", padding:"0.875rem", background:"var(--surface)", borderRadius:"0.875rem", border:"1px solid var(--surface-highest)" }}>
                  <div style={{ width:"1.5rem", height:"1.5rem", borderRadius:"50%", background:"rgba(90,100,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--olive)", fontSize:"0.6875rem", fontWeight:800, fontFamily:"'Manrope', sans-serif" }}>{i+1}</div>
                  <span style={{ fontSize:"0.875rem", color:"var(--ink-mid)", lineHeight:1.6, fontFamily:"'Inter', sans-serif" }}>{rec}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1.25rem", display:"flex", gap:"0.75rem" }}>
              <button onClick={() => onNavigate("doctor-patient-detail",{patientId:selPatient})} className="btn-lime" style={{ justifyContent:"center" }}>
                Patient Profile
              </button>
              <button onClick={() => onNavigate("doctor-upload",{patientId:selPatient})} style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.625rem 1.125rem", border:"1.5px solid var(--surface-highest)", borderRadius:"0.875rem", background:"none", color:"var(--ink-mid)", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:600, fontSize:"0.875rem" }}>
                Upload New Data
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorAnalytics;
