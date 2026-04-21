/**
 * PatientResultsPage — Medical Report for Patients
 * Simplified, patient-friendly ANN prediction report.
 * Stitch ref: e4826781152a4d43b57254f53b110e91
 */

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";
import {
  AlertCircle, CheckCircle2, ChevronRight, ArrowLeft,
  Calendar, Download, TrendingUp, Info
} from "lucide-react";
import { MOCK_ANALYSIS_RESULTS } from "../../../data/mockData";
import { useAuth } from "../../../context/AuthContext";

interface PatientResultsPageProps {
  onNavigate: (page: string) => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity:0, y:18 },
  animate: { opacity:1, y:0 },
  transition: { duration:0.45, delay, ease:"easeOut" },
});

function ProbabilityGauge({ value }: { value: number }) {
  const pct   = Math.round(value * 100);
  const isHigh = value >= 0.7;
  const isMed  = value >= 0.4 && value < 0.7;
  const color  = isHigh ? "#ba1a1a" : isMed ? "#ae7600" : "#197040";
  const circumference = 2 * Math.PI * 52;
  const dash  = (value * circumference * 0.75).toFixed(1);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem" }}>
      <svg width={140} height={100} viewBox="0 0 140 100">
        <path d="M 14 90 A 56 56 0 1 1 126 90" fill="none" stroke="var(--surface-highest)" strokeWidth={10} strokeLinecap="round" />
        <motion.path d="M 14 90 A 56 56 0 1 1 126 90" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset: parseFloat((circumference * 0.75 - parseFloat(dash)).toFixed(1)) }}
          transition={{ duration:1.2, ease:"easeOut", delay:0.3 }}
        />
        <text x="70" y="82" textAnchor="middle" fontFamily="'Manrope', sans-serif" fontWeight={800} fontSize={26} fill={color}>{pct}%</text>
      </svg>
      <div style={{ fontSize:"0.8125rem", color:"var(--ink-light)", fontFamily:"'Inter', sans-serif" }}>ASD Probability Score</div>
    </div>
  );
}

