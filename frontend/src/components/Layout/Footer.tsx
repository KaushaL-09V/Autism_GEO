/**
 * Footer Component — Stitch Design
 * Dark green footer with columns, CRITICAL medical disclaimers preserved
 */

import React from "react";
import { Mail, Github, AlertCircle, Lock, Scale, Dna } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const PRODUCT_LINKS = [
    { label: "Home",    href: "home" },
    { label: "Upload",  href: "upload" },
    { label: "Results", href: "results" },
  ];
  const RESOURCE_LINKS = [
    { label: "FAQ",                 href: "faq" },
    { label: "About",               href: "about" },
    { label: "Clinical Disclaimer", href: "#disclaimer" },
  ];
  const LEGAL_LINKS = [
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  const linkStyle: React.CSSProperties = {
    fontSize: "0.8125rem",
    color: "rgba(255,255,255,0.5)",
    transition: "color 200ms",
    display: "block",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <>
      {/* ── CRITICAL: Medical & Privacy Disclaimers ── */}
      <div
        id="disclaimer"
        style={{
          background: "#0d1000",
          padding: "3rem 1.5rem",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Medical Disclaimer */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <AlertCircle size={18} color="#f59e0b" />
                <h3
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "#ffffff",
                  }}
                >
                  Medical Disclaimer
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                This tool is a <strong style={{ color: "rgba(255,255,255,0.75)" }}>screening support tool only</strong> and
                is NOT a diagnostic instrument. Results must be reviewed by
                qualified healthcare providers. Autism diagnosis requires
                comprehensive professional evaluation.
              </p>
            </div>

            {/* Privacy */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <Lock size={18} color="#4ade80" />
                <h3
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "#ffffff",
                  }}
                >
                  Privacy Commitment
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                We do <strong style={{ color: "rgba(255,255,255,0.75)" }}>NOT</strong> store your genetic data,
                do <strong style={{ color: "rgba(255,255,255,0.75)" }}>NOT</strong> collect personal identifiers,
                and do <strong style={{ color: "rgba(255,255,255,0.75)" }}>NOT</strong> share information with
                third parties. All data is processed securely using encryption.
              </p>
            </div>

            {/* Legal */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <Scale size={18} color="#60a5fa" />
                <h3
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "#ffffff",
                  }}
                >
                  Terms & Liability
                </h3>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                Users assume full responsibility for how results are used. We
                are not liable for diagnostic misuse or medical decisions based
                on this tool. See full terms for details.
              </p>
            </div>
          </div>

          {/* Clinical disclaimer banner */}
          <div
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "0.875rem",
              padding: "1rem 1.25rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "rgba(245,158,11,0.9)", marginBottom: "0.375rem" }}>
                ⚠️ Clinical & Research Disclaimer
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                This tool is for research and educational purposes only. It is NOT a clinical diagnostic instrument
                and should not replace professional medical evaluation. Results must be interpreted by qualified
                healthcare providers (developmental pediatrician, neurologist, psychologist) in the context of
                comprehensive clinical assessment. Autism diagnosis requires behavioral observation, developmental
                history, and specialist evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <footer
        style={{
          background: "var(--ink-dark)",
          padding: "3rem 1.5rem 2rem",
        }}
      >
        <div className="container-wide">
          {/* Logo + columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "2.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {/* Brand */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "0.5rem",
                    background: "linear-gradient(135deg, #5a6400 0%, #48654d 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Dna size={14} color="#eafe45" />
                </div>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "0.9375rem",
                    color: "#ffffff",
                  }}
                >
                  AutismPredictor
                </span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: "200px" }}>
                Join the leading institutions redefining early intervention.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", marginTop: "1.25rem" }}>
                <a
                  href="mailto:contact@autismpredictor.org"
                  aria-label="Email us"
                  style={{ color: "rgba(255,255,255,0.4)", transition: "color 200ms" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#eafe45")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)")}
                >
                  <Mail size={17} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  style={{ color: "rgba(255,255,255,0.4)", transition: "color 200ms" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#eafe45")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)")}
                >
                  <Github size={17} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                }}
              >
                Product
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.label}>
                    <span
                      style={linkStyle}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.5)")}
                    >
                      {l.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                }}
              >
                Resources
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {RESOURCE_LINKS.map((l) => (
                  <li key={l.label}>
                    <span
                      style={linkStyle}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.5)")}
                    >
                      {l.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                }}
              >
                Legal
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {LEGAL_LINKS.map((l) => (
                  <li key={l.label}>
                    <span
                      style={linkStyle}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.5)")}
                    >
                      {l.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>
              © {currentYear} AutismPredictor. Clinical Grade Precision.
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
              For research & educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;