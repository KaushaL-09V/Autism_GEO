import React, { useMemo, useState } from "react";
import { PredictionResult, ScreeningPayload, UploadError } from "../../types";
import { apiClient } from "../../services/api";

interface QuestionnairePageProps {
    onNavigate?: (page: string) => void;
}

type BinaryKey =
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "A6"
    | "A7"
    | "A8"
    | "A9"
    | "A10_Autism_Spectrum_Quotient"
    | "Jaundice"
    | "Family_mem_with_ASD";

const T = {
    primary: "#0f2217",
    deep: "#173327",
    mint: "#dbf291",
    mintStrong: "#c4e45e",
    paper: "#f4f7ea",
    card: "#ffffff",
    ink: "#1a261e",
    muted: "#526254",
    line: "rgba(26,38,30,0.12)",
    ok: "#1f7a4c",
    bad: "#a53a3a",
};

const QUESTIONS: Array<{ key: BinaryKey; label: string }> = [
    { key: "A1", label: "Notices small sounds others don't" },
    { key: "A2", label: "Focuses on whole picture instead of small details" },
    { key: "A3", label: "Can track multiple conversations in a group" },
    { key: "A4", label: "Can switch easily between activities" },
    { key: "A5", label: "Has difficulty continuing conversation" },
    { key: "A6", label: "Good at social chit-chat" },
    { key: "A7", label: "Difficulty understanding feelings from stories" },
    { key: "A8", label: "Enjoys pretend play with other children" },
    { key: "A9", label: "Can understand emotions from facial expressions" },
    { key: "A10_Autism_Spectrum_Quotient", label: "Finds it hard to make new friends" },
];

