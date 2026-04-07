// import { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import Papa from "papaparse";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

// function parseRows(file) {
//   return new Promise((resolve, reject) => {
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         if (result.errors.length > 0) {
//           reject(new Error(result.errors[0].message));
//           return;
//         }
//         resolve(result.data);
//       },
//       error: (err) => reject(err),
//     });
//   });
// }

// export default function App() {
//   const [file, setFile] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [message, setMessage] = useState("Upload a gene expression CSV to begin screening.");
//   const [result, setResult] = useState(null);

//   const topGenes = useMemo(() => {
//     if (!rows.length) return [];

//     const normalized = rows
//       .map((row) => ({
//         gene: row.Gene || row.gene || "Unknown",
//         value: Number(row.Value ?? row.value ?? 0),
//       }))
//       .filter((item) => Number.isFinite(item.value))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 8);

//     const maxValue = normalized[0]?.value || 1;
//     return normalized.map((item) => ({
//       ...item,
//       widthPct: Math.max(8, (item.value / maxValue) * 100),
//     }));
//   }, [rows]);

//   async function onFileChange(event) {
//     const selected = event.target.files?.[0];
//     if (!selected) return;

//     setFile(selected);
//     setResult(null);
//     setStatus("idle");

//     try {
//       const parsed = await parseRows(selected);
//       setRows(parsed);
//       setMessage(`Loaded ${parsed.length} expression rows.`);
//     } catch (err) {
//       setRows([]);
//       setMessage(`CSV read error: ${err.message}`);
//     }
//   }

//   async function runPrediction() {
//     if (!file) {
//       setStatus("error");
//       setMessage("Select a CSV file first.");
//       return;
//     }

//     try {
//       setStatus("loading");
//       setMessage("Analyzing biomarkers and running model inference...");

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch(`${API_BASE}/predict`, {
//         method: "POST",
//         body: formData,
//       });

//       const payload = await response.json();
//       if (!response.ok || payload.error) {
//         throw new Error(payload.error || "Prediction request failed.");
//       }

//       setResult(payload);
//       setStatus("success");
//       setMessage("Analysis completed successfully.");
//     } catch (err) {
//       setStatus("error");
//       setMessage(err.message);
//       setResult(null);
//     }
//   }

//   const confidencePct = result ? (Number(result.probability) * 100).toFixed(2) : "0.00";
//   const isAutism = result?.prediction === "Autism";

//   return (
//     <div className="page">
//       <div className="bg-orb orb-a" />
//       <div className="bg-orb orb-b" />

//       <motion.header
//         className="hero"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <p className="eyebrow">Neurodevelopment Screening Interface</p>
//         <h1>Autism Biomarker Predictor</h1>
//         <p>
//           Clinical-style dashboard for reviewing gene expression input and model output.
//           Designed for rapid triage and transparent confidence reporting.
//         </p>
//       </motion.header>

//       <main className="grid">
//         <motion.section
//           className="panel"
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1, duration: 0.5 }}
//         >
//           <h2>1. Patient Sample Upload</h2>
//           <label className="upload" htmlFor="csv-upload">
//             <span>Drop CSV or click to browse</span>
//             <small>Expected columns: Gene, Value</small>
//           </label>
//           <input id="csv-upload" type="file" accept=".csv" onChange={onFileChange} />

//           <button onClick={runPrediction} disabled={status === "loading"}>
//             {status === "loading" ? "Running Analysis..." : "Run Prediction"}
//           </button>

//           <p className={`message ${status}`}>{message}</p>
//         </motion.section>

//         <motion.section
//           className="panel"
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.15, duration: 0.5 }}
//         >
//           <h2>2. Gene Signal Snapshot</h2>
//           {!topGenes.length && <p className="muted">Upload data to render top biomarkers.</p>}
//           <div className="gene-list">
//             {topGenes.map((item, index) => (
//               <motion.div
//                 className="gene-row"
//                 key={`${item.gene}-${index}`}
//                 initial={{ opacity: 0, scaleX: 0.7 }}
//                 animate={{ opacity: 1, scaleX: 1 }}
//                 transition={{ delay: index * 0.05 }}
//               >
//                 <div className="gene-label">
//                   <strong>{item.gene}</strong>
//                   <span>{item.value.toFixed(4)}</span>
//                 </div>
//                 <div className="gene-bar-wrap">
//                   <div className="gene-bar" style={{ width: `${item.widthPct}%` }} />
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         <motion.section
//           className="panel panel-full"
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           <h2>3. Clinical Decision Output</h2>
//           {!result && <p className="muted">Prediction result appears here after analysis.</p>}

//           {result && (
//             <div className={`result-card ${isAutism ? "risk" : "control"}`}>
//               <div>
//                 <p className="result-label">Predicted Class</p>
//                 <h3>{result.prediction}</h3>
//               </div>
              
//               <div className="clinical-note">
//                 {isAutism
//                   ? "Elevated autism-likelihood signal detected. Recommend specialist follow-up."
//                   : "Control profile predicted. Continue routine monitoring with clinician guidance."}
//               </div>
//             </div>
//           )}
//         </motion.section>
//       </main>
//     </div>
//   );
// }
