/**
 * SupportPage — converted from Stitch HTML (Support & Resources - Redesign)
 * Sections: Hero, Parent Roadmap, Early Signs bento, Resource Library, Community CTA.
 * Stitch design tokens: primary=#08200f, tertiaryFixed=#c4f33a, surface=#f7fbe7
 */
import React, { useState } from "react";

interface SupportPageProps {
  onNavigate?: (page: string) => void;
}

/* ── Design tokens (matching every other page in the project) ── */
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
  secondaryContainer: "#cbebcd",
  onSecondaryContainer: "#4f6b53",
  onSurface: "#191d11",
  onSurfaceVariant: "#434842",
  outline: "rgba(195,200,192,0.25)",
  onPrimaryContainer: "#849e87",
};

/* ── Article/resource data ── */
const ARTICLES = [
  {
    tag: "Research", tagColor: T.onTertiaryContainer,
    readTime: "12 min read",
    title: "Neuroplasticity and Early Intervention Benefits",
    desc: "Recent studies highlight how early behavioral therapy can rewire neural pathways in toddlers showing early ASD traits.",
    imgBg: "linear-gradient(135deg, #d4edda 0%, #c8e6c9 100%)",
    category: "Scientific",
    emoji: "🧠",
  },
  {
    tag: "Community", tagColor: "#49654e",
    readTime: "8 min read",
    title: "Finding Your Local Support Network",
    desc: "How to connect with parent support groups and specialized pediatric networks in your metropolitan area.",
    imgBg: "linear-gradient(135deg, #e8d5c4 0%, #f0e6d2 100%)",
    category: "Community",
    emoji: "🤝",
  },
  {
    tag: "Toolkit", tagColor: "#5a6400",
    readTime: "5 min read",
    title: "Daily Routine Visual Schedules",
    desc: "Downloadable visual aids to help children with autism manage transitions and daily self-care tasks independently.",
    imgBg: "linear-gradient(135deg, #b3e5fc 0%, #c5cae9 100%)",
    category: "Toolkit",
    emoji: "📅",
  },
  {
    tag: "Research", tagColor: T.onTertiaryContainer,
    readTime: "10 min read",
    title: "Understanding Sensory Processing Disorders",
    desc: "A comprehensive look at co-occurring sensory sensitivities and evidence-based occupational therapy approaches.",
    imgBg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
    category: "Scientific",
    emoji: "🔬",
  },
  {
    tag: "Community", tagColor: "#49654e",
    readTime: "6 min read",
    title: "Navigating the IEP Process",
    desc: "Step-by-step guidance for parents working with schools to create an Individualized Education Program.",
    imgBg: "linear-gradient(135deg, #fff9c4 0%, #fff3e0 100%)",
    category: "Community",
    emoji: "📋",
  },
  {
    tag: "Toolkit", tagColor: "#5a6400",
    readTime: "4 min read",
    title: "Communication Cards for Nonverbal Children",
    desc: "Free printable AAC starter cards and digital resources for supporting nonverbal communication at home.",
    imgBg: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
    category: "Toolkit",
    emoji: "💬",
  },
];

const TABS = ["Scientific", "Community", "Toolkit"] as const;
type Tab = typeof TABS[number];

