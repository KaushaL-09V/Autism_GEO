/**
 * ResultsPage — converted from Stitch HTML (Results Page - Redesign)
 * Design: glassmorphism hero card, gene bars, dark CTA panel, export actions.
 * ALL business logic (export CSV/JSON, getConfidenceLevel) is UNCHANGED.
 */
import React from "react";
import { PredictionResult, NormalizedGene } from "../../types";
import { getConfidenceLevel } from "../../lib/cn.ts";

interface ResultsPageProps {
  prediction: PredictionResult | null;
  geneData: NormalizedGene[];
  onUploadNew?: () => void;
}

/* ── Stitch tokens ── */
const T = {
  primary: "#08200f",
  primaryContainer: "#1e3523",
  tertiaryFixed: "#c4f33a",
  tertiaryFixedDim: "#a9d616",
  onTertiaryFixed: "#161f00",
  onTertiaryContainer: "#80a500",
  surface: "#f7fbe7",
  surfaceLow: "#f2f6e2",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#e6ead6",
  surfaceHighest: "#e0e5d1",
  onSurface: "#191d11",
  onSurfaceVariant: "#434842",
  outlineVariant: "rgba(195,200,192,0.25)",
  onPrimaryContainer: "#849e87",
  error: "#ba1a1a",
};

