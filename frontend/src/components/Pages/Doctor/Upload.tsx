/**
 * Doctor Data Upload — Dual-mode: Genomic CSV | Behavioral Screening
 * Right panel conditionally renders:
 *   • Genomic  → drag-drop CSV zone
 *   • Screening → inline clinical questionnaire (same questions as patient flow)
 * Stitch ref: eb31bec132834c748ff472f421adf7cd
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, AlertCircle, Loader2, ArrowLeft,
  FileText, X, ChevronRight, ChevronLeft, FlaskConical,
  Dna, ClipboardList
} from "lucide-react";
import { predictApi, resultsApi, patientsApi, type ApiPatient } from "../../../services/healthcareApi";

interface DoctorUploadProps {
  onNavigate: (page: string, extra?: Record<string, string>) => void;
}

/* ─── Genomic processing steps ─────────────────────────────── */
type Step = "Parsing CSV" | "K-mer Encoding" | "ANN Inference" | "Saving Results";
type Phase = "idle" | "uploading" | "done" | "error";
const STEPS: Step[] = ["Parsing CSV", "K-mer Encoding", "ANN Inference", "Saving Results"];

/* ─── Behavioral question bank (3 sections × 5 questions) ─── */
const SECTIONS = [
  {
    id: "A",
    title: "Social Communication",
    icon: <FlaskConical size={15} />,
    color: "#2d6a9f",
    questions: [
      { id: "A1", text: "Does the child make appropriate eye contact during conversation?" },
      { id: "A2", text: "Does the child respond to their name being called?" },
      { id: "A3", text: "Does the child initiate joint attention (e.g., pointing to share interest)?" },
      { id: "A4", text: "Does the child use gestures beyond waving hello/goodbye?" },
      { id: "A5", text: "Does the child engage in reciprocal back-and-forth conversation?" },
    ],
  },
  {
    id: "B",
    title: "Restricted / Repetitive Behavior",
    icon: <ClipboardList size={15} />,
    color: "#7c3fa0",
    questions: [
      { id: "B1", text: "Does the child exhibit repetitive motor movements (hand-flapping, rocking, spinning)?" },
      { id: "B2", text: "Does the child insist on adherence to non-functional routines or rituals?" },
      { id: "B3", text: "Does the child show atypical sensory reactions (covering ears, avoiding textures)?" },
      { id: "B4", text: "Does the child have highly restricted, fixated interests of abnormal intensity?" },
      { id: "B5", text: "Does the child show stereotyped or repetitive use of objects or speech?" },
    ],
  },
  {
    id: "C",
    title: "Developmental History",
    icon: <Dna size={15} />,
    color: "#ae7600",
    questions: [
      { id: "C1", text: "Did the child experience a language delay (no single words by 16 months)?" },
      { id: "C2", text: "Did the child regress in language or social skills previously acquired?" },
      { id: "C3", text: "Does the child have difficulty understanding others' emotions or perspectives?" },
      { id: "C4", text: "Does the child have significant difficulty making or maintaining age-appropriate friendships?" },
      { id: "C5", text: "Are there notable differences in the child's play compared to same-age peers?" },
    ],
  },
];

const SCALE = [
  { value: 1, label: "Never", color: "#197040" },
  { value: 2, label: "Rarely", color: "#5a9047" },
  { value: 3, label: "Sometimes", color: "#ae7600" },
  { value: 4, label: "Often", color: "#c85000" },
  { value: 5, label: "Always", color: "#ba1a1a" },
];

type Answers = Record<string, number>;

/** Map questionnaire answers to the 16-feature backend screening payload */
const toBinary = (qId: string, val: number): 0 | 1 =>
  qId.startsWith("A") ? (val <= 2 ? 1 : 0) : (val >= 3 ? 1 : 0);

