/**
 * FAQPage — converted from Stitch HTML (FAQ Page - Redesign)
 * ALL business logic (useKnowledgeBase, toolFAQs) is UNCHANGED.
 */
import React, { useState } from "react";
import { useKnowledgeBase } from "../../hooks/useKnowledgeBase";

interface FAQItem { id: string; category: string; question: string; answer: string; }

const T = {
  primary: "#08200f", tertiaryFixed: "#c4f33a", onTertiaryFixed: "#161f00",
  secondaryContainer: "#cbebcd", onSecondaryContainer: "#4f6b53",
  surface: "#f7fbe7", surfaceLow: "#f2f6e2", surfaceLowest: "#ffffff",
  onSurface: "#191d11", onSurfaceVariant: "#434842", onPrimaryContainer: "#849e87",
};

const ICONS: Record<string, string> = {
  "Using This Tool": "🔧", "Understanding Results": "📊", "Medical & Science": "🔬",
  "About This Tool": "ℹ️", "Privacy & Safety": "🔒", "Technical": "⚙️", default: "💬",
};

const FAQPage: React.FC = () => {
  const { faqItems: medicalFaqs } = useKnowledgeBase();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const toolFAQs: FAQItem[] = [
    { id: "t1", category: "Using This Tool", question: "How do I start my first assessment?", answer: 'Navigate to "Upload", prepare a CSV with Gene and Value columns. Our interface will guide you through upload and analysis.' },
    { id: "t2", category: "Using This Tool", question: "What data format do I need?", answer: "A CSV file with two columns: 'Gene' and 'Value'. The first row should be headers." },
    { id: "t3", category: "Understanding Results", question: "How should I interpret the confidence scores?", answer: "Confidence scores show statistical alignment with our validated clinical benchmarks. Higher scores indicate stronger correlation with neurodivergent markers." },
    { id: "t4", category: "Understanding Results", question: "Can I share results with my doctor?", answer: "Yes. Export the results and bring them to your appointment. Be clear that this is a research screening tool, not a clinical diagnostic evaluation." },
    { id: "t5", category: "Medical & Science", question: "Is this a formal medical diagnosis?", answer: "No. AutismPredictor provides a screening tool, not a definitive medical diagnosis. Results should facilitate further discussions with specialized medical professionals." },
    { id: "t6", category: "Medical & Science", question: "What factors does this tool NOT consider?", answer: "Behavioral traits, developmental history, social patterns, communication abilities, co-occurring conditions, or environmental factors — all crucial for diagnosis." },
    { id: "t7", category: "Privacy & Safety", question: "Is my data safe and private?", answer: "Yes. Data is processed securely using industry-standard encryption. We do NOT store, share, or use it for any purpose beyond providing your result." },
    { id: "t8", category: "Privacy & Safety", question: "Can you identify me from my genetic data?", answer: "No. We do not store names, medical IDs, or any personal identifiers. Your analysis is completely anonymized." },
    { id: "t9", category: "Technical", question: "How long does analysis take?", answer: "Most analyses complete within 5-30 seconds depending on file size and server load." },
    { id: "t10", category: "Technical", question: "What's the maximum file size?", answer: "The maximum file size is 10MB. Most standard gene expression CSV files are much smaller." },
  ];

  const all = [...toolFAQs, ...medicalFaqs];
  const categories = Array.from(new Set(all.map(i => i.category)));
  const filtered = all.filter(i =>
    (activeCat ? i.category === activeCat : true) &&
    (query ? i.question.toLowerCase().includes(query.toLowerCase()) || i.answer.toLowerCase().includes(query.toLowerCase()) : true)
  );
  const grouped: Record<string, FAQItem[]> = {};
  filtered.forEach(i => { if (!grouped[i.category]) grouped[i.category] = []; grouped[i.category].push(i); });

  return (
    <div style={{ background: T.surface, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: T.onSurface }}>
      <main style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "6rem", padding: "0 1.5rem" }}>
          <div style={{ display: "inline-block", padding: "0.25rem 1rem", marginBottom: "1.5rem", borderRadius: "9999px", background: T.secondaryContainer, color: T.onSecondaryContainer, fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Support Center
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, color: T.primary, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem" }}>
            How can we help?
          </h1>
          <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.onSurfaceVariant} strokeWidth="2" style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input id="faq-search" type="text" placeholder="Search clinical documentation, tool guides, or safety protocols..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ width: "100%", background: T.surfaceLowest, border: "none", boxShadow: "0 20px 40px rgba(25,29,17,0.06)", borderRadius: "9999px", padding: "1.5rem 2rem 1.5rem 3.75rem", fontSize: "1rem", color: T.onSurface, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }}
            />
          </div>
        </header>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "220px 1fr", gap: "4rem" }}>
          {/* Sidebar */}
          <aside>
            <nav style={{ position: "sticky", top: "8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[{ key: null, label: "All Questions", icon: "📋" }, ...categories.map(c => ({ key: c, label: c, icon: ICONS[c] || ICONS.default }))].map(item => (
                <button key={String(item.key)} onClick={() => setActiveCat(activeCat === item.key ? null : item.key as string | null)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderRadius: "0.75rem", background: activeCat === item.key ? T.surfaceLow : "transparent", color: activeCat === item.key ? T.primary : T.onSurfaceVariant, fontWeight: activeCat === item.key ? 600 : 400, border: "none", cursor: "pointer", textAlign: "left", transition: "all 200ms" }}>
                  <span>{item.icon}</span><span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <section style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {Object.keys(grouped).length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: T.onSurfaceVariant }}>No results found for "{query}"</div>
            ) : Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.25rem", fontWeight: 700, color: T.primary, marginBottom: "2rem" }}>
                  <span style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: T.tertiaryFixed, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem" }}>
                    {ICONS[cat] || ICONS.default}
                  </span>
                  {cat}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {items.map(item => {
                    const open = expandedId === item.id;
                    return (
                      <div key={item.id} style={{ background: T.surfaceLowest, borderRadius: "0.875rem", overflow: "hidden", boxShadow: open ? "0 8px 24px rgba(25,29,17,0.06)" : "none", transition: "box-shadow 200ms" }}>
                        <button id={`faq-${item.id}`} onClick={() => setExpandedId(open ? null : item.id)} aria-expanded={open}
                          style={{ width: "100%", padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                          <span style={{ fontWeight: 600, fontSize: "1.0625rem", color: T.primary, paddingRight: "1rem" }}>{item.question}</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.onSurfaceVariant} strokeWidth="2"
                            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 300ms" }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        {open && <div style={{ padding: "0 2rem 1.75rem", color: T.onSurfaceVariant, lineHeight: 1.7, fontSize: "0.9375rem" }}>{item.answer}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "1rem", background: "#0a5c3a", padding: "3rem 2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem", color: "#fff", marginTop: "1rem" }}>
              <div style={{ position: "absolute", right: "-5rem", bottom: "-5rem", width: "24rem", height: "24rem", borderRadius: "50%", background: `${T.tertiaryFixed}18`, filter: "blur(100px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1, maxWidth: "460px" }}>
                <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                  Still have <span style={{ color: T.tertiaryFixed }}>unanswered</span> questions?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "2rem" }}>
                  Our clinical support team is available 24/7 to help you navigate your journey with clarity and compassion.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <a href="mailto:contact@autismpredictor.org" id="faq-contact-btn"
                    style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "0.875rem 2rem", borderRadius: "9999px", fontWeight: 700, textDecoration: "none", fontSize: "0.9375rem" }}>
                    Chat with Support
                  </a>
                  <button id="faq-schedule-btn"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", color: "#fff", padding: "0.875rem 2rem", borderRadius: "9999px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: "0.9375rem" }}>
                    Schedule a Call
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;