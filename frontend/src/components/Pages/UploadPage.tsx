/**
 * UploadPage — converted from Stitch HTML (Upload Page - Redesign)
 * Design tokens: primary=#08200f, tertiary-fixed=#c4f33a
 * IMPORTANT: All API calls, parsing logic and prediction flow are UNCHANGED.
 */
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { GeneExpression, UploadError, UploadStatus, NormalizedGene } from "../../types";
import { MAX_FILE_SIZE } from "../../services/constants";
import { formatFileSize } from "../../lib/cn.ts";

interface UploadPageProps {
  onPredictionComplete?: () => void;
  predict?: (genes: GeneExpression[]) => Promise<void>;
  error?: UploadError | null;
  uploadStatus?: UploadStatus;
  geneData?: NormalizedGene[];
}

/* ── Stitch color tokens ── */
const T = {
  primary: "#08200f",
  primaryContainer: "#1e3523",
  tertiaryFixed: "#c4f33a",
  onTertiaryFixed: "#161f00",
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

const UploadPage: React.FC<UploadPageProps> = ({
  onPredictionComplete,
  predict: externalPredict,
  error: externalError,
  uploadStatus: externalUploadStatus,
  geneData: externalGeneData,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<UploadError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const error = externalError || localError;
  const uploadStatus = externalUploadStatus || "idle";
  const geneData = externalGeneData || [];
  const predict = externalPredict;

  /* ── unchanged business logic ── */
  const parseCSVFile = (file: File): Promise<GeneExpression[]> =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (result) => {
          if (result.errors.length > 0) { reject(new Error(result.errors[0].message)); return; }
          const genes = (result.data as any[])
            .map((row) => ({ Gene: row.Gene?.trim() || "", Value: parseFloat(row.Value) || 0 }))
            .filter((g) => g.Gene && !isNaN(g.Value));
          if (genes.length === 0) { reject(new Error("No valid gene data found in CSV")); return; }
          resolve(genes as GeneExpression[]);
        },
        error: (err) => reject(err),
      });
    });

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) throw new Error(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`);
    if (!file.name.endsWith(".csv")) throw new Error("Invalid file format. Please upload a CSV file.");
    setSelectedFile(file);
    try {
      const genes = await parseCSVFile(file);
      if (predict) {
        await predict(genes);
        onPredictionComplete?.();
      } else {
        throw new Error("Prediction function not available");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse file";
      setLocalError({ code: "PARSE_ERROR", message });
      throw new Error(message);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) { try { await handleFile(files[0]); } catch (err) { /* handled */ } }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { try { await handleFile(e.target.files[0]); } catch (err) { /* handled */ } }
  };

  const isProcessing = ["uploading", "parsing", "predicting"].includes(uploadStatus);
  const progressMap: Record<string, number> = { uploading: 25, parsing: 55, predicting: 80, success: 100 };
  const progressPct = progressMap[uploadStatus] || 0;
  const progressLabel: Record<string, string> = {
    uploading: "Uploading file...", parsing: "Parsing CSV data...",
    predicting: "Mapping topological genetic variance in real-time...", success: "Analysis complete."
  };

  return (
    <div style={{ background: T.surface, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: T.onSurface }}>
      <main style={{ paddingTop: "5rem", paddingBottom: "6rem", minHeight: "100vh", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Privacy banner */}
          <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 1.5rem", borderRadius: "9999px", background: T.surfaceLow, border: `1px solid ${T.outlineVariant}` }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: T.onSurfaceVariant }}>
                Confidential: No genetic data is stored on our servers
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem" }}>

            {/* ── LEFT SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div>
                <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.875rem, 3vw, 2.5rem)", fontWeight: 800, color: T.primary, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                  Upload Genomic<br />Architecture
                </h1>
                <p style={{ color: T.onSurfaceVariant, lineHeight: 1.7, fontSize: "1rem", fontWeight: 300 }}>
                  Prepare your sequencing data for clinical-grade predictive analysis. Our AI models analyze epigenetic markers and structural variants.
                </p>
              </div>

              {/* Format guide */}
              <div style={{ padding: "2rem", borderRadius: "1rem", background: `${T.surfaceLow}80`, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h3 style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.primary, margin: 0 }}>Required Format</h3>
                {[
                  { icon: "📄", label: "CSV / TSV", sub: "Standard Genomic Format" },
                  { icon: "📋", label: "Gene, Value", sub: "Simple dual-column structure" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: `${T.primary}0D`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.875rem" }}>{item.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: T.primary, margin: "0 0 0.125rem", fontSize: "0.875rem" }}>{item.label}</p>
                      <p style={{ fontSize: "0.75rem", color: T.onSurfaceVariant, fontWeight: 500, margin: 0 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
                <button
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "9999px", border: `1.5px solid ${T.primary}`, color: T.primary, fontWeight: 700, background: "transparent", cursor: "pointer", fontSize: "0.875rem", transition: "all 200ms" }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.background = T.primary; b.style.color = "#fff"; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = T.primary; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download Sample CSV
                </button>
              </div>
            </div>

            {/* ── RIGHT: UPLOAD AREA ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Error */}
              {error && (
                <div style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", background: "#ffdad6", border: `1px solid ${T.error}30`, display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.error} strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <div>
                    <p style={{ fontWeight: 700, color: "#93000a", margin: 0, fontSize: "0.875rem" }}>{error.code}</p>
                    <p style={{ fontSize: "0.8125rem", color: "#93000a", margin: 0 }}>{error.message}</p>
                  </div>
                </div>
              )}

              {/* Drag-and-drop zone */}
              {(uploadStatus === "idle" || !selectedFile) && (
                <div
                  style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(24px)", borderRadius: "1rem", padding: "4px", position: "relative" }}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{
                    border: `2px dashed ${dragActive ? T.primary : `${T.primary}30`}`,
                    borderRadius: "0.875rem", padding: "4rem", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", textAlign: "center",
                    background: dragActive ? "rgba(255,255,255,0.2)" : "transparent",
                    transition: "all 200ms", cursor: "pointer",
                  }}>
                    <div style={{ width: "4.5rem", height: "4.5rem", background: T.tertiaryFixed, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: `0 8px 24px ${T.tertiaryFixed}40`, transition: "transform 300ms" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.onTertiaryFixed} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: T.primary, marginBottom: "0.5rem" }}>Drag files to analyze</h2>
                    <p style={{ color: T.onSurfaceVariant, marginBottom: "2rem", fontWeight: 300 }}>or click to browse from your clinical workstation</p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {["Support: .CSV", "Support: .XLSX"].map(l => (
                        <span key={l} style={{ padding: "0.375rem 1rem", borderRadius: "9999px", background: "rgba(255,255,255,0.6)", fontSize: "0.6875rem", fontWeight: 700, color: T.primary, border: `1px solid ${T.outlineVariant}`, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</span>
                      ))}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileInput} style={{ display: "none" }} aria-label="Select gene expression CSV" />
                  </div>
                </div>
              )}

              {/* Real-time preview / processing panel */}
              {(selectedFile || isProcessing || uploadStatus === "success") && (
                <div style={{ background: T.surfaceLow, borderRadius: "1rem", overflow: "hidden" }}>
                  {/* header */}
                  <div style={{ padding: "1.25rem 2rem", background: `${T.surfaceHigh}50`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ position: "relative", width: "12px", height: "12px" }}>
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.tertiaryFixed, opacity: 0.75, animation: "ping 1s ease-in-out infinite" }} />
                        <div style={{ position: "relative", width: "12px", height: "12px", borderRadius: "50%", background: T.tertiaryFixed }} />
                      </div>
                      <h4 style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>AI Processing State</h4>
                    </div>
                    {selectedFile && (
                      <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700, color: T.primary, background: "rgba(255,255,255,0.8)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>{selectedFile.name.toUpperCase()}</span>
                    )}
                  </div>

                  {/* gene table */}
                  <div style={{ padding: "2rem", overflowX: "auto" }}>
                    <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.outlineVariant}` }}>
                          {["Gene Identifier", "Expression Value", "Confidence"].map((h, i) => (
                            <th key={h} style={{ paddingBottom: "1rem", fontSize: "0.6875rem", fontWeight: 700, color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: i === 2 ? "right" : "left" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(geneData.length > 0 ? geneData.slice(0, 5) : [
                          { gene: "SHANK3", value: 0.8423, widthPct: 92, ranking: 1 },
                          { gene: "NLGN3", value: 1.1092, widthPct: 88, ranking: 2 },
                          { gene: "PTEN", value: 0.4561, widthPct: 75, ranking: 3 },
                        ] as NormalizedGene[]).map((g) => (
                          <tr key={`${g.gene}-${g.ranking}`} style={{ borderBottom: `1px solid ${T.outlineVariant}50` }}>
                            <td style={{ padding: "1rem 0", color: T.primary, fontWeight: 700 }}>{g.gene}</td>
                            <td style={{ padding: "1rem 0", fontFamily: "monospace", fontSize: "0.875rem", color: T.onSurfaceVariant }}>{g.value.toFixed(4)}</td>
                            <td style={{ padding: "1rem 0", textAlign: "right" }}>
                              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.onTertiaryFixed, padding: "0.25rem 0.5rem", background: T.tertiaryFixed, borderRadius: "0.25rem" }}>{g.widthPct.toFixed(1)}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Progress */}
                    {(isProcessing || uploadStatus === "success") && (
                      <div style={{ marginTop: "2.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "0.1em" }}>Neural Analysis Progress</span>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: T.primary }}>{progressPct}%</span>
                        </div>
                        <div style={{ width: "100%", height: "10px", background: T.surfaceHighest, borderRadius: "9999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${T.primary}, #2a6040)`, borderRadius: "9999px", transition: "width 400ms ease" }} />
                        </div>
                        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: T.onSurfaceVariant, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {isProcessing && <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>↻</span>}
                          {progressLabel[uploadStatus]}
                        </p>
                      </div>
                    )}

                    {/* Success message */}
                    {uploadStatus === "success" && geneData.length > 0 && (
                      <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(196,243,58,0.12)", borderRadius: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                        <div>
                          <p style={{ fontWeight: 700, color: T.primary, margin: 0, fontSize: "0.875rem" }}>File uploaded successfully</p>
                          <p style={{ fontSize: "0.8125rem", color: T.onSurfaceVariant, margin: 0 }}>{geneData.length} genes found and processed</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Run button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  id="upload-run-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  style={{ background: isProcessing ? T.surfaceHigh : T.primary, color: isProcessing ? T.onSurfaceVariant : "#fff", padding: "1rem 2.5rem", borderRadius: "9999px", fontWeight: 700, fontSize: "1rem", border: "none", cursor: isProcessing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: `0 8px 24px ${T.primary}30`, transition: "all 300ms" }}
                >
                  {isProcessing ? "Analyzing..." : "Run Comprehensive Analysis"}
                  {!isProcessing && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`@keyframes ping{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(2);opacity:0}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default UploadPage;