/**
 * HomePage — converted from Stitch HTML (Home Page - Redesign Updated)
 * Design tokens: primary=#08200f, tertiary-fixed=#c4f33a, surface=#f7fbe7
 * NO changes to API calls or business logic.
 */
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

/* ---------- inline style tokens matching Stitch design ---------- */
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
  surfaceContainerHigh: "#e6ead6",
  onSurface: "#191d11",
  onSurfaceVariant: "#434842",
  outlineVariant: "rgba(195,200,192,0.4)",
  onPrimaryContainer: "#849e87",
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [scrollRotation, setScrollRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollRotation(scrollTop * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div style={{ background: T.surface, color: T.onSurface, fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <header style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", paddingTop: "0rem", overflow: "hidden" }}>
        {/* ambient glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "60%", height: "80%", borderRadius: "50%", background: `${T.tertiaryFixed}18`, filter: "blur(120px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "70%", borderRadius: "50%", background: `${T.primaryContainer}14`, filter: "blur(100px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", padding: "0 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%" }}>
          {/* Left: text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "inline-block", padding: "0.375rem 1rem", borderRadius: "9999px", background: T.surfaceLow, border: `1px solid ${T.outlineVariant}`, fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.primary }}>
              Clinical Precision Meets AI
            </div>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, color: T.primary, lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}>
              Gene Expression <br />Analysis for{" "}
              <span style={{ color: T.onTertiaryContainer }}> Autism</span>
            </h1>
            <p style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, maxWidth: "520px", lineHeight: 1.7, margin: 0 }}>
              Unlocking biological narratives through advanced Genetic-sequencing and machine learning. We provide clinicians and researchers with 90% sensitive predictive insights.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              <button
                id="home-get-started-btn"
                onClick={() => onNavigate?.("upload")}
                style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "1.1rem 2.5rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 200ms, box-shadow 200ms", boxShadow: `0 8px 24px ${T.tertiaryFixed}28` }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                Get Started
              </button>
              <button
                id="home-learn-more-btn"
                onClick={() => onNavigate?.("about")}
                style={{ background: T.primaryContainer, color: T.surfaceLowest, padding: "1.1rem 2.5rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 200ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: hero image card */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: "1rem", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.2)", padding: "2rem", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {/* DNA helix visualization image */}
              <img
                alt="Abstract visualization of DNA helix"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQrskG6E8DipVcykLLXprxU2hfpE5E30KWQq5N-OwOnTzuFNKz4bn52QelMtnvpwy6VbvxoWG4fAlaDfTqYwDeq8xZ3EBFKuxDAQv9OVMINL5d00yokaVYsnovanopcqUTUctPuaSZi0QY5Vkhfmh9amD-zhlraPmfcxgk7tVJvcct7mQSCJE3udax8svRa25p-FXDWiZm-Sl4keT3_jegz5PmM4uK9Ltbvr7-Nl90fHtzCAC1Ph4KmjJc5BGNZsjX2mJgUsI60BA"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.5rem" }}
              />
            </div>
            {/* floating chip */}
            <div style={{ position: "absolute", bottom: "-2rem", left: "-2rem", background: T.surfaceLowest, padding: "1.25rem 1.5rem", borderRadius: "0.75rem", boxShadow: "0 20px 40px rgba(25,29,17,0.12)", border: `1px solid ${T.outlineVariant}`, maxWidth: "220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.tertiaryFixed} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                </div>
                <span style={{ fontWeight: 700, color: T.primary, fontSize: "0.875rem" }}>Live Analysis</span>
              </div>
              <div style={{ height: "6px", width: "100%", background: T.surfaceLow, borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "75%", background: T.tertiaryFixed, borderRadius: "9999px" }} />
              </div>
              <p style={{ fontSize: "0.625rem", color: T.onSurfaceVariant, marginTop: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Processing Neural Pathway Correlation...</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <section style={{ background: T.primary, padding: "3rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
          {[
            { value: "90%", label: "Model AccuracyRate" },
            { value: "18k+", label: "Gene Analyses Completed" },
            { value: "200ms", label: "Processing Speed" },
            { value: "Autism Spectrum", label: "Full Compliance" },
          ].map(s => (
            <div key={s.value} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "2.25rem", fontWeight: 800, color: s.value === "84%" ? T.tertiaryFixed : "#fff" }}>{s.value}</div>
              <div style={{ fontSize: "0.65rem", color: T.onPrimaryContainer, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section style={{ padding: "8rem 3rem", background: T.surface }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, color: T.primary, margin: "0 0 1rem" }}>Scientific Precision. Human Focus.</h2>
            <p style={{ color: T.onSurfaceVariant, maxWidth: "600px", margin: "0 auto" }}>Our framework is built on the pillars of modern biotechnology and ethical data management.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {/* Card 1 */}
            <FeatureCard
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
              title="Fast & Accurate"
              desc='"Transforming weeks of genomic research into actionable minutes through distributed neural computing."'
              dark={false}
            />
            {/* Card 2 — highlighted */}
            <FeatureCard
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.tertiaryFixed} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
              title="Privacy First"
              desc="End-to-end encryption ensures that genomic data remains the property of the donor, strictly anonymized at every layer."
              dark={true}
            />
            {/* Card 3 */}
            <FeatureCard
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>}
              title="Evidence-Based"
              desc="Built on peer-reviewed research and validated against global genomic databases for uncompromising clinical reliability."
              dark={false}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "8rem 3rem", background: T.surfaceLow, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", gap: "0rem" }}>
            <div>
              <span style={{ color: T.primaryContainer, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Workflow</span>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, color: T.primary, margin: "0.5rem 0 0" }}>How It Works</h2>
            </div>
            <p style={{ color: T.onSurfaceVariant, maxWidth: "320px" }}>From biological input to diagnostic insight—a seamless four-step transformation.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
            {[
              { n: "01", title: "Upload", desc: "Securely transmit RNA-seq data via our encrypted clinical portal." },
              { n: "02", title: "Process", desc: "AI models map gene expression patterns against known neurodevelopmental biomarkers." },
              { n: "03", title: "Results", desc: "Generate a comprehensive probability heatmap and expression variance report." },
              { n: "04", title: "Interpret", desc: "Consult with integrated clinical tools to contextualize results within patient history." },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "3.75rem", fontWeight: 700, color: `${T.onSurface}`, lineHeight: 1 }}>{s.n}</div>
                <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: T.onSurface, margin: 0 }}>{s.title}</h4>
                <p style={{ fontSize: "0.875rem", color: T.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KNOWLEDGE SECTION ── */}
      <section style={{ padding: "8rem 3rem", background: T.surface }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          {/* Left: illustration */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              id="dna-visual"
              alt="3D stylized DNA double helix logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6bQBglZ2S-V88mQxPytbnVXpSTUtSLv8R-Il4Jwv1WAmm3ySzB392i94HX1sPwk4uCfUJKejqOZDYuWn1IJgPbtJsTf3i4afXWHrMOvbMPb0Ku6PiNayzEMtj4TuGKkpiHgRB1LNyl1xt__pAOpuwkUG3Nc7KXPrkjsE6C0yD4-wdlTPCRzHc00tWc7mkDOEDdT3rQmwn131BYjA7IPJDdsGBQVUEikQ6MRbFPOeOmKPqslDKxHbSjeKISjBldQvrStnooEKWBkg"
              style={{
                width: "100%",
                maxWidth: "380px",
                borderRadius: "1rem",
                boxShadow: "0 20px 60px rgba(25,29,17,0.06)",
                transform: `rotateY(${scrollRotation}deg)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d",
              }}
            />
          </div>
          {/* Right: text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 700, color: T.onSurface, margin: 0 }}>What is Gene Expression?</h3>
              <p style={{ color: T.onSurfaceVariant, lineHeight: 1.7, margin: 0 }}>Gene expression is the process by which information from a gene is used in the synthesis of a functional gene product. By measuring the "volume" of specific genes, we can identify unique signatures associated with autism long before behavioral markers appear.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 700, color: T.onSurface, margin: 0 }}>What is Autism?</h3>
              <p style={{ color: T.onSurfaceVariant, lineHeight: 1.7, margin: 0 }}>Autism is a complex neurodevelopmental condition characterized by diverse challenges in social interaction and communication. Our tool approaches autism through a biological lens, looking for the underlying molecular fingerprints.</p>
            </div>
            <button
              id="home-explore-docs-btn"
              onClick={() => onNavigate?.("about")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: "1rem", padding: 0, textDecoration: "underline", textDecorationColor: T.tertiaryFixed, textDecorationThickness: "3px", textUnderlineOffset: "8px" }}
            >
              Explore Clinical Documentation <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ background: T.primary, borderRadius: "1rem", padding: "6rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, ${T.primaryContainer}88, ${T.primary})`, opacity: 0.5 }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0, maxWidth: "700px" }}>
                Ready to explore the biological narrative?
              </h2>
              <p style={{ color: T.onPrimaryContainer, fontSize: "1.125rem", maxWidth: "520px", margin: 0 }}>
                Join the leading institutions using AutismPredictor to redefine early intervention.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
                <button
                  id="cta-start-btn"
                  onClick={() => onNavigate?.("upload")}
                  style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "1.1rem 3rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  Start Analysis
                </button>
                <button
                  id="cta-contact-btn"
                  onClick={() => onNavigate?.("contact")}
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "1.1rem 3rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 700, border: "1px solid rgba(195,200,192,0.3)", cursor: "pointer", transition: "background 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── sub-component ── */
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; dark: boolean }> = ({ icon, title, desc, dark }) => {
  const T_local = { primary: "#08200f", tertiaryFixed: "#c4f33a", surfaceLowest: "#ffffff", onSurface: "#191d11", onSurfaceVariant: "#434842", onPrimaryContainer: "#849e87" };
  return (
    <div
      style={{
        background: dark ? T_local.primary : T_local.surfaceLowest,
        padding: "2.5rem",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        transition: "transform 250ms, box-shadow 250ms",
        cursor: "default",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(25,29,17,0.08)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
    >
      {icon}
      <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: dark ? "#fff" : T_local.onSurface, margin: 0 }}>{title}</h3>
      <p style={{ color: dark ? T_local.onPrimaryContainer : T_local.onSurfaceVariant, lineHeight: 1.65, margin: 0, fontStyle: title === "Fast & Accurate" ? "italic" : "normal" }}>{desc}</p>
    </div>
  );
};

export default HomePage;