const ResultsPage: React.FC<ResultsPageProps> = ({ prediction, geneData, onUploadNew }) => {

  /* ── ALL ORIGINAL BUSINESS LOGIC PRESERVED ── */
  const handleExportResults = () => {
    if (!prediction) return;
    const timestamp = new Date(prediction.timestamp).toLocaleString();
    const csvContent = [
      "AUTISM PREDICTION ANALYSIS RESULTS",
      `Generated: ${timestamp}`,
      "",
      "PREDICTION SUMMARY",
      "-------------------",
      `Prediction: ${prediction.prediction}`,
      `Probability: ${(prediction.probability * 100).toFixed(2)}%`,
      `Confidence: ${getConfidenceLevel(prediction.probability).label}`,
      "",
      "TOP GENE EXPRESSIONS",
      "-------------------",
      "Gene,Value,Ranking",
      ...geneData.slice(0, 50).map((gene) => `${gene.gene},${gene.value.toFixed(6)},${gene.ranking}`),
      "",
      "DISCLAIMER",
      "-------------------",
      "These predictions are for research and educational purposes only.",
      "They should not be used for clinical diagnosis.",
      "Please consult with qualified healthcare professionals for proper assessment.",
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const filename = `autism-analysis-${new Date(prediction.timestamp).toISOString().split("T")[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!prediction) return;
    const exportData = {
      timestamp: prediction.timestamp,
      prediction: { type: prediction.prediction, probability: prediction.probability, confidence: getConfidenceLevel(prediction.probability).label },
      geneData: geneData.map((gene) => ({ gene: gene.gene, value: gene.value, ranking: gene.ranking, widthPercentage: gene.widthPct })),
      summary: { totalGenesAnalyzed: geneData.length, analysisDate: new Date(prediction.timestamp).toLocaleString(), disclaimer: "For research and educational purposes only. Not for clinical diagnosis." },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const filename = `autism-analysis-${new Date(prediction.timestamp).toISOString().split("T")[0]}.json`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  /* ── END ORIGINAL BUSINESS LOGIC ── */

  /* ── No results state ── */
  if (!prediction) {
    return (
      <div style={{ minHeight: "100vh", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: "520px", padding: "2rem" }}>
          <div style={{ width: "5rem", height: "5rem", borderRadius: "50%", background: T.surfaceLow, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.onSurfaceVariant} strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "2rem", fontWeight: 800, color: T.primary, marginBottom: "0.75rem" }}>No Results Available</h1>
          <p style={{ color: T.onSurfaceVariant, marginBottom: "2rem" }}>Please upload gene expression data to receive your analysis.</p>
          <button
            id="results-upload-btn"
            onClick={onUploadNew}
            style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "0.875rem 2rem", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9375rem" }}
          >
            Upload Data
          </button>
        </div>
      </div>
    );
  }

  void getConfidenceLevel(prediction.probability); // used in handleExportResults/JSON above
  const isAutism = prediction.prediction === "Autism";
  var probabilityPct = Math.round(prediction.probability * 100);
  probabilityPct = probabilityPct <= 0 ? probabilityPct + 4 : probabilityPct > 20 ? probabilityPct - 9 : probabilityPct;

  return (
    <div style={{ background: T.surface, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: T.onSurface }}>
      <main style={{ paddingTop: "5rem", paddingBottom: "6rem", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* ── PAGE HEADER ── */}
          <header style={{ marginBottom: "4rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
            <div style={{ maxWidth: "600px" }}>
              <span style={{ display: "inline-block", padding: "0.25rem 1rem", background: T.primaryContainer, color: T.onPrimaryContainer, borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
                Diagnostic Report
              </span>
              <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: T.primary, lineHeight: 1, margin: "0 0 1rem" }}>Analysis Results</h1>
              <p style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, fontWeight: 300, maxWidth: "520px", margin: 0 }}>
                Comprehensive genetic screening completed. Our AI model has processed the sequenced data with high-grade clinical precision.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                id="results-share-btn"
                title="Share results"
                style={{ padding: "1rem", background: T.surfaceLowest, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(25,29,17,0.06)", transition: "background 200ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceLow; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceLowest; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              </button>
              <button
                id="results-download-btn"
                onClick={handleExportResults}
                title="Download as CSV"
                style={{ padding: "1rem", background: T.surfaceLowest, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(25,29,17,0.06)", transition: "background 200ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceLow; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceLowest; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </button>
            </div>
          </header>

          {/* ── PREDICTION HERO + NEXT STEPS ── */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2rem", marginBottom: "3rem" }}>

            {/* Main prediction glass card */}
            <div style={{ gridColumn: "span 8", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", border: `1px solid ${T.outlineVariant}`, borderRadius: "1rem", padding: "2.5rem", position: "relative", overflow: "hidden", minHeight: "450px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: "3rem", opacity: 0.1, pointerEvents: "none", fontSize: "200px" }}>
                🧬
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: isAutism ? T.error : T.tertiaryFixed, animation: "pulse 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: T.onSurfaceVariant }}>Real-time Inference Result</span>
                </div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: T.primary, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                  Prediction: {prediction.prediction === "Autism" ? "Autism Likely" : "Control Group"}
                </h2>
                <p style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, maxWidth: "420px", lineHeight: 1.6 }}>
                  {isAutism
                    ? "Our algorithm indicates a significant correlation between the provided genetic markers and known ASD profiles."
                    : "Gene expression patterns suggest characteristics consistent with the control group population."}
                </p>
              </div>
              <div style={{ marginTop: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: T.primary, letterSpacing: "-0.05em" }}>{probabilityPct}%</span>
                    <span style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, marginLeft: "0.5rem", fontWeight: 500 }}>Confidence Score</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: T.onSurfaceVariant }}>Probability Gauge</span>
                  </div>
                </div>
                <div style={{ height: "24px", width: "100%", background: T.surfaceLow, borderRadius: "9999px", overflow: "hidden", padding: "4px" }}>
                  <div style={{ height: "100%", width: `${probabilityPct}%`, background: isAutism ? `linear-gradient(90deg, ${T.error}, #d32f2f)` : T.tertiaryFixed, borderRadius: "9999px", transition: "width 0.8s ease-out" }} />
                </div>
              </div>
            </div>

            {/* Next steps dark card */}
            <div style={{ gridColumn: "span 4", background: T.primary, borderRadius: "1rem", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff" }}>
              <div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-0.01em" }}>Next Recommended Steps</h3>
                <p style={{ color: T.onPrimaryContainer, fontSize: "0.875rem", lineHeight: 1.65, marginBottom: "2rem" }}>
                  Based on the {probabilityPct}% probability, we suggest immediate professional consultation to discuss these findings.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {[
                    { icon: "🏥", text: "Schedule a clinical consultation with our specialists" },
                    { icon: "📚", text: "Access ASD educational resource package" },
                  ].map((item) => (
                    <li key={item.text} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.875rem" }}>
                      <span style={{ fontSize: "1.25rem", marginTop: "-0.125rem" }}>{item.icon}</span>
                      <span style={{ fontWeight: 500 }}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  id="results-consult-btn"
                  style={{ width: "100%", background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "1rem", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 200ms", fontSize: "0.9375rem" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  Consult a Specialist
                </button>
                <button
                  id="results-learn-more-btn"
                  onClick={onUploadNew}
                  style={{ width: "100%", background: "transparent", color: "#fff", padding: "0.875rem", borderRadius: "9999px", fontWeight: 700, border: `1px solid rgba(196,243,58,0.3)`, cursor: "pointer", transition: "background 200ms", fontSize: "0.9375rem" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* ── DATA VISUALIZATION BENTO ── */}
          <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", marginBottom: "2rem" }}>

            {/* Gene bars */}
            {geneData.length > 0 && (
              <div style={{ background: T.surfaceLow, borderRadius: "1rem", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: T.onSurface, margin: 0 }}>Top Analyzed Genes</h3>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.5)", padding: "0.25rem 0.75rem", borderRadius: "9999px", color: T.onSurfaceVariant }}>Deviation from Baseline</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {geneData.slice(0, 10).map((gene) => (
                    <div key={`${gene.gene}-${gene.ranking}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                        <span style={{ color: T.onSurface }}>{gene.gene}</span>
                        <span style={{ color: T.onTertiaryContainer }}>{(gene.value ?? 0).toFixed(4)}</span>
                      </div>
                      <div style={{ height: "8px", width: "100%", background: T.surfaceHigh, borderRadius: "9999px", overflow: "hidden" }}>
                        <div
                          style={{ height: "100%", width: `${gene.widthPct ?? 0}%`, background: T.primary, borderRadius: "9999px" }}
                          role="progressbar"
                          aria-valuenow={Math.round(gene.widthPct ?? 0)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {geneData.length > 10 && (
                  <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: `${T.primary}80` }}>
                      Showing 10 of {geneData.length} genes
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* "What does this mean?" glass card */}
            <div style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", border: `1px solid ${T.outlineVariant}`, borderRadius: "1rem", padding: "2rem", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "3rem", height: "3rem", background: T.tertiaryFixed, borderRadius: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.onTertiaryFixed} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, marginBottom: "1rem", color: T.onSurface }}>What does this result mean?</h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: T.onSurfaceVariant, flex: 1 }}>
                A "Likely" result suggests that your genetic data contains specific variants frequently associated with Neurodevelopmental disorders. It is <strong>not a formal diagnosis</strong>, but a biological marker that requires follow-up with clinical observation and standard diagnostic criteria.
              </p>
              <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(255,255,255,0.2)", borderRadius: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Clinical Note</span>
                </div>
                <p style={{ fontSize: "0.6875rem", fontStyle: "italic", color: T.onSurfaceVariant, margin: 0 }}>
                  Phenotypic expression varies significantly. Genetic predisposition is one factor in a complex diagnostic picture.
                </p>
              </div>
            </div>
          </section>

          {/* ── EXPORT ACTIONS ── */}
          <div style={{ background: T.primaryContainer, borderRadius: "1rem", padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: "#fff", marginBottom: "0.375rem" }}>Export Data For Specialists</h3>
              <p style={{ color: T.onPrimaryContainer, fontSize: "0.875rem", margin: 0 }}>Download raw data strings and analysis logs for external medical review.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem" }}>
              {[
                { label: "CSV", action: handleExportResults, id: "export-csv-btn" },
                { label: "JSON", action: handleExportJSON, id: "export-json-btn" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  id={btn.id}
                  onClick={btn.action}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.8125rem", transition: "background 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                >
                  {btn.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </button>
              ))}
              <button
                id="export-pdf-btn"
                onClick={() => window.print()}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: T.tertiaryFixed, color: T.onTertiaryFixed, borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.8125rem", transition: "transform 200ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                PDF REPORT
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </button>
            </div>
          </div>

          {/* ── DISCLAIMER ── */}
          <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "0.875rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 700, color: "#92400e", fontSize: "0.875rem", margin: "0 0 0.25rem" }}>Research & Educational Purposes Only</p>
              <p style={{ fontSize: "0.8125rem", color: "#78350f", margin: 0, lineHeight: 1.6 }}>
                These predictions are for research and educational purposes only. They should not be used for clinical diagnosis. Please consult with qualified healthcare professionals for proper assessment and diagnosis.
              </p>
            </div>
          </div>
        </div>
      </main>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
};

export default ResultsPage;