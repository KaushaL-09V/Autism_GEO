/**
 * SignUpPage — Stitch Design: "Aethera Bio | Join the Platform"
 * Split layout: dark info panel (left) + registration form (right)
 */

import React, { useState } from "react";
import {
  Dna,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  Target,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

/* ─── Input / label styles ────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8125rem 1rem",
  borderRadius: "0.875rem",
  border: "1.5px solid var(--surface-highest)",
  background: "var(--surface-low)",
  fontSize: "0.9375rem",
  color: "var(--ink-dark)",
  outline: "none",
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "var(--ink-mid)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
  fontFamily: "'Manrope', sans-serif",
};

/* ─── Why-join bullets ────────────────────────────────────── */
const WHY_JOIN = [
  {
    Icon: Target,
    label: "Clinical Accuracy",
    desc: "Predictive models validated by neuro-clinical standards",
  },
  {
    Icon: ShieldCheck,
    label: "Privacy First",
    desc: "HIPAA & GDPR compliant — full patient data anonymity",
  },
  {
    Icon: Zap,
    label: "Instant Analysis",
    desc: "Complex biometric data → actionable insights in <60 s",
  },
];

/* ─── Password strength helpers ───────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  const map: Record<number, { label: string; color: string }> = {
    1: { label: "Weak", color: "#ba1a1a" },
    2: { label: "Fair", color: "#e08700" },
    3: { label: "Good", color: "var(--olive)" },
    4: { label: "Strong", color: "var(--forest)" },
  };
  return { score, ...(map[score] ?? map[1]) };
}

/* ═══════════════════════════════════════════════════════════ */
const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signup } = useAuth();

  const [name, setName]                     = useState("");
  const [institution, setInstitution]       = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]             = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [agreeTerms, setAgreeTerms]         = useState(false);

  const strength = getStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(name.trim(), institution.trim(), email.trim(), password);
      onNavigate("home");
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "var(--olive)";
      e.target.style.boxShadow = "0 0 0 3px rgba(90,100,0,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "var(--surface-highest)";
      e.target.style.boxShadow = "none";
    },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--surface)" }}>
      {/* ─── LEFT PANEL ───────────────────────────────────── */}
      <div
        className="hidden md:flex"
        style={{
          width: "42%",
          background: "linear-gradient(160deg, #191d11 0%, #253317 55%, #2b4731 100%)",
          padding: "3rem 3rem 2.5rem",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(234, 254, 69, 0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "80px", left: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(72,101,77,0.16)", pointerEvents: "none" }} />

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3.5rem" }}>
            <div style={{ width: "2.875rem", height: "2.875rem", borderRadius: "0.875rem", background: "linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(234, 254, 69, 0.3)" }}>
              <Dna size={20} color="#191d11" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>
                AutismPredictor
              </div>
              <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                Scientific Precision via Digital Care
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "2.25rem", color: "#fff", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.025em" }}>
            Empowering<br />Precision<br />
            <span style={{ color: "var(--lime)" }}>Medicine.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: "310px", marginBottom: "2.5rem" }}>
            Join the elite network of clinical researchers and practitioners leveraging AI for autism genomics.
          </p>

          {/* Why join */}
          <div style={{ marginBottom: "0.5rem", fontSize: "0.6875rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Manrope', sans-serif" }}>
            Why join AutismPredictor?
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}>
          {WHY_JOIN.map(({ Icon, label, desc }) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", flexShrink: 0, background: "rgba(234, 254, 69, 0.09)", border: "1px solid rgba(234, 254, 69, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color="var(--lime)" />
              </div>
              <div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff", marginBottom: "0.1875rem" }}>{label}</div>
                <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(234,254,69,0.06)", border: "1px solid rgba(234,254,69,0.12)", borderRadius: "1rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "rgba(234,254,69,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckCircle2 size={16} color="var(--lime)" />
          </div>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>Joined by 2,000+ Institutions</div>
            <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)" }}>Top-tier research centers globally</div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — form ───────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: "0.625rem", marginBottom: "2rem", justifyContent: "center" }}>
            <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", background: "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Dna size={16} color="var(--lime)" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.0625rem", color: "var(--ink-dark)" }}>AutismPredictor</span>
          </div>

          {/* Card */}
          <div className="tonal-card animate-slide-up" style={{ padding: "2.5rem" }}>
            <div style={{ marginBottom: "1.875rem" }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--ink-dark)", marginBottom: "0.375rem", letterSpacing: "-0.025em" }}>
                Create your account
              </h2>
              <p style={{ color: "var(--ink-light)", fontSize: "0.9375rem" }}>
                Join the elite network of clinical researchers and practitioners.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "var(--error-container)", color: "var(--error)", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1.25rem", border: "1px solid rgba(186,26,26,0.15)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
              {/* Name + Institution row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label htmlFor="signup-name" style={labelStyle}>Full Name *</label>
                  <input id="signup-name" type="text" autoComplete="name" placeholder="Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} {...focusStyle} />
                </div>
                <div>
                  <label htmlFor="signup-institution" style={labelStyle}>Institution</label>
                  <input id="signup-institution" type="text" autoComplete="organization" placeholder="MIT, Johns Hopkins…" value={institution} onChange={(e) => setInstitution(e.target.value)} style={inputStyle} {...focusStyle} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" style={labelStyle}>Email Address *</label>
                <input id="signup-email" type="email" autoComplete="email" placeholder="name@institution.org" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} {...focusStyle} />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" style={labelStyle}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input id="signup-password" type={showPass ? "text" : "password"} autoComplete="new-password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: "3rem" }} {...focusStyle} />
                  <button type="button" id="signup-toggle-password" onClick={() => setShowPass((v) => !v)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-light)", display: "flex", alignItems: "center", padding: 0 }} aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ flex: 1, height: "3px", borderRadius: "9999px", background: i <= strength.score ? strength.color : "var(--surface-highest)", transition: "background 300ms" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm-password" style={labelStyle}>Confirm Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="signup-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      ...inputStyle,
                      paddingRight: "3rem",
                      borderColor: passwordMismatch ? "var(--error)" : passwordsMatch ? "var(--forest)" : "var(--surface-highest)",
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(90,100,0,0.1)"; }}
                    onBlur={(e) => { e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" id="signup-toggle-confirm" onClick={() => setShowConfirm((v) => !v)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-light)", display: "flex", alignItems: "center", padding: 0 }} aria-label={showConfirm ? "Hide password" : "Show password"}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {passwordsMatch && (
                    <div style={{ position: "absolute", right: "2.5rem", top: "50%", transform: "translateY(-50%)" }}>
                      <CheckCircle2 size={16} color="var(--forest)" />
                    </div>
                  )}
                </div>
                {passwordMismatch && <p style={{ fontSize: "0.75rem", color: "var(--error)", marginTop: "0.25rem", fontFamily: "'Inter', sans-serif" }}>Passwords do not match</p>}
              </div>

              {/* Terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", cursor: "pointer" }}>
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--olive)", width: "15px", height: "15px", flexShrink: 0 }}
                />
                <span style={{ fontSize: "0.8125rem", color: "var(--ink-mid)", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                  By signing up, you agree to our{" "}
                  <span style={{ color: "var(--olive)", fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span style={{ color: "var(--olive)", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>.
                </span>
              </label>

              {/* Submit */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-lime"
                style={{ width: "100%", justifyContent: "center", padding: "0.9375rem", fontSize: "0.9375rem", opacity: loading ? 0.8 : 1, marginTop: "0.25rem" }}
              >
                {loading && <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />}
                {loading ? "Creating account…" : "Create Account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Login link */}
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--ink-light)", margin: "1.25rem 0 0" }}>
              Already have an account?{" "}
              <button id="signup-goto-login" type="button" onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--olive)", fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", padding: 0 }}>
                Log In
              </button>
            </p>
          </div>

          {/* Security badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
            <Lock size={11} color="var(--ink-light)" />
            <span style={{ fontSize: "0.6875rem", color: "var(--ink-light)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
              Secure, HIPAA-Compliant Environment
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SignUpPage;