const initialForm: ScreeningPayload = {
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    A5: 0,
    A6: 0,
    A7: 0,
    A8: 0,
    A9: 0,
    A10_Autism_Spectrum_Quotient: 0,
    Age_Years: 3,
    Sex: "M",
    Ethnicity: "White European",
    Jaundice: "No",
    Family_mem_with_ASD: "No",
    Who_completed_the_test: "Parent",
};

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ onNavigate }) => {
    const [form, setForm] = useState<ScreeningPayload>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<UploadError | null>(null);
    const [result, setResult] = useState<PredictionResult | null>(null);

    const progress = useMemo(() => {
        const answered = QUESTIONS.reduce((sum, q) => sum + (form[q.key] === 0 || form[q.key] === 1 ? 1 : 0), 0);
        return Math.round((answered / QUESTIONS.length) * 100);
    }, [form]);

    const setBinary = (key: BinaryKey, value: number) => {
        setForm((prev) => {
            if (key === "Jaundice" || key === "Family_mem_with_ASD") {
                return {
                    ...prev,
                    [key]: value === 1 ? "Yes" : "No",
                } as ScreeningPayload;
            }

            return {
                ...prev,
                [key]: value,
            } as ScreeningPayload;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setResult(null);

        try {
            const payload: ScreeningPayload = {
                ...form,
                Age_Years: Number(form.Age_Years),
            };
            const prediction = await apiClient.predictScreening(payload);
            setResult(prediction);
        } catch (err: unknown) {
            const uploadError: UploadError =
                err && typeof err === "object" && "code" in (err as object)
                    ? (err as UploadError)
                    : {
                        code: "SCREENING_ERROR",
                        message: err instanceof Error ? err.message : "Unable to run screening prediction",
                    };
            setError(uploadError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: T.paper, padding: "4rem 1rem 5rem" }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
                <div
                    style={{
                        background:
                            "radial-gradient(circle at 10% 10%, rgba(219,242,145,0.6), rgba(255,255,255,0.9) 52%), linear-gradient(145deg, #f9fbe9, #edf3db)",
                        border: `1px solid ${T.line}`,
                        borderRadius: "1.25rem",
                        padding: "2.25rem",
                        marginBottom: "1.75rem",
                        boxShadow: "0 16px 40px rgba(18,36,24,0.06)",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    fontFamily: "'Manrope', sans-serif",
                                    fontWeight: 800,
                                    color: T.primary,
                                    fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Behavioral Screening Questionnaire
                            </h1>
                            <p style={{ marginTop: "0.625rem", color: T.muted, maxWidth: "720px", lineHeight: 1.65 }}>
                                Complete these child behavior questions and profile fields. The backend uses your saved screening model with fixed encoding and exact feature order from features.pkl.
                            </p>
                        </div>
                        <div style={{ minWidth: "220px" }}>
                            <div style={{ color: T.muted, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Question Progress
                            </div>
                            <div style={{ marginTop: "0.55rem", height: "10px", background: "rgba(23,51,39,0.12)", borderRadius: "999px", overflow: "hidden" }}>
                                <div style={{ width: `${progress}%`, height: "100%", background: T.deep, transition: "width 260ms ease" }} />
                            </div>
                            <div style={{ marginTop: "0.5rem", color: T.primary, fontWeight: 700 }}>{progress}% complete</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                        <div
                            style={{
                                background: T.card,
                                border: `1px solid ${T.line}`,
                                borderRadius: "1rem",
                                padding: "1.5rem",
                                boxShadow: "0 10px 24px rgba(18,36,24,0.04)",
                            }}
                        >
                            <h2 style={{ margin: "0 0 1rem", fontFamily: "'Manrope', sans-serif", color: T.ink, fontSize: "1.2rem" }}>
                                Child Behavior Questions
                            </h2>

                            <div style={{ display: "grid", gap: "0.85rem" }}>
                                {QUESTIONS.map((q, index) => {
                                    const value = form[q.key] as number;

                                    return (
                                        <div
                                            key={q.key}
                                            style={{
                                                border: `1px solid ${T.line}`,
                                                borderRadius: "0.85rem",
                                                padding: "0.9rem 1rem",
                                                display: "grid",
                                                gridTemplateColumns: "1fr auto",
                                                gap: "0.75rem",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.08em",
                                                        color: T.muted,
                                                        fontWeight: 700,
                                                        marginBottom: "0.25rem",
                                                    }}
                                                >
                                                    Question {index + 1}
                                                </div>
                                                <label style={{ color: T.ink, fontWeight: 600, lineHeight: 1.4 }}>{q.label}</label>
                                            </div>

                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setBinary(q.key, 1)}
                                                    style={{
                                                        minWidth: "66px",
                                                        borderRadius: "999px",
                                                        border: value === 1 ? "1px solid #2b6a44" : `1px solid ${T.line}`,
                                                        background: value === 1 ? "#e4f7eb" : "#fff",
                                                        color: value === 1 ? "#1f7a4c" : T.muted,
                                                        fontWeight: 700,
                                                        padding: "0.5rem 0.8rem",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBinary(q.key, 0)}
                                                    style={{
                                                        minWidth: "66px",
                                                        borderRadius: "999px",
                                                        border: value === 0 ? "1px solid #7f2f2f" : `1px solid ${T.line}`,
                                                        background: value === 0 ? "#ffecec" : "#fff",
                                                        color: value === 0 ? "#a53a3a" : T.muted,
                                                        fontWeight: 700,
                                                        padding: "0.5rem 0.8rem",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
                            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: "1rem", padding: "1.1rem" }}>
                                <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Manrope', sans-serif", color: T.ink }}>Profile Inputs</h3>

                                <Field label="Child Age (1-5 years)">
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={form.Age_Years}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Age_Years: Number(e.target.value || 1) }))}
                                        style={inputStyle}
                                    />
                                </Field>

                                <Field label="Gender">
                                    <select
                                        value={form.Sex}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Sex: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </Field>

                                <Field label="Ethnicity">
                                    <select
                                        value={form.Ethnicity}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Ethnicity: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option>Asian</option>
                                        <option>White European</option>
                                        <option>Middle Eastern</option>
                                        <option>Hispanic</option>
                                        <option>Others</option>
                                    </select>
                                </Field>

                                <Field label="Had jaundice at birth?">
                                    <select
                                        value={form.Jaundice}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Jaundice: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </Field>

                                <Field label="Family member with ASD?">
                                    <select
                                        value={form.Family_mem_with_ASD}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Family_mem_with_ASD: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </Field>

                                <Field label="Who is filling this form?">
                                    <select
                                        value={form.Who_completed_the_test}
                                        onChange={(e) => setForm((prev) => ({ ...prev, Who_completed_the_test: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option>Parent</option>
                                        <option>Family Member</option>
                                        <option>Doctor</option>
                                        <option>Self</option>
                                    </select>
                                </Field>
                            </div>

                            <div
                                style={{
                                    background: "linear-gradient(135deg, #102418, #20412e)",
                                    borderRadius: "1rem",
                                    color: "#f8fff1",
                                    padding: "1.1rem",
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.4rem" }}>Payload Contract</div>
                                <div style={{ fontSize: "0.8rem", color: "rgba(248,255,241,0.85)", lineHeight: 1.5 }}>
                                    Submit uses JSON fields expected by backend, including A10_Autism_Spectrum_Quotient, and backend applies model-specific encoding with saved feature order.
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: "#ffe6e6", color: T.bad, border: "1px solid rgba(165,58,58,0.2)", borderRadius: "0.85rem", padding: "0.85rem" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>{error.code}</div>
                                    <div style={{ fontSize: "0.84rem" }}>{error.message}</div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    border: "none",
                                    borderRadius: "999px",
                                    padding: "0.95rem 1.25rem",
                                    fontWeight: 800,
                                    background: submitting ? "#9aac9f" : T.mintStrong,
                                    color: "#142010",
                                    cursor: submitting ? "not-allowed" : "pointer",
                                }}
                            >
                                {submitting ? "Predicting..." : "Submit Questionnaire"}
                            </button>

                            <button
                                type="button"
                                onClick={() => onNavigate?.("upload")}
                                style={{
                                    border: `1px solid ${T.line}`,
                                    background: "#fff",
                                    borderRadius: "999px",
                                    padding: "0.75rem 1.25rem",
                                    fontWeight: 700,
                                    color: T.ink,
                                    cursor: "pointer",
                                }}
                            >
                                Go To Gene Upload Flow
                            </button>
                        </div>
                    </div>
                </form>

                {result && (
                    <div
                        style={{
                            marginTop: "1.5rem",
                            background: T.card,
                            border: `1px solid ${T.line}`,
                            borderRadius: "1rem",
                            padding: "1.4rem",
                            boxShadow: "0 10px 24px rgba(18,36,24,0.04)",
                        }}
                    >
                        <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, fontWeight: 700 }}>
                            Screening Prediction Result
                        </div>
                        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                            <div>
                                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "2rem", color: result.prediction === "Autism" ? T.bad : T.ok }}>
                                    {result.prediction}
                                </div>
                                <div style={{ color: T.muted, marginTop: "0.25rem" }}>
                                    Probability: {(result.probability * 100).toFixed(2)}%
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => onNavigate?.("results")}
                                style={{
                                    border: `1px solid ${T.line}`,
                                    background: "#fff",
                                    borderRadius: "999px",
                                    padding: "0.65rem 1rem",
                                    fontWeight: 700,
                                    color: T.ink,
                                    cursor: "pointer",
                                }}
                            >
                                Open Results Page
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @media (max-width: 980px) {
          form > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${T.line}`,
    borderRadius: "0.7rem",
    padding: "0.65rem 0.75rem",
    fontSize: "0.92rem",
    color: T.ink,
    background: "#fff",
    outline: "none",
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
    return (
        <label style={{ display: "block", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.muted, marginBottom: "0.32rem" }}>{label}</div>
            {children}
        </label>
    );
};

export default QuestionnairePage;