const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Scientific");

  const filteredArticles = ARTICLES.filter(a => a.category === activeTab);

  return (
    <div style={{ background: T.surface, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: T.onSurface }}>
      <main style={{ paddingTop: "5rem" }}>

        {/* ══════════════════════════════════════
            HERO — split layout, left text / right image card + floating stat
            ══════════════════════════════════════ */}
        <section style={{ padding: "5rem 3rem 8rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

            {/* Left: text */}
            <div>
              <span style={{ display: "inline-block", padding: "0.375rem 1.25rem", marginBottom: "1.5rem", borderRadius: "9999px", background: T.secondaryContainer, color: T.onSecondaryContainer, fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Knowledge Hub
              </span>
              <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, color: T.primary, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
                Understanding the<br />Autism Spectrum
              </h1>
              <p style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, lineHeight: 1.7, maxWidth: "520px", marginBottom: "2.5rem" }}>
                A child's journey is unique. We provide the scientific clarity and emotional support needed to navigate the early stages of neurodevelopment with confidence and grace.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <button
                  id="support-explore-btn"
                  style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "1rem 2.5rem", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", transition: "transform 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  onClick={() => document.getElementById("resource-library")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Guide →
                </button>
                <button
                  id="support-pdf-btn"
                  style={{ background: T.surfaceLow, color: T.primary, padding: "1rem 2.5rem", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1rem", transition: "background 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceHigh; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceLow; }}
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Right: image card + floating stat */}
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "1rem", overflow: "hidden", aspectRatio: "4/5", boxShadow: "0 32px 64px rgba(8,32,15,0.12)", position: "relative" }}>
                {/* Image */}
                <img
                  alt="Candid moment of a child playing with colorful wooden blocks in soft natural sunlight"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5rWMEs6l2--WRs7-CjgswRQZeubP1DCBhGXIOBzdIWj1l_Yo-9nI8ISj9SNXnNclWgXqV5vnm8S87ADjjbYignKjqmKrLgKQFKHVg7B3r06Fpt7MK7yoD1m1Hm7f0nqF9NhyeFT1Odwk2gs0mxsPlKHTtd29inei-viGaR8M-_26c5TZDYn0BOyTYDWBGgLZjUHFYsTnwWx56QqKt688M4Gg9KK3u_RGEE-r7jJB_DgJvq62YlplFXQ3_LTi-lUTDHOnVIwFoRLg"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.primary}66, transparent)` }} />
              </div>

              {/* Floating stat card */}
              <div style={{ position: "absolute", bottom: "-2rem", left: "-3rem", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(24px)", padding: "1.5rem 2rem", borderRadius: "1rem", boxShadow: "0 20px 40px rgba(25,29,17,0.10)", border: "1px solid rgba(255,255,255,0.6)", maxWidth: "220px" }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "2.5rem", fontWeight: 900, color: T.primary, lineHeight: 1, marginBottom: "0.5rem" }}>1 in 36</div>
                <p style={{ fontSize: "0.75rem", color: T.onSurfaceVariant, lineHeight: 1.5, margin: 0 }}>Children are identified with ASD according to CDC estimates. Knowledge is the first step.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PARENT ROADMAP — 4-step cards
            ══════════════════════════════════════ */}
        <section style={{ background: T.surfaceLow, padding: "8rem 3rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 5rem" }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: T.primary, marginBottom: "1rem" }}>Roadmap for Parents</h2>
              <p style={{ color: T.onSurfaceVariant, fontSize: "1.125rem", lineHeight: 1.65 }}>A structured approach to understanding, testing, and supporting your child's developmental path.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
              {[
                { n: "01", title: "Observation", desc: "Identifying patterns in social interaction, communication, and repetitive behaviors in a home environment.", icon: "👁️" },
                { n: "02", title: "Screening", desc: "Using clinical-grade predictive tools to assess the likelihood of neurodivergent traits early on.", icon: "🔍" },
                { n: "03", title: "Clinical Eval", desc: "Consulting with developmental pediatricians or psychologists for formal diagnostic confirmation.", icon: "🏥" },
                { n: "04", title: "Support Plan", desc: "Implementing tailored speech, occupational, and behavioral therapies to foster growth.", icon: "📋" },
              ].map(step => (
                <div
                  key={step.n}
                  style={{ background: T.surfaceLowest, padding: "2.5rem", borderRadius: "1rem", border: `1px solid ${T.outline}`, transition: "box-shadow 250ms, transform 250ms", cursor: "default" }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = "0 20px 40px rgba(25,29,17,0.08)"; d.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = "none"; d.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: "3rem", height: "3rem", background: T.secondaryContainer, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
                    <span style={{ fontWeight: 700, color: T.primary, fontSize: "0.875rem" }}>{step.n}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: T.onSurface, marginBottom: "0.75rem" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: T.onSurfaceVariant, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            EARLY SIGNS — asymmetric bento grid
            ══════════════════════════════════════ */}
        <section style={{ padding: "8rem 3rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", gap: "2rem" }}>
            <div style={{ maxWidth: "520px" }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.primary, marginBottom: "1rem" }}>Recognizing Early Signs</h2>
              <p style={{ fontSize: "1.125rem", color: T.onSurfaceVariant, lineHeight: 1.65 }}>Early detection opens the door to effective early intervention. Watch for these developmental markers between ages 12 and 24 months.</p>
            </div>
            <button
              id="support-checklist-btn"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "underline", textDecorationColor: T.tertiaryFixed, textDecorationThickness: "3px", textUnderlineOffset: "8px" }}
            >
              View Comprehensive Checklist →
            </button>
          </div>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: "1.5rem" }}>
            {/* Large card — spans 2 cols */}
            <div style={{ gridColumn: "span 2", background: T.primary, borderRadius: "1rem", padding: "3rem", color: "#fff", position: "relative", overflow: "hidden" }}>
              {/* Background image overlay */}
              <div style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.2, width: "50%", height: "100%", backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8iyV743Va_B4xgauWVUu5bpXwuLiYGR7EQHWLaCLwqzHPrRpAjsJGPbuAEGc1-vXnT-nD_SBBsP1OI2c4IpuUGKTyU5CfkUmBLf9upmng4VsvpoDZh5h_w528Vhjrorlz-PUE5pHek9K0sV-PHvIqLdMe4qLwqbY0opn2qxOHNqfZl3AnZ7GAU3ceBihm1LABYiWPq0ZNAMcsnSp3t7U4PT2Mfs9lHOnVhbb2yttcVo7VMVkX3BJQ27BevmHiwMd9s-7KkCxmlLQ')", backgroundSize: "contain", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "1.5rem" }}>🧠</span>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.25rem", color: T.tertiaryFixed }}>Social Communication Nuances</h3>
                <p style={{ color: T.tertiaryFixed, lineHeight: 1.65, fontSize: "1rem", marginBottom: "2rem", maxWidth: "480px" }}>Lack of eye contact, limited pointing to show interest, or delayed response when their name is called are key early markers.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {["Little or no eye contact", "Limited shared enjoyment (not showing toys)", "Not responding to simple requests"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem" }}>
                      <span style={{ color: T.tertiaryFixed, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right col — Repetitive Behaviors */}
            <div style={{ background: T.surfaceHigh, borderRadius: "1rem", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "1rem" }}>🔄</span>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: T.onSurface, marginBottom: "0.75rem" }}>Repetitive Behaviors</h3>
                <p style={{ fontSize: "0.8125rem", color: T.onSurfaceVariant, lineHeight: 1.65, margin: 0 }}>Unusual interest in parts of objects, repetitive body movements (hand-flapping), or intense fixations.</p>
              </div>
              <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: `1px solid ${T.outline}` }}>
                <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.primary }}>Learn more about sensory processing</span>
              </div>
            </div>

            {/* Language Delays */}
            <div style={{ background: T.surfaceLowest, borderRadius: "1rem", padding: "2rem", border: `1px solid ${T.outline}` }}>
              <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "1rem" }}>🔇</span>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: T.onSurface, marginBottom: "0.75rem" }}>Language Delays</h3>
              <p style={{ fontSize: "0.8125rem", color: T.onSurfaceVariant, lineHeight: 1.65, margin: 0 }}>Losing previously acquired words (regression) or significant delays in babbling and basic verbal communication by 18 months.</p>
            </div>

            {/* Professional Screening — spans 2 cols */}
            <div style={{ gridColumn: "span 2", background: T.secondaryContainer, borderRadius: "1rem", padding: "3rem", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Left — Image */}
              <div style={{ flex: "0 0 auto", minWidth: "200px" }}>
                <img
                  alt="Close up of a medical professional's hand holding a gentle small toy, interacting with a blurry child in the background, clinical yet warm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_z1CEXi0qISsUtHywYKbrKwkEIYW2kpCXs_RM-L3rd3ZMJFQoC1fNojj64WZEXuPc0ER2AUmMietMgxLqGDrteqAAUqZtK_eOQhH4rWb-y_trwTcWU8kqO_B188Rp5NjDafLxqIX_QDEs9muXdLK3lNaLJfMWR9qzE_jtIK27ET-lfSv6-tK8htoqghRspNbUkgyLylA8RAHrVNb3IxIYjrzXmgr2N5b-Y4RTAN2KVJRwJbquDVA50Y4US9boiMuSZrma6kDQqaw"
                  style={{ borderRadius: "0.875rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", height: "12rem", objectFit: "cover" }}
                />
              </div>
              {/* Right — Text */}
              <div style={{ flex: "1 1 260px" }}>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: T.onSecondaryContainer, marginBottom: "1rem" }}>Professional Screening</h3>
                <p style={{ color: T.onSecondaryContainer, opacity: 0.8, fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>Our predictive model analyzes developmental milestones to provide an early assessment score, assisting in clinical discussions.</p>
                <button
                  id="support-start-screening-btn"
                  onClick={() => onNavigate?.("upload")}
                  style={{ background: T.primary, color: "#fff", padding: "0.625rem 1.5rem", borderRadius: "9999px", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "0.875rem", transition: "transform 200ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  Start Screening
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            RESOURCE LIBRARY — tabbed articles
            ══════════════════════════════════════ */}
        <section id="resource-library" style={{ background: T.surface, padding: "8rem 3rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Library header + tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem", gap: "2rem" }}>
              <div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.primary, marginBottom: "0.5rem" }}>Resource Library</h2>
                <p style={{ color: T.onSurfaceVariant, fontSize: "1rem" }}>Clinical research and practical toolkits for every stage.</p>
              </div>
              {/* Tab pills */}
              <div style={{ display: "flex", gap: "0.375rem", padding: "0.375rem", background: T.surfaceLow, borderRadius: "9999px" }}>
                {TABS.map(tab => (
                  <button
                    key={tab}
                    id={`support-tab-${tab.toLowerCase()}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ padding: "0.5rem 1.5rem", borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", transition: "all 200ms", background: activeTab === tab ? T.primary : "transparent", color: activeTab === tab ? "#fff" : T.onSurfaceVariant }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Article grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2.5rem" }}>
              {filteredArticles.map((article, i) => (
                <article
                  key={i}
                  style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).querySelector<HTMLDivElement>(".article-img")!.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).querySelector<HTMLDivElement>(".article-img")!.style.transform = "scale(1)"; }}
                >
                  {/* Thumbnail */}
                  <div style={{ overflow: "hidden", borderRadius: "0.875rem", marginBottom: "1.5rem", aspectRatio: "16/9", background: article.imgBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="article-img" style={{ fontSize: "4rem", transition: "transform 500ms" }}>{article.emoji}</div>
                  </div>
                  {/* Meta */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: article.tagColor, background: `${T.tertiaryFixed}30`, padding: "0.25rem 0.75rem", borderRadius: "0.25rem" }}>{article.tag}</span>
                    <span style={{ fontSize: "0.6875rem", color: T.onSurfaceVariant }}>{article.readTime}</span>
                  </div>
                  {/* Text */}
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: T.onSurface, marginBottom: "0.75rem", lineHeight: 1.3, flex: 1 }}>{article.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: T.onSurfaceVariant, lineHeight: 1.65, marginBottom: "1.25rem" }}>{article.desc}</p>
                  <span style={{ color: T.primary, fontWeight: 700, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Read Full Article ↗
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            COMMUNITY CTA — split card with image
            ══════════════════════════════════════ */}
        <section style={{ padding: "5rem 3rem 8rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ borderRadius: "1rem", overflow: "hidden", boxShadow: "0 32px 64px rgba(8,32,15,0.16)", display: "flex", minHeight: "420px" }}>
              {/* Left — text */}
              <div style={{ flex: "1 1 50%", background: T.primary, padding: "5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "2rem" }}>You are not alone.</h2>
                <p style={{ color: T.onPrimaryContainer, fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "3rem" }}>
                  Join a global community of over 50,000 families navigating the same path. Shared experiences, expert advice, and a safe space to ask the hard questions.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <button
                    id="support-forums-btn"
                    style={{ background: T.tertiaryFixed, color: T.onTertiaryFixed, padding: "1rem 2rem", borderRadius: "0.5rem", fontWeight: 700, border: "none", cursor: "pointer", textAlign: "center", transition: "background 200ms", fontSize: "0.9375rem" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.tertiaryFixedDim; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.tertiaryFixed; }}
                  >
                    Discussion Forums
                  </button>
                  <button
                    id="support-centers-btn"
                    style={{ background: T.primaryContainer, color: "#fff", padding: "1rem 2rem", borderRadius: "0.5rem", fontWeight: 700, border: `1px solid rgba(195,200,192,0.2)`, cursor: "pointer", textAlign: "center", transition: "background 200ms", fontSize: "0.9375rem" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.primary; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.primaryContainer; }}
                  >
                    Find Support Centers
                  </button>
                </div>
              </div>

              {/* Right — image with overlay */}
              <div style={{ flex: "1 1 50%", position: "relative", overflow: "hidden", minHeight: "420px" }}>
                <img
                  alt="Two people holding hands across a table, focusing on the connection, warm and soft morning light, compassionate atmosphere"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfob_mh8R17mNkS6ZBK6EoRb404YCqh0_j5TsKS3bQhUQbQfDG799xNdPumuBeU9OXu6CZxuveM5JHvVaJVgymkco3DtbrBb_Mx5EQdhIArEZG-L4-ElRoouH0qoc37sT8jxzvufSD6etBWHZac51jsknbWUVFoHJ8ir5Rd7EQ5fSrbHEFg7YjBB8ly1YFxVTnLq1Q04AAsqHW15VEI9BKQV4c0EC177pUPBaNrvlpTt05dQB0rId0u2-zAZdCDMzhmStgtTK5NRg"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `rgba(8, 32, 15, 0.2)` }} />
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SupportPage;
