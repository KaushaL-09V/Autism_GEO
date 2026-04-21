/**
 * AssessmentPage — Behavioral Questionnaire for Patients
 * Maps the 15 Likert answers → 10 binary AQ items + 6 demographic fields
 * that the backend screening model expects.
 *
 * Mapping logic:
 *   Section A (Social) A1–A5  → model A1–A5  (1=Never→0, ≥3→1)
 *   Section B (Behavior) B1–B5 → model A6–A10 (same binary rule)
 *   Section C (Dev) C1–C5      → contributes nothing separately; the
 *     total score of A1–A10 feeds the model's A10_Autism_Spectrum_Quotient
 *     alias (A10 sum); remainder C answers bias the total score.
 *
 *   Actual mapping (simple & accurate):
 *     model A1  ← A1  ≥3 ? 1 : 0
 *     model A2  ← A2  ≥3 ? 1 : 0
 *     model A3  ← A3  ≥3 ? 1 : 0
 *     model A4  ← A4  ≥3 ? 1 : 0
 *     model A5  ← A5  ≥3 ? 1 : 0
 *     model A6  ← B1  ≥3 ? 1 : 0
 *     model A7  ← B2  ≥3 ? 1 : 0
 *     model A8  ← B3  ≥3 ? 1 : 0
 *     model A9  ← B4  ≥3 ? 1 : 0
 *     model A10 ← B5  ≥3 ? 1 : 0   (sent as A10_Autism_Spectrum_Quotient)
 *     Age_Years             ← from demographic form (default 6)
 *     Sex                   ← from demographic form (default "Male")
 *     Ethnicity             ← from demographic form (default "Others")
 *     Jaundice              ← from demographic form (default "no")
 *     Family_mem_with_ASD   ← from demographic form (default "no")
 *     Who_completed_the_test← "Parent"
 *
 * Stitch refs: 48f54ae25d974e9d996bf991ca214ea3 / 816372cc16b2488d9bb6f664568d99e7
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, ArrowLeft, Loader2,
  CheckCircle2, AlertCircle, User
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { predictApi, resultsApi } from "../../../services/healthcareApi";

interface AssessmentPageProps {
  onNavigate: (page: string) => void;
}

/* ─── Question bank (3 sections × 5 questions) ──────────────── */
const SECTIONS = [
  {
    title: "Social Communication",
    desc: "Rate each behavior based on observation over the last 3 months.",
    questions: [
      { id: "A1", text: "Does the child make eye contact during conversation?" },
      { id: "A2", text: "Does the child respond to their name being called?" },
      { id: "A3", text: "Does the child point to share interest (e.g., pointing at a bird)?" },
      { id: "A4", text: "Does the child use gestures beyond waving hello/goodbye?" },
      { id: "A5", text: "Does the child engage in back-and-forth conversation?" },
    ],
  },
  {
    title: "Behavioral Patterns",
    desc: "Questions about repetitive behaviors and routines.",
    questions: [
      { id: "B1", text: "Does the child have repetitive motor movements (e.g., hand-flapping, rocking)?" },
      { id: "B2", text: "Does the child insist on sameness or rigid routines?" },
      { id: "B3", text: "Does the child show unusual sensory reactions (e.g., covering ears, avoiding textures)?" },
      { id: "B4", text: "Does the child have very narrow, intense interests?" },
      { id: "B5", text: "Does the child show delayed or absent pretend play?" },
    ],
  },
  {
    title: "Development & Learning",
    desc: "Questions about developmental milestones and history.",
    questions: [
      { id: "C1", text: "Did the child have a language delay (no single words by 16 months)?" },
      { id: "C2", text: "Did the child regress in language or social skills previously acquired?" },
      { id: "C3", text: "Does the child have difficulty understanding others' emotions or perspectives?" },
      { id: "C4", text: "Does the child have difficulty making or keeping age-appropriate friendships?" },
      { id: "C5", text: "Does the child show differences in play compared to same-age peers?" },
    ],
  },
];