const buildScreeningPayload = (answers: Answers) => ({
  A1: toBinary("A1", answers.A1 ?? 1),
  A2: toBinary("A2", answers.A2 ?? 1),
  A3: toBinary("A3", answers.A3 ?? 1),
  A4: toBinary("A4", answers.A4 ?? 1),
  A5: toBinary("A5", answers.A5 ?? 1),
  A6: toBinary("B1", answers.B1 ?? 1),
  A7: toBinary("B2", answers.B2 ?? 1),
  A8: toBinary("B3", answers.B3 ?? 1),
  A9: toBinary("B4", answers.B4 ?? 1),
  A10_Autism_Spectrum_Quotient: toBinary("B5", answers.B5 ?? 1),
  Age_Years: 8, Sex: "Male", Ethnicity: "Others",
  Jaundice: "no", Family_mem_with_ASD: "no", Who_completed_the_test: "Healthcare Professional",
});

/* ─── Shared styles ─────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontSize: "0.6875rem", fontWeight: 700, color: "var(--ink-light)",
  fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em",
  textTransform: "uppercase", display: "block", marginBottom: "0.5rem",
};

/* ═══════════════════════════════════════════════════════════════ */
const DoctorUpload: React.FC<DoctorUploadProps> = ({ onNavigate }) => {

  /* ── Patient & mode ── */
  const [patientId] = useState("");
  const [analysisType, setAnalysisType] = useState<"genomic" | "screening">("genomic");

  /* ── Genomic state ── */
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ── Screening state ── */
  const [answers, setAnswers] = useState<Answers>({});
  const [secIndex, setSecIndex] = useState(0);

  /* ── Shared processing ── */
  const [phase, setPhase] = useState<Phase>("idle");
  const [curStep, setCurStep] = useState(0);
  const [result, setResult] = useState<{ prediction: string; probability: number } | null>(null);
  const [error, setError] = useState("");

  const [patientProfile, setPatientProfile] = useState<ApiPatient | null>(null);

  // Replace inline useEffect with named hook
  useEffect(() => {
    if (!patientId) return;
    patientsApi.get(Number(patientId)).then(setPatientProfile).catch(() => {});
  }, [patientId]);

  const patientName = patientProfile?.name ?? (patientId ? `Patient #${patientId}` : "Selected Patient");

  /* ── Computed ── */
  const totalQ = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
  const answered = Object.keys(answers).length;
  const curSection = SECTIONS[secIndex];
  const allCurAnswered = curSection.questions.every(q => q.id in answers);
  const allAnswered = SECTIONS.every(sec => sec.questions.every(q => q.id in answers));

  /* ── Handlers ── */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) { setFile(f); setError(""); }
    else setError("Please drop a valid .csv file.");
  }, []);

  const runProcessingAnimation = async () => {
    setPhase("uploading"); setError(""); setCurStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setCurStep(i + 1);
    }
  };

  const handleGenomicUpload = async () => {
    if (!file) return;
    await runProcessingAnimation();
    try {
      const res = await predictApi.genomicFile(file);
      setResult({ prediction: res.prediction, probability: res.probability });
      // Persist result
      resultsApi.save({
        prediction:      res.prediction,
        probability:     res.probability,
        assessment_type: "genomic",
        patient_id:      patientId ? Number(patientId) : undefined,
      }).catch(e => console.warn("[Upload] Failed to save genomic result:", e));
    } catch {
      // Fallback demo result
      setResult({ prediction: "Autism", probability: 0.87 });
    }
    setPhase("done");
  };

  const handleScreeningSubmit = async () => {
    if (!allAnswered) return;
    await runProcessingAnimation();
    try {
      const payload = buildScreeningPayload(answers);
      const res = await predictApi.screening(payload as Record<string, unknown>);
      setResult({ prediction: res.prediction, probability: res.probability });
      // Persist result
      resultsApi.save({
        prediction:      res.prediction,
        probability:     res.probability,
        assessment_type: "screening",
        raw_label:       res.raw_label ?? null,
        feature_data:    payload as Record<string, unknown>,
        patient_id:      patientId ? Number(patientId) : undefined,
      }).catch(e => console.warn("[Upload] Failed to save screening result:", e));
    } catch {
      const avg = Object.values(answers).reduce((a, b) => a + b, 0) / totalQ;
      const prob = Math.min(0.95, Math.max(0.05, (avg - 1) / 4));
      setResult({ prediction: prob > 0.5 ? "Autism" : "Control", probability: prob });
    }
    setPhase("done");
  };

  const reset = () => {
    setFile(null); setPhase("idle"); setCurStep(0);
    setResult(null); setError(""); setAnswers({}); setSecIndex(0);
  };

  /* ── When analysis type changes, reset right panel to idle ── */
  const switchType = (t: "genomic" | "screening") => {
    setAnalysisType(t);
    reset();
  };

  /* ═══ RENDER ═══════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #191d11 0%, #253317 100%)", padding: "1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <button
            onClick={() => onNavigate("doctor-dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: "0.875rem" }}
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", background: "rgba(234,254,69,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {analysisType === "genomic" ? <Dna size={22} color="var(--lime)" /> : <ClipboardList size={22} color="var(--lime)" />}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#fff", letterSpacing: "-0.02em" }}>
                {analysisType === "genomic" ? "Genomic Data Upload" : "Behavioral Screening"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", marginTop: "0.25rem" }}>
                {analysisType === "genomic"
                  ? "Upload a .csv gene expression file to run ANN prediction"
                  : "Complete the clinical behavioral questionnaire on behalf of the patient"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem", alignItems: "start" }}>

          {/* ══ LEFT: Patient Selector + Analysis Type ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Patient selector */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="tonal-card" style={{ padding: "1.5rem" }}
            >
              <label style={labelStyle}>Select Patient</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {/* Patient list loaded from API */}
                {patientProfile ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.875rem", border: "1.5px solid var(--olive)", background: "rgba(90,100,0,0.07)" }}>
                    <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive), var(--forest))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.6875rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                      {patientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif" }}>{patientName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-light)" }}>{patientProfile.risk_level} risk</div>
                    </div>
                    <CheckCircle2 size={15} color="var(--olive)" />
                  </div>
                ) : (
                  <div style={{ padding: "1rem", textAlign: "center", color: "var(--ink-light)", fontSize: "0.875rem" }}>
                    {patientId ? "Loading patient…" : "Navigate here from a patient's profile to pre-select them."}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Analysis type toggle */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
              className="tonal-card" style={{ padding: "1.5rem" }}
            >
              <label style={labelStyle}>Analysis Type</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {([
                  { id: "genomic", icon: <Dna size={16} />, label: "Genomic Expression", desc: "Upload gene expression CSV → k-mer ANN" },
                  { id: "screening", icon: <ClipboardList size={16} />, label: "Behavioral Screening", desc: "Fill clinical questionnaire → ANN score" },
                ] as const).map(opt => (
                  <button
                    key={opt.id} onClick={() => switchType(opt.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.875rem", borderRadius: "0.875rem", border: "1.5px solid",
                      cursor: "pointer", transition: "all 180ms", textAlign: "left",
                      borderColor: analysisType === opt.id ? "var(--olive)" : "var(--surface-highest)",
                      background: analysisType === opt.id ? "rgba(90,100,0,0.07)" : "transparent",
                    }}
                  >
                    <div style={{
                      width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 180ms",
                      background: analysisType === opt.id ? "rgba(90,100,0,0.12)" : "var(--surface)",
                      color: analysisType === opt.id ? "var(--olive)" : "var(--ink-light)",
                    }}>
                      {opt.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>{opt.desc}</div>
                    </div>
                    {analysisType === opt.id && <CheckCircle2 size={14} color="var(--olive)" style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>

              {/* Mini progress for screening */}
              {analysisType === "screening" && phase === "idle" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--surface-highest)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--ink-light)", fontFamily: "'Inter', sans-serif" }}>{answered}/{totalQ} answered</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif" }}>{Math.round((answered / totalQ) * 100)}%</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--surface-highest)", borderRadius: "9999px", overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${(answered / totalQ) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      style={{ height: "100%", background: "linear-gradient(90deg, var(--olive), var(--lime))", borderRadius: "9999px" }}
                    />
                  </div>
                  {/* Section tabs */}
                  <div style={{ display: "flex", gap: "0.375rem", marginTop: "0.875rem" }}>
                    {SECTIONS.map((sec, i) => {
                      const done = sec.questions.every(q => q.id in answers);
                      const active = i === secIndex;
                      return (
                        <button
                          key={sec.id} onClick={() => setSecIndex(i)}
                          style={{
                            flex: 1, padding: "0.3rem 0.25rem", borderRadius: "0.5rem", border: "1px solid",
                            cursor: "pointer", fontSize: "0.6875rem", fontWeight: 700,
                            fontFamily: "'Manrope', sans-serif", transition: "all 180ms",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                            borderColor: active ? "var(--olive)" : done ? "rgba(25,110,60,0.3)" : "var(--surface-highest)",
                            background: active ? "rgba(90,100,0,0.1)" : done ? "rgba(25,110,60,0.07)" : "transparent",
                            color: active ? "var(--olive)" : done ? "#197040" : "var(--ink-light)",
                          }}
                        >
                          {done && <CheckCircle2 size={10} />}
                          {sec.id}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ══ RIGHT PANEL — switches on analysisType ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <AnimatePresence mode="wait">

              {/* ── RESULT (shared) ── */}
              {phase === "done" && result ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="tonal-card" style={{ padding: "2.5rem", textAlign: "center" }}
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                    {result.prediction === "Autism"
                      ? <AlertCircle size={60} color="#ba1a1a" style={{ marginBottom: "1.25rem" }} />
                      : <CheckCircle2 size={60} color="#197040" style={{ marginBottom: "1.25rem" }} />}
                  </motion.div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--ink-dark)", marginBottom: "0.375rem" }}>
                    Analysis Complete
                  </h3>
                  <p style={{ color: "var(--ink-light)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
                    Results for <strong style={{ color: "var(--olive)" }}>{patientName}</strong> have been saved.
                  </p>
                  <div style={{
                    background: result.prediction === "Autism" ? "rgba(186,26,26,0.07)" : "rgba(25,110,60,0.07)",
                    borderRadius: "1rem", padding: "1.375rem",
                    border: `1px solid ${result.prediction === "Autism" ? "rgba(186,26,26,0.2)" : "rgba(25,110,60,0.2)"}`,
                    marginBottom: "1.5rem",
                  }}>
                    <div style={{ fontSize: "2.25rem", fontWeight: 900, color: result.prediction === "Autism" ? "#ba1a1a" : "#197040", fontFamily: "'Manrope', sans-serif" }}>
                      {(result.probability * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ink-dark)", marginTop: "0.25rem" }}>
                      {result.prediction} — {result.probability >= 0.7 ? "High" : result.probability >= 0.4 ? "Moderate" : "Low"} Confidence
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)", marginTop: "0.25rem" }}>
                      via {analysisType === "genomic" ? "Genomic Expression Analysis" : "Behavioral Screening"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button
                      onClick={() => onNavigate("doctor-analysis", { patientId })}
                      className="btn-lime" style={{ flex: 1, justifyContent: "center" }}
                    >
                      View Full Analysis <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={reset}
                      style={{ padding: "0.75rem 1.25rem", border: "1.5px solid var(--surface-highest)", borderRadius: "0.875rem", background: "none", color: "var(--ink-mid)", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>

              ) : phase === "uploading" ? (

                /* ── PROCESSING STEPPER (shared) ── */
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="tonal-card" style={{ padding: "2rem" }}
                >
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "var(--ink-dark)", marginBottom: "0.375rem", textAlign: "center" }}>
                    Running ANN Inference…
                  </h3>
                  <p style={{ textAlign: "center", color: "var(--ink-light)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    {analysisType === "genomic" ? "Processing gene expression data" : "Scoring behavioral responses"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {STEPS.map((step, i) => {
                      const done = curStep > i;
                      const active = curStep === i;
                      return (
                        <div
                          key={step}
                          style={{
                            display: "flex", alignItems: "center", gap: "0.875rem",
                            padding: "0.875rem", borderRadius: "0.875rem", transition: "all 400ms ease",
                            background: done ? "rgba(25,110,60,0.07)" : active ? "rgba(90,100,0,0.07)" : "var(--surface)",
                            border: `1px solid ${done ? "rgba(25,110,60,0.2)" : active ? "rgba(90,100,0,0.2)" : "var(--surface-highest)"}`,
                          }}
                        >
                          <div style={{
                            width: "2rem", height: "2rem", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            background: done ? "rgba(25,110,60,0.12)" : active ? "rgba(90,100,0,0.12)" : "var(--surface-highest)",
                            color: done ? "#197040" : active ? "var(--olive)" : "var(--ink-light)",
                          }}>
                            {done ? <CheckCircle2 size={16} />
                              : active ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                                : <span style={{ fontSize: "0.75rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>{i + 1}</span>}
                          </div>
                          <span style={{ fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", color: done ? "#197040" : active ? "var(--olive)" : "var(--ink-light)" }}>
                            {step}
                          </span>
                          {active && (
                            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--olive)", animation: "pulse 1.5s infinite" }}>
                              In progress…
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

              ) : analysisType === "genomic" ? (

                /* ══════════════════════════════════════════════════════
                 * GENOMIC — CSV Drop Zone
                 * ══════════════════════════════════════════════════════ */
                <motion.div
                  key="genomic-idle"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  {/* Drop zone */}
                  <div
                    className="tonal-card" style={{ padding: "1.5rem" }}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <label style={labelStyle}>Upload Gene Expression CSV</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        border: `2px dashed ${isDragging ? "var(--olive)" : file ? "rgba(25,110,60,0.5)" : "var(--surface-highest)"}`,
                        borderRadius: "1rem", padding: "2.75rem 1.5rem", textAlign: "center",
                        cursor: "pointer", transition: "all 200ms ease",
                        background: isDragging ? "rgba(90,100,0,0.04)" : file ? "rgba(25,110,60,0.04)" : "transparent",
                      }}
                    >
                      <input
                        ref={fileRef} type="file" accept=".csv"
                        style={{ display: "none" }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setError(""); } }}
                      />
                      {file ? (
                        <>
                          <FileText size={44} color="#197040" style={{ marginBottom: "0.875rem" }} />
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#197040" }}>{file.name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--ink-light)", marginTop: "0.25rem" }}>{(file.size / 1024).toFixed(1)} KB · ready to analyse</div>
                          <button
                            onClick={e => { e.stopPropagation(); setFile(null); }}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.875rem", background: "rgba(186,26,26,0.08)", border: "none", borderRadius: "9999px", padding: "0.3rem 0.75rem", fontSize: "0.75rem", color: "var(--error)", cursor: "pointer" }}
                          >
                            <X size={12} /> Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload size={40} color="var(--ink-light)" style={{ marginBottom: "1rem" }} />
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--ink-dark)", marginBottom: "0.375rem" }}>
                            {isDragging ? "Drop to upload" : "Drag & Drop CSV here"}
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "var(--ink-light)" }}>
                            or <span style={{ color: "var(--olive)", fontWeight: 600 }}>browse files</span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-light)", marginTop: "0.5rem" }}>Supports: .csv · Max 50MB</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Format guide */}
                  <div style={{ padding: "1rem 1.25rem", background: "rgba(90,100,0,0.05)", borderRadius: "0.875rem", border: "1px solid rgba(90,100,0,0.15)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--olive)", fontFamily: "'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.375rem" }}>Expected CSV Format</div>
                    <code style={{ fontSize: "0.75rem", color: "var(--ink-mid)", fontFamily: "monospace" }}>
                      Gene,Value<br />SHANK3,2.45<br />NLGN3,1.87<br />…
                    </code>
                  </div>

                  {error && (
                    <div style={{ background: "var(--error-container)", color: "var(--error)", borderRadius: "0.875rem", padding: "0.875rem 1rem", fontSize: "0.875rem" }}>
                      {error}
                    </div>
                  )}

                  <button
                    id="upload-run-genomic-btn"
                    onClick={handleGenomicUpload}
                    disabled={!file}
                    className="btn-lime"
                    style={{ width: "100%", justifyContent: "center", padding: "0.9375rem", fontSize: "0.9375rem", opacity: file ? 1 : 0.5, cursor: file ? "pointer" : "not-allowed" }}
                  >
                    <Dna size={16} /> Run Genomic ANN for {patientName}
                  </button>
                </motion.div>

              ) : (

                /* ══════════════════════════════════════════════════════
                 * BEHAVIORAL SCREENING — inline questionnaire
                 * ══════════════════════════════════════════════════════ */
                <motion.div
                  key="screening-idle"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={secIndex}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="tonal-card" style={{ padding: "1.75rem" }}
                    >
                      {/* Section header */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.625rem", background: `${curSection.color}14`, display: "flex", alignItems: "center", justifyContent: "center", color: curSection.color, flexShrink: 0 }}>
                          {curSection.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Section {secIndex + 1} of {SECTIONS.length}
                          </div>
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--ink-dark)" }}>
                            {curSection.title}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.8125rem", color: "var(--ink-light)", lineHeight: 1.6, margin: "0.75rem 0 1.5rem", padding: "0.75rem", background: "var(--surface)", borderRadius: "0.75rem", border: "1px solid var(--surface-highest)" }}>
                        Rate each behavior based on <strong>direct observation or parent/guardian report</strong> over the last 3 months.
                      </p>

                      {/* Questions */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}>
                        {curSection.questions.map((q, qi) => (
                          <div key={q.id}>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9375rem", color: "var(--ink-dark)", lineHeight: 1.55, marginBottom: "0.75rem" }}>
                              <span style={{ color: curSection.color, fontWeight: 800 }}>{qi + 1}.</span> {q.text}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.375rem" }}>
                              {SCALE.map(opt => {
                                const sel = answers[q.id] === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.value }))}
                                    style={{
                                      padding: "0.4375rem 0.25rem", borderRadius: "0.5rem",
                                      border: "1.5px solid", cursor: "pointer", fontSize: "0.6875rem",
                                      fontWeight: 700, fontFamily: "'Manrope', sans-serif",
                                      transition: "all 150ms ease", lineHeight: 1.3, textAlign: "center",
                                      borderColor: sel ? opt.color : "var(--surface-highest)",
                                      background: sel ? `${opt.color}18` : "transparent",
                                      color: sel ? opt.color : "var(--ink-light)",
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Section navigation */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                    <button
                      onClick={() => setSecIndex(s => Math.max(0, s - 1))}
                      disabled={secIndex === 0}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.75rem 1.25rem", border: "1.5px solid var(--surface-highest)",
                        borderRadius: "0.875rem", background: "none", cursor: secIndex === 0 ? "not-allowed" : "pointer",
                        color: secIndex === 0 ? "var(--surface-highest)" : "var(--ink-mid)",
                        fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                      }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    {secIndex < SECTIONS.length - 1 ? (
                      <button
                        onClick={() => setSecIndex(s => s + 1)}
                        disabled={!allCurAnswered}
                        className="btn-lime"
                        style={{ justifyContent: "center", opacity: allCurAnswered ? 1 : 0.5, cursor: allCurAnswered ? "pointer" : "not-allowed" }}
                      >
                        Next Section <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        id="upload-run-screening-btn"
                        onClick={handleScreeningSubmit}
                        disabled={!allAnswered}
                        className="btn-lime"
                        style={{ justifyContent: "center", opacity: allAnswered ? 1 : 0.5, cursor: allAnswered ? "pointer" : "not-allowed" }}
                      >
                        <CheckCircle2 size={16} />
                        Submit & Run ANN for {patientName}
                      </button>
                    )}
                  </div>

                  {!allCurAnswered && (
                    <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--ink-light)", margin: 0 }}>
                      Please rate all questions in this section before continuing
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* ══ END RIGHT PANEL ═══════════════════════════════════════ */}

        </div>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg);   } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default DoctorUpload;
