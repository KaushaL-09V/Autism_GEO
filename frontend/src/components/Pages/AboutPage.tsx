/**
 * AboutPage — converted from Stitch HTML (About Page - Redesign)
 * Design: dark hero with lime badge, methodology bento, biomarker cards, limitations.
 * ALL existing content and information is PRESERVED.
 */
import React from "react";

const T = {
  primary: "#08200f", primaryContainer: "#1e3523",
  tertiaryFixed: "#c4f33a", tertiaryFixedDim: "#a9d616", onTertiaryFixed: "#161f00",
  surface: "#f7fbe7", surfaceLow: "#f2f6e2", surfaceLowest: "#ffffff",
  surfaceHigh: "#e6ead6",
  onSurface: "#191d11", onSurfaceVariant: "#434842",
  outlineVariant: "rgba(195,200,192,0.25)",
  onPrimaryContainer: "#849e87", secondary: "#49654e",
};

const AboutPage: React.FC = () => (
  <div style={{ background: T.surface, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: T.onSurface }}>
    <main style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>

      {/* ── DARK HERO ── */}
      <section style={{ padding: "0 3rem", maxWidth: "1400px", margin: "0 auto 8rem" }}>
        <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", minHeight: "500px", display: "flex", alignItems: "center", background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`, padding: "4rem" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.4, mixBlendMode: "overlay" }}>
            <img
              alt="Abstract Neural Network Structure"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7PxOnalN4fVCrCmcKjXoi2d6HZV4FHmrIDRt_9KWfv7Bzh2DpmSRwoDQo-kaOjupRFGxifkOLcQlhXw6cIxjGd4YD0Apd0sc-06swWcMKPvU9CpPnHqUhGG-IzQA1LoigXx5kNxv9J3wm84cLThYWnfkzOZGAUOFK5GSNyfrxr1X8CJgohPXZRf02yYXJfWApGc7xDniALe1kErvRGg_Iz5F7_Oq_YdoER9-yEcxDU8SKhiZ7K_U3EC663ocZ9by4qb8OigDkjgc"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: "768px" }}>
            <span style={{ display: "inline-block", padding: "0.375rem 1rem", borderRadius: "9999px", background: T.tertiaryFixed, color: T.onTertiaryFixed, fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2rem" }}>
              Clinical Grade Precision
            </span>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.75rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "2rem" }}>
              What is the{" "}<br /><span style={{ color: T.tertiaryFixed }}>Autism Predictor?</span>
            </h1>
            <p style={{ color: T.onPrimaryContainer, fontSize: "1.25rem", lineHeight: 1.7, maxWidth: "672px", fontWeight: 300 }}>
              A proprietary diagnostic interface leveraging deep learning to analyze genetic biomarkers with surgical precision. We decode complex genomic patterns to provide early insights into neurodivergent developmental pathways.
            </p>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY BENTO ── */}
      <section style={{ padding: "0 3rem", maxWidth: "1400px", margin: "0 auto 10rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", gap: "2rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, color: T.primary, marginBottom: "0.75rem" }}>Core Methodology</h2>
            <p style={{ color: T.onSurfaceVariant, maxWidth: "460px" }}>Our multi-layered approach ensures data integrity and predictive accuracy across diverse genetic profiles.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2rem" }}>
          {/* Data Sources */}
          <div style={{ gridColumn: "span 4", borderRadius: "1rem", background: T.surfaceLow, padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "background 400ms", cursor: "default" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = T.surfaceLow; }}>
            <div>
              <span style={{ fontSize: "2.25rem", marginBottom: "1.5rem", display: "block" }}>🗄️</span>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: T.primary, marginBottom: "1rem" }}>Data Sources</h3>
              <p style={{ color: T.onSurfaceVariant, lineHeight: 1.65 }}>Aggregated clinical datasets from over 40 global research institutions, harmonized for cross-genomic consistency.</p>
            </div>
            <div style={{ marginTop: "3rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Clinical Trials", "Genomic Banks"].map(t => (
                <span key={t} style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", background: T.surfaceLowest, fontSize: "0.625rem", fontWeight: 700, color: T.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</span>
              ))}
            </div>
          </div>
          {/* ANN */}
          <div style={{ gridColumn: "span 8", borderRadius: "1rem", background: T.primary, color: "#fff", padding: "3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "2rem" }}>
              <div style={{ width: "8rem", height: "8rem", borderRadius: "50%", border: `1px solid ${T.tertiaryFixed}25`, display: "flex", alignItems: "center", justifyContent: "center", animation: "spin 10s linear infinite" }}>
                <div style={{ width: "6rem", height: "6rem", borderRadius: "50%", border: `1px solid ${T.tertiaryFixed}45` }} />
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "200px" }}>
              <div>
                <span style={{ fontSize: "2.25rem", marginBottom: "1.5rem", display: "block" }}>🧠</span>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", color: T.onPrimaryContainer, fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.25rem" }}>Artificial Neural Network (ANN)</h3>
                <p style={{ color: T.onPrimaryContainer, fontSize: "1rem", maxWidth: "480px", lineHeight: 1.65 }}>Our 12-layer deep learning model utilizes unsupervised training to identify latent correlations between SNP mutations and diagnostic outcomes.</p>
              </div>
              <div style={{ marginTop: "3rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "3rem", fontWeight: 900, color: T.tertiaryFixed }}>94.2%</span>
                  <span style={{ color: T.onPrimaryContainer, fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Predictive Accuracy</span>
                </div>
              </div>
            </div>
          </div>
          {/* Feature Engineering */}
          <div style={{ gridColumn: "span 12", borderRadius: "1rem", background: T.surfaceLowest, border: `1px solid ${T.outlineVariant}`, padding: "3rem", display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "center" }}>
            <div style={{ flex: "1 1 320px" }}>
              <span style={{ fontSize: "2.25rem", marginBottom: "1.5rem", display: "block" }}>🔬</span>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: T.primary, marginBottom: "1rem" }}>Feature Engineering</h3>
              <p style={{ color: T.onSurfaceVariant, lineHeight: 1.65 }}>
                We extract high-dimensional features from raw genetic sequences, prioritizing protein-disrupting variants that carry the most significant clinical weight.
              </p>
            </div>
            <div style={{ flex: "1 1 240px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "CNVs", sub: "Copy Number Variants" }, { label: "SNPs", sub: "Single Nucleotides" },
                { label: "Exons", sub: "Protein-coding regions" }, { label: "UTRs", sub: "Regulatory elements" },
              ].map(item => (
                <div key={item.label} style={{ padding: "1.5rem", borderRadius: "0.75rem", background: T.surfaceLow }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 700, color: T.primary, marginBottom: "0.25rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.6875rem", color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BIOMARKERS ── */}
      <section style={{ background: T.surfaceLow, padding: "8rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, color: T.primary, marginBottom: "1rem" }}>Primary Biomarkers</h2>
            <p style={{ color: T.onSurfaceVariant, maxWidth: "480px", margin: "0 auto" }}>The genetic loci our model identifies as high-probability indicators for neurodevelopmental divergence.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { gene: "NLGN1", icon: "🔗", desc: "Involved in synapse formation and excitatory transmission.", risk: "High", riskColor: "#ba1a1a" },
              { gene: "PTEN", icon: "🔬", desc: "A tumor suppressor gene linked to macrocephaly and ASD.", risk: "Medium", riskColor: "#b45309" },
              { gene: "SHANK3", icon: "⚙️", desc: "Critical scaffolding protein at the post-synaptic density.", risk: "Critical", riskColor: "#7f1d1d" },
              { gene: "MECP2", icon: "📡", desc: "Regulates the activity of other genes through methylation.", risk: "Med-High", riskColor: "#92400e" },
              { gene: "CNTNAP2", icon: "🧬", desc: "Contactin associated protein-like 2, neuronal signaling.", risk: "High", riskColor: "#ba1a1a" },
              { gene: "CHD8", icon: "📚", desc: "Chromatin remodeling factor, one of strongest ASD risk genes.", risk: "Critical", riskColor: "#7f1d1d" },
            ].map(b => (
              <div key={b.gene}
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "1rem", padding: "2rem", transition: "transform 300ms", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: T.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", fontSize: "1.25rem" }}>{b.icon}</div>
                <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: T.primary, marginBottom: "0.5rem" }}>{b.gene}</h4>
                <p style={{ fontSize: "0.875rem", color: T.onSurfaceVariant, lineHeight: 1.6, marginBottom: "1.5rem" }}>{b.desc}</p>
                <div style={{ paddingTop: "1.25rem", borderTop: `1px solid ${T.outlineVariant}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, color: b.riskColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>Risk Factor: {b.risk}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIMITATIONS ── */}
      <section style={{ padding: "8rem 3rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ background: T.surfaceLowest, borderRadius: "1rem", padding: "4rem", display: "flex", flexWrap: "wrap", gap: "5rem", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: T.tertiaryFixed }} />
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: T.primary, marginBottom: "2rem" }}>Scope &amp; Limitations</h2>
            <p style={{ color: T.onSurfaceVariant, fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              Our model is a predictive tool intended for clinical support, not a definitive standalone diagnosis. Transparency in machine learning is our priority.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                "Predictions are based on probability densities, not biological certainties.",
                "Environmental factors and non-genetic contributors are currently outside of scope.",
                "Clinical validation by a board-certified professional is always required.",
                "The model was trained on specific datasets and may not apply equally to all populations.",
                "Neurodiversity is normal human variation; autism diagnosis should involve comprehensive assessment.",
              ].map(text => (
                <li key={text} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12" /></svg>
                  <p style={{ fontSize: "0.875rem", color: T.onSurface, fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{text}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* Ethics overlay card */}
          <div style={{ flex: "0 0 280px", position: "relative" }}>
            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", border: `1.5rem solid ${T.surfaceLow}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
                <img
                  alt="Laboratory Close-up"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYd-i_aUq49howACuo2J2MaMuB65cK1F16hCAVHrHshxU7eWYW5CsnQyQOLU9sC8AgceJdo49dXTKaT3oRXGfdsSdm5xYXzZe9KGW8YM0sHmDZOH8PQ6OurSZd13JfVaQpH6-qE4fxaaAMsLtYVoPrUVVDUKlN5qapgBY0nN8X9vOSvJYIOJLcZtZrXeoIFYjKcb44vp-zk_RutLYMexINE_0w24PRRBD9Gm6seSxavkFES6GHQa3QS4Zq3fyKgh81oWGOz4JcCHw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div style={{ position: "absolute", top: "50%", right: "-2rem", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", padding: "1.25rem 1.5rem", borderRadius: "0.875rem", boxShadow: "0 12px 32px rgba(25,29,17,0.08)", border: "1px solid rgba(255,255,255,0.5)", maxWidth: "200px" }}>
              <div style={{ fontSize: "0.625rem", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Ethics Protocol</div>
              <p style={{ fontSize: "0.75rem", color: T.onSurfaceVariant, margin: 0, lineHeight: 1.5 }}>All models adhere to the AI Bio-Ethics standard (IEEE P7000) for medical diagnostic software.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <style>{`@keyframes ping{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(2);opacity:0}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default AboutPage;