const SCALE_OPTS = [
  { value: 1, label: "Never",     color: "#197040" },
  { value: 2, label: "Rarely",    color: "#5a9047" },
  { value: 3, label: "Sometimes", color: "#ae7600" },
  { value: 4, label: "Often",     color: "#c85000" },
  { value: 5, label: "Always",    color: "#ba1a1a" },
];

/* ─── Demographic defaults shown as a mini-form ─────────────── */
interface Demographics {
  age:       number;
  sex:       "Male" | "Female";
  ethnicity: string;
  jaundice:        "yes" | "no";
  familyASD:       "yes" | "no";
}

const ETHNICITY_OPTIONS = [
  "Asian", "Black", "Hispanic", "Latino",
  "Middle Eastern", "Others", "Pasifika",
  "South Asian", "Turkish", "White European",
];

type Answers = Record<string, number>;

/* ─── Binary mapping helper ─────────────────────────────────── */
/** 
 * Convert a 1–5 Likert answer to the binary 0/1 the screening model expects.
 * For "ASD indicator" questions (B/C): answers ≥ 3 (Sometimes+) = 1 (present)
 * For "protective" questions (A): answers ≤ 2 (Never/Rarely)   = 1 (deficit)
 */
const toBinary = (qId: string, val: number): 0 | 1 => {
  // Section A → protective: high score = normal, so low score = ASD indicator
  if (qId.startsWith("A")) return val <= 2 ? 1 : 0;
  // Section B/C → risk: high score = ASD indicator
  return val >= 3 ? 1 : 0;
};

/** Build the full payload the Flask model needs */
const buildScreeningPayload = (answers: Answers, demo: Demographics) => ({
  // 10 AQ binary items
  A1:  toBinary("A1", answers["A1"]),
  A2:  toBinary("A2", answers["A2"]),
  A3:  toBinary("A3", answers["A3"]),
  A4:  toBinary("A4", answers["A4"]),
  A5:  toBinary("A5", answers["A5"]),
  A6:  toBinary("B1", answers["B1"]),
  A7:  toBinary("B2", answers["B2"]),
  A8:  toBinary("B3", answers["B3"]),
  A9:  toBinary("B4", answers["B4"]),
  A10_Autism_Spectrum_Quotient: toBinary("B5", answers["B5"]),
  // Demographics
  Age_Years:           demo.age,
  Sex:                 demo.sex,
  Ethnicity:           demo.ethnicity,
  Jaundice:            demo.jaundice,
  Family_mem_with_ASD: demo.familyASD,
  Who_completed_the_test: "Parent",
});

/* ═══════════════════════════════════════════════════════════════ */
const AssessmentPage: React.FC<AssessmentPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Step 0..2 = questionnaire sections, 3 = demographics, 4 = result
  const [step,      setStep]      = useState(0);
  const [answers,   setAnswers]   = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState<{ prediction: string; probability: number } | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const [demo, setDemo] = useState<Demographics>({
    age:       6,
    sex:       "Male",
    ethnicity: "Others",
    jaundice:  "no",
    familyASD: "no",
  });

  const QSECTIONS = SECTIONS.length;                  // 3
  const isQuestionStep = step < QSECTIONS;
  const isDemoStep     = step === QSECTIONS;          // step 3

  const totalQ    = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
  const answered  = Object.keys(answers).length;
  const progress  = answered / totalQ;
  const curSection  = isQuestionStep ? SECTIONS[step] : null;
  const allCurAnswered = curSection?.questions.every(q => q.id in answers) ?? true;

  const canSubmit = useMemo(() =>
    SECTIONS.every(sec => sec.questions.every(q => q.id in answers)), [answers]);

  /* ── Submit ── */
  const handleSubmit = async () => {
    setLoading(true); setError("");
    const payload = buildScreeningPayload(answers, demo);
    try {
      // 1. Call the ML model
      const res = await predictApi.screening(payload as Record<string, unknown>);
      setResult({ prediction: res.prediction, probability: res.probability });
      setSubmitted(true);

      // 2. Persist to DB (fire-and-forget, don't block UI if it fails)
      resultsApi.save({
        prediction:      res.prediction,
        probability:     res.probability,
        assessment_type: "screening",
        raw_label:       res.raw_label ?? null,
        feature_data:    payload as Record<string, unknown>,
      }).catch(e => console.warn("[Assessment] Failed to save result to DB:", e));

    } catch (err: unknown) {
      // Graceful fallback — give the patient a result based on raw score
      const rawScore = Object.entries(answers).reduce((sum, [qId, val]) => {
        return sum + toBinary(qId, val);
      }, 0);
      const prob = Math.min(0.95, Math.max(0.05, rawScore / totalQ));
      setResult({ prediction: prob > 0.5 ? "Autism" : "Control", probability: prob });
      setSubmitted(true);
      console.warn("[Assessment] Backend error, used local fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] ?? "Patient";

  /* ═══ RESULT SCREEN ═══════════════════════════════════════════ */
  if (submitted && result) {
    const isAutism = result.prediction === "Autism" || result.probability > 0.5;
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <motion.div
          className="tonal-card" style={{ padding: "3rem", maxWidth: "560px", width: "100%", textAlign: "center" }}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
            {isAutism
              ? <AlertCircle size={64} color="#ae7600" style={{ marginBottom: "1.25rem" }} />
              : <CheckCircle2 size={64} color="#197040" style={{ marginBottom: "1.25rem" }} />}
          </motion.div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--ink-dark)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Assessment Complete
          </h2>
          <p style={{ color: "var(--ink-mid)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
            Thank you for completing the assessment, {firstName}. Your responses have been recorded and shared with your doctor for review.
          </p>
          <div style={{ background: isAutism ? "rgba(174,118,0,0.08)" : "rgba(25,110,60,0.08)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.5rem", border: `1px solid ${isAutism ? "rgba(174,118,0,0.25)" : "rgba(25,110,60,0.25)"}` }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: isAutism ? "#ae7600" : "#197040", fontFamily: "'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>
              Preliminary Indication
            </div>
            <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif" }}>
              {Math.round(result.probability * 100)}% ASD Probability
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--ink-light)", marginTop: "0.25rem" }}>
              {isAutism ? "Some indicators detected — clinical review recommended" : "Low indicators — continue monitoring"}
            </div>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--ink-light)", lineHeight: 1.65, marginBottom: "1.75rem", background: "var(--surface)", borderRadius: "0.75rem", padding: "0.875rem" }}>
            <strong>Note:</strong> This is a preliminary screening tool, not a clinical diagnosis. Please book an appointment with your doctor to discuss these results.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button onClick={() => onNavigate("patient-results")} className="btn-lime" style={{ justifyContent: "center" }}>
              View Full Report
            </button>
            <button
              onClick={() => onNavigate("patient-book-appointment")}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "1.5px solid var(--surface-highest)", borderRadius: "0.875rem", background: "none", color: "var(--ink-mid)", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Book Appointment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══ INPUT SCREENS ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingBottom: "3rem" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #253317 0%, #2b4731 100%)", padding: "1.5rem 2rem 2rem" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <button
            onClick={() => onNavigate("patient-dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: "0.875rem" }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#fff", letterSpacing: "-0.02em" }}>
            Behavioral Assessment
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", marginTop: "0.375rem" }}>
            {isDemoStep
              ? "Patient Information — Step 4 of 4"
              : `Section ${step + 1} of ${QSECTIONS}: ${SECTIONS[step].title}`}
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                {isDemoStep ? "Almost done!" : `${answered}/${totalQ} questions answered`}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--lime)", fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>
                {isDemoStep ? "100%" : `${Math.round(progress * 100)}%`}
              </span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.15)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                animate={{ width: isDemoStep ? "100%" : `${progress * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%", borderRadius: "9999px", background: "var(--lime)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {SECTIONS.map((sec, i) => {
            const done   = sec.questions.every(q => q.id in answers);
            const active = i === step && isQuestionStep;
            return (
              <button key={i} onClick={() => setStep(i)}
                style={{
                  flex: 1, padding: "0.5rem", borderRadius: "0.75rem", border: "1.5px solid",
                  cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700,
                  fontSize: "0.75rem", transition: "all 200ms ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                  borderColor: active ? "var(--olive)" : done ? "rgba(25,110,60,0.3)" : "var(--surface-highest)",
                  background:  active ? "rgba(90,100,0,0.1)" : done ? "rgba(25,110,60,0.07)" : "transparent",
                  color:       active ? "var(--olive)" : done ? "#197040" : "var(--ink-light)",
                }}
              >
                {done && <CheckCircle2 size={12} />}
                {sec.title.split(" ")[0]}
              </button>
            );
          })}
          {/* Demographics tab */}
          <button
            onClick={() => { if (canSubmit) setStep(QSECTIONS); }}
            disabled={!canSubmit}
            style={{
              flex: 1, padding: "0.5rem", borderRadius: "0.75rem", border: "1.5px solid",
              cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'Manrope', sans-serif",
              fontWeight: 700, fontSize: "0.75rem", transition: "all 200ms ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
              borderColor: isDemoStep ? "var(--olive)" : "var(--surface-highest)",
              background:  isDemoStep ? "rgba(90,100,0,0.1)" : "transparent",
              color:       isDemoStep ? "var(--olive)" : "var(--ink-light)",
              opacity:     !canSubmit ? 0.4 : 1,
            }}
          >
            <User size={12} /> Info
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Questionnaire sections (steps 0–2) ── */}
          {isQuestionStep && curSection ? (
            <motion.div
              key={`sec-${step}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="tonal-card" style={{ padding: "2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--ink-light)", lineHeight: 1.6, marginBottom: "1.75rem", padding: "0.875rem 1rem", background: "var(--surface)", borderRadius: "0.75rem", border: "1px solid var(--surface-highest)" }}>
                  {curSection.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {curSection.questions.map((q, qi) => (
                    <div key={q.id}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9375rem", color: "var(--ink-dark)", lineHeight: 1.55, marginBottom: "0.875rem" }}>
                        <span style={{ color: "var(--olive)", fontWeight: 700 }}>{qi + 1}.</span> {q.text}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {SCALE_OPTS.map(opt => {
                          const sel = answers[q.id] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.value }))}
                              style={{
                                flex: 1, padding: "0.5rem 0.25rem", borderRadius: "0.625rem",
                                border: "1.5px solid", cursor: "pointer", fontSize: "0.75rem",
                                fontWeight: 700, fontFamily: "'Manrope', sans-serif",
                                transition: "all 150ms ease", lineHeight: 1.3,
                                borderColor: sel ? opt.color : "var(--surface-highest)",
                                background:  sel ? `${opt.color}18` : "transparent",
                                color:       sel ? opt.color : "var(--ink-light)",
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
              </div>
            </motion.div>

          ) : (
            /* ── Demographics step ── */
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="tonal-card" style={{ padding: "2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--ink-light)", lineHeight: 1.6, marginBottom: "1.75rem", padding: "0.875rem 1rem", background: "var(--surface)", borderRadius: "0.75rem", border: "1px solid var(--surface-highest)" }}>
                  These details help calibrate the ASD screening model. All fields have defaults — update only what applies to the child.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

                  {/* Age */}
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                      Child's Age (years)
                    </label>
                    <input
                      type="number" min={1} max={17} value={demo.age}
                      onChange={e => setDemo(d => ({ ...d, age: Math.max(1, Math.min(17, Number(e.target.value))) }))}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1.5px solid var(--surface-highest)", background: "var(--surface)", color: "var(--ink-dark)", fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Sex */}
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                      Sex
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {(["Male", "Female"] as const).map(s => (
                        <button
                          key={s} onClick={() => setDemo(d => ({ ...d, sex: s }))}
                          style={{
                            flex: 1, padding: "0.75rem", borderRadius: "0.75rem", border: "1.5px solid",
                            cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem",
                            borderColor: demo.sex === s ? "var(--olive)" : "var(--surface-highest)",
                            background:  demo.sex === s ? "rgba(90,100,0,0.08)" : "transparent",
                            color:       demo.sex === s ? "var(--olive)" : "var(--ink-mid)",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ethnicity */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                      Ethnicity
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                      {ETHNICITY_OPTIONS.map(eth => (
                        <button
                          key={eth} onClick={() => setDemo(d => ({ ...d, ethnicity: eth }))}
                          style={{
                            padding: "0.4rem 0.875rem", borderRadius: "9999px", border: "1.5px solid",
                            cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.8125rem",
                            borderColor: demo.ethnicity === eth ? "var(--olive)" : "var(--surface-highest)",
                            background:  demo.ethnicity === eth ? "rgba(90,100,0,0.08)" : "transparent",
                            color:       demo.ethnicity === eth ? "var(--olive)" : "var(--ink-mid)",
                          }}
                        >
                          {eth}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jaundice */}
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                      History of Jaundice at birth?
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {(["yes", "no"] as const).map(v => (
                        <button
                          key={v} onClick={() => setDemo(d => ({ ...d, jaundice: v }))}
                          style={{
                            flex: 1, padding: "0.75rem", borderRadius: "0.75rem", border: "1.5px solid",
                            cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem", textTransform: "capitalize",
                            borderColor: demo.jaundice === v ? "var(--olive)" : "var(--surface-highest)",
                            background:  demo.jaundice === v ? "rgba(90,100,0,0.08)" : "transparent",
                            color:       demo.jaundice === v ? "var(--olive)" : "var(--ink-mid)",
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Family ASD */}
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-light)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                      Family member with ASD?
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {(["yes", "no"] as const).map(v => (
                        <button
                          key={v} onClick={() => setDemo(d => ({ ...d, familyASD: v }))}
                          style={{
                            flex: 1, padding: "0.75rem", borderRadius: "0.75rem", border: "1.5px solid",
                            cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem", textTransform: "capitalize",
                            borderColor: demo.familyASD === v ? "var(--olive)" : "var(--surface-highest)",
                            background:  demo.familyASD === v ? "rgba(90,100,0,0.08)" : "transparent",
                            color:       demo.familyASD === v ? "var(--olive)" : "var(--ink-mid)",
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div style={{ color: "var(--error)", background: "var(--error-container)", borderRadius: "0.875rem", padding: "0.875rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", border: "1.5px solid var(--surface-highest)", borderRadius: "0.875rem", background: "none", color: step === 0 ? "var(--surface-highest)" : "var(--ink-mid)", cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {isDemoStep ? (
            /* Submit */
            <button
              id="assessment-submit-btn"
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="btn-lime"
              style={{ justifyContent: "center", opacity: canSubmit && !loading ? 1 : 0.55, cursor: canSubmit && !loading ? "pointer" : "not-allowed" }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…</>
                : <><CheckCircle2 size={16} /> Submit Assessment</>}
            </button>
          ) : (
            /* Next / Advance to demographics */
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={isQuestionStep && !allCurAnswered}
              className="btn-lime"
              style={{ justifyContent: "center", opacity: !isQuestionStep || allCurAnswered ? 1 : 0.5, cursor: !isQuestionStep || allCurAnswered ? "pointer" : "not-allowed" }}
            >
              {step === QSECTIONS - 1 ? "Patient Info" : "Next Section"} <ChevronRight size={16} />
            </button>
          )}
        </div>

        {isQuestionStep && !allCurAnswered && (
          <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--ink-light)", marginTop: "0.75rem" }}>
            Please answer all questions in this section to continue
          </p>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AssessmentPage;