const PatientResultsPage: React.FC<PatientResultsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const result = useMemo(() => MOCK_ANALYSIS_RESULTS[0], []);
  const firstName = user?.name?.split(" ")[0] ?? "Patient";

  const isAutism = result.prediction === "Autism";
  const risk     = result.probability >= 0.7 ? "high" : result.probability >= 0.4 ? "medium" : "low";

  const riskConfig = {
    high:   { color:"#ba1a1a", bg:"rgba(186,26,26,0.08)",  badge:"High ASD Indicators",    icon:<AlertCircle size={18}/> },
    medium: { color:"#ae7600", bg:"rgba(174,118,0,0.08)",  badge:"Moderate ASD Indicators", icon:<Info size={18}/> },
    low:    { color:"#197040", bg:"rgba(25,110,60,0.08)",   badge:"Low ASD Indicators",      icon:<CheckCircle2 size={18}/> },
  }[risk];

  const radarData = result.behavioralMarkers.map(m => ({ subject: m.label.split(" ")[0], score: m.score }));

  return (
    <div style={{ minHeight:"100vh", background:"var(--surface)", paddingBottom:"3rem" }}>

      {/* Header bar */}
      <div style={{ background:"linear-gradient(135deg, #253317 0%, #2b4731 100%)", padding:"1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <button onClick={() => onNavigate("patient-dashboard")} style={{ display:"flex", alignItems:"center", gap:"0.375rem", background:"none", border:"none", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:"0.875rem", fontFamily:"'Inter', sans-serif", marginBottom:"0.875rem" }}>
            <ArrowLeft size={14}/> Dashboard
          </button>
          <h1 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.875rem", color:"#fff", letterSpacing:"-0.02em" }}>
            {firstName}'s Assessment Report
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.9375rem", marginTop:"0.375rem" }}>
            Based on {result.assessmentType === "genomic" ? "Genomic Analysis" : "Behavioral Screening"} · {new Date(result.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"900px", margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Main result banner */}
        <motion.div {...fadeUp(0)} className="tonal-card" style={{ padding:"2rem", marginBottom:"1.5rem", border:`1.5px solid ${riskConfig.color}40`, background:riskConfig.bg }}>
          <div style={{ display:"flex", gap:"1.5rem", alignItems:"center", flexWrap:"wrap" }}>
            <ProbabilityGauge value={result.probability} />
            <div style={{ flex:1, minWidth:"240px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.5rem", color:riskConfig.color }}>
                {riskConfig.icon}
                <span style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"0.875rem", letterSpacing:"0.06em", textTransform:"uppercase" }}>{riskConfig.badge}</span>
              </div>
              <h2 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.625rem", color:"var(--ink-dark)", letterSpacing:"-0.02em", lineHeight:1.25, marginBottom:"0.75rem" }}>
                {isAutism
                  ? "ASD Markers Detected"
                  : "No Significant ASD Markers"}
              </h2>
              <p style={{ fontSize:"0.9375rem", color:"var(--ink-mid)", lineHeight:1.65 }}>
                {isAutism
                  ? `Your assessment shows an ASD probability of ${Math.round(result.probability*100)}%. This report has been shared with your doctor. Please book a follow-up appointment to discuss next steps.`
                  : `Your assessment shows a low ASD probability of ${Math.round(result.probability*100)}%. Continue with regular check-ups as recommended by your doctor.`}
              </p>
              <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem", flexWrap:"wrap" }}>
                <button onClick={() => onNavigate("patient-book-appointment")} className="btn-lime" style={{ justifyContent:"center" }}>
                  <Calendar size={14}/> Book Follow-up
                </button>
                <button style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.625rem 1.125rem", border:"1.5px solid var(--surface-highest)", borderRadius:"0.875rem", background:"none", color:"var(--ink-mid)", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:600, fontSize:"0.875rem" }}>
                  <Download size={14}/> Download PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>

          {/* Behavioral markers */}
          <motion.div {...fadeUp(0.1)} className="tonal-card" style={{ padding:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
              <TrendingUp size={16} color="var(--olive)"/>
              <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Behavioral Markers</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              {result.behavioralMarkers.map(marker => {
                const mc = marker.score >= 70 ? "#ba1a1a" : marker.score >= 40 ? "#ae7600" : "#197040";
                return (
                  <div key={marker.label}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3125rem" }}>
                      <span style={{ fontSize:"0.8125rem", color:"var(--ink-mid)", fontFamily:"'Inter', sans-serif" }}>{marker.label}</span>
                      <span style={{ fontSize:"0.8125rem", fontWeight:700, color:mc, fontFamily:"'Manrope', sans-serif" }}>{marker.score}/100</span>
                    </div>
                    <div style={{ height:"6px", background:"var(--surface-highest)", borderRadius:"9999px", overflow:"hidden" }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${marker.score}%` }} transition={{ duration:0.8, delay:0.3, ease:"easeOut" }}
                        style={{ height:"100%", borderRadius:"9999px", background:mc }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Radar chart */}
          <motion.div {...fadeUp(0.15)} className="tonal-card" style={{ padding:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
              <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Profile Overview</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--surface-highest)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fontFamily:"'Inter', sans-serif", fill:"var(--ink-mid)" }} />
                <Radar name="Score" dataKey="score" stroke={isAutism ? "#ba1a1a" : "#197040"} fill={isAutism ? "#ba1a1a" : "#197040"} fillOpacity={0.18} strokeWidth={2} />
                <Tooltip formatter={(v: number) => [`${v}/100`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div {...fadeUp(0.2)} className="tonal-card" style={{ padding:"1.75rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
            <CheckCircle2 size={16} color="var(--olive)"/>
            <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"var(--olive)", fontFamily:"'Manrope', sans-serif", letterSpacing:"0.08em", textTransform:"uppercase" }}>Recommended Next Steps</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {result.recommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 + i * 0.06 }}
                style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", padding:"0.875rem", background:"var(--surface)", borderRadius:"0.875rem", border:"1px solid var(--surface-highest)" }}>
                <div style={{ width:"1.5rem", height:"1.5rem", borderRadius:"50%", background:"rgba(90,100,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--olive)", fontSize:"0.6875rem", fontWeight:800, fontFamily:"'Manrope', sans-serif" }}>{i+1}</div>
                <span style={{ fontSize:"0.875rem", color:"var(--ink-mid)", lineHeight:1.55, fontFamily:"'Inter', sans-serif" }}>{rec}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop:"1.5rem", padding:"1rem", background:"rgba(90,100,0,0.06)", borderRadius:"0.875rem", border:"1px solid rgba(90,100,0,0.15)" }}>
            <p style={{ fontSize:"0.8125rem", color:"var(--ink-mid)", lineHeight:1.65, fontFamily:"'Inter', sans-serif", margin:0 }}>
              <strong style={{ color:"var(--olive)" }}>Important:</strong> This report is generated by an AI model and should be reviewed by a licensed healthcare professional. It is not a substitute for clinical diagnosis.
            </p>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem" }}>
            <button onClick={() => onNavigate("patient-book-appointment")} className="btn-lime">
              <Calendar size={14}/> Book Appointment <ChevronRight size={14}/>
            </button>
            <button onClick={() => onNavigate("patient-assessment")} style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.625rem 1.125rem", border:"1.5px solid var(--surface-highest)", borderRadius:"0.875rem", background:"none", color:"var(--ink-mid)", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:600, fontSize:"0.875rem" }}>
              Retake Assessment
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientResultsPage;
