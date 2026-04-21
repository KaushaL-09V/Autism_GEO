/**
 * LoginPage — Role-Selection Login
 * Split layout: dark branding panel (left) + form with role toggle (right)
 * Stitch reference: 4b3398eba77a443ea2940873fc75743b
 */

import React, { useState } from "react";
import { Dna, Lock, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Users, Stethoscope, FlaskConical } from "lucide-react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { motion } from "framer-motion";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.875rem",
  border: "1.5px solid var(--surface-highest)", background: "var(--surface-low)",
  fontSize: "0.9375rem", color: "var(--ink-dark)", outline: "none",
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.6875rem", fontWeight: 700,
  color: "var(--ink-mid)", letterSpacing: "0.1em", textTransform: "uppercase",
  marginBottom: "0.5rem", fontFamily: "'Manrope', sans-serif",
};

const FEATURES = [
  { Icon: ShieldCheck, label: "HIPAA & GDPR Compliant", desc: "Enterprise-grade security for clinical data" },
  { Icon: Zap,         label: "Instant Analysis",       desc: "ANN results in under 60 seconds" },
  { Icon: Users,       label: "Dual-Role Platform",     desc: "Dedicated flows for patients & clinicians" },
];

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [role,     setRole]     = useState<UserRole>("patient");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      await login(email.trim(), password, role);
      onNavigate(role === "doctor" ? "doctor-dashboard" : "patient-dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--surface)" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden md:flex" style={{ width:"42%", background:"linear-gradient(160deg, #191d11 0%, #253317 55%, #2b4731 100%)", padding:"3rem 3rem 2.5rem", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"380px", height:"380px", borderRadius:"50%", background:"rgba(234, 254, 69, 0.035)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"60px", left:"-80px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(72, 101, 77, 0.18)", pointerEvents:"none" }} />

        {/* Logo */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"3.5rem" }}>
            <div style={{ width:"2.875rem", height:"2.875rem", borderRadius:"0.875rem", background:"linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(234, 254, 69, 0.3)" }}>
              <Dna size={20} color="#191d11" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.125rem", color:"#fff", letterSpacing:"-0.01em" }}>AutismPredictor</div>
              <div style={{ fontSize:"0.6875rem", color:"rgba(255,255,255,0.45)", fontWeight:500, letterSpacing:"0.07em", textTransform:"uppercase" }}>Precision Genomics · Clinical AI</div>
            </div>
          </div>
          <h1 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"2.375rem", color:"#fff", lineHeight:1.15, marginBottom:"1rem", letterSpacing:"-0.025em" }}>
            Precision<br />Genomics for<br /><span style={{ color:"var(--lime)" }}>Clinical AI</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.9375rem", lineHeight:1.7, maxWidth:"310px" }}>
            Access the world's leading autism gene expression prediction platform, validated by neuro-clinical standards.
          </p>
        </div>

        {/* Features */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.375rem" }}>
          {FEATURES.map(({ Icon, label, desc }) => (
            <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:"1rem" }}>
              <div style={{ width:"2.25rem", height:"2.25rem", borderRadius:"0.625rem", flexShrink:0, background:"rgba(234, 254, 69, 0.09)", border:"1px solid rgba(234, 254, 69, 0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={15} color="var(--lime)" />
              </div>
              <div>
                <div style={{ fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:"0.875rem", color:"#fff", marginBottom:"0.1875rem" }}>{label}</div>
                <div style={{ fontSize:"0.8125rem", color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Status pill */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,255,255,0.055)", borderRadius:"9999px", padding:"0.4375rem 0.9375rem", width:"fit-content", border:"1px solid rgba(255,255,255,0.1)", marginTop:"2rem" }}>
          <div className="animate-breathing" style={{ width:"7px", height:"7px", borderRadius:"50%", background:"var(--lime)" }} />
          <span style={{ fontSize:"0.6875rem", color:"rgba(255,255,255,0.55)", fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'Manrope', sans-serif" }}>System Online · Precision Tier 1</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 1.5rem" }}>
        <div style={{ width:"100%", maxWidth:"448px" }}>

          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ alignItems:"center", gap:"0.625rem", marginBottom:"2rem", justifyContent:"center" }}>
            <div style={{ width:"2.25rem", height:"2.25rem", borderRadius:"0.625rem", background:"linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Dna size={16} color="var(--lime)" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.0625rem", color:"var(--ink-dark)" }}>AutismPredictor</span>
          </div>

          <motion.div
            className="tonal-card"
            style={{ padding:"2.5rem" }}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4, ease:"easeOut" }}
          >
            {/* Header */}
            <div style={{ marginBottom:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.875rem", color:"var(--ink-dark)", marginBottom:"0.375rem", letterSpacing:"-0.025em" }}>Welcome back</h2>
              <p style={{ color:"var(--ink-light)", fontSize:"0.9375rem" }}>Sign in to the Autism Predictor Platform</p>
            </div>

            {/* ── Role Selector ── */}
            <div style={{ marginBottom:"1.5rem" }}>
              <p style={{ ...labelStyle, marginBottom:"0.625rem" }}>I am a</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", padding:"0.3125rem", background:"var(--surface)", borderRadius:"1rem", border:"1px solid var(--surface-highest)" }}>
                {(["patient", "doctor"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                      padding:"0.625rem 1rem", borderRadius:"0.75rem", border:"none", cursor:"pointer",
                      fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:"0.875rem",
                      transition:"all 250ms ease",
                      background: role === r ? (r === "doctor" ? "#1a2744" : "var(--ink-dark)") : "transparent",
                      color: role === r ? (r === "doctor" ? "#7c9ef5" : "var(--lime)") : "var(--ink-light)",
                      boxShadow: role === r ? "0 2px 8px rgba(25,29,17,0.18)" : "none",
                    }}
                  >
                    {r === "patient" ? <FlaskConical size={15} /> : <Stethoscope size={15} />}
                    {r === "patient" ? "Patient" : "Doctor"}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background:"var(--error-container)", color:"var(--error)", borderRadius:"0.75rem", padding:"0.75rem 1rem", fontSize:"0.875rem", fontWeight:500, marginBottom:"1.25rem", border:"1px solid rgba(186,26,26,0.15)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              {/* Email */}
              <div>
                <label htmlFor="login-email" style={labelStyle}>Email Address</label>
                <input id="login-email" type="email" autoComplete="email" placeholder="name@institution.org"
                  value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor="var(--olive)"; e.target.style.boxShadow="0 0 0 3px rgba(90,100,0,0.1)"; }}
                  onBlur={(e)  => { e.target.style.borderColor="var(--surface-highest)"; e.target.style.boxShadow="none"; }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <label htmlFor="login-password" style={{ ...labelStyle, marginBottom:0 }}>Password</label>
                  <button type="button" style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.8125rem", color:"var(--olive)", fontWeight:600, fontFamily:"'Inter', sans-serif", padding:0 }}>Forgot Password?</button>
                </div>
                <div style={{ position:"relative" }}>
                  <input id="login-password" type={showPass ? "text" : "password"} autoComplete="current-password"
                    placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight:"3rem" }}
                    onFocus={(e) => { e.target.style.borderColor="var(--olive)"; e.target.style.boxShadow="0 0 0 3px rgba(90,100,0,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor="var(--surface-highest)"; e.target.style.boxShadow="none"; }}
                  />
                  <button type="button" id="login-toggle-password" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Hide password" : "Show password"}
                    style={{ position:"absolute", right:"0.875rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--ink-light)", display:"flex", alignItems:"center", padding:0 }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn" type="submit" disabled={loading}
                className="btn-lime"
                style={{ width:"100%", justifyContent:"center", padding:"0.9375rem", fontSize:"0.9375rem", opacity:loading ? 0.8 : 1, background: role === "doctor" ? "linear-gradient(135deg, #1a2744 0%, #2d4270 100%)" : undefined, color: role === "doctor" ? "#7c9ef5" : undefined }}
              >
                {loading && <Loader2 size={17} style={{ animation:"spin 1s linear infinite" }} />}
                {loading ? "Signing in…" : `Sign In as ${role === "doctor" ? "Doctor" : "Patient"}`}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Sign up link */}
            <p style={{ textAlign:"center", fontSize:"0.875rem", color:"var(--ink-light)", margin:"1.5rem 0 0" }}>
              Don't have an account?{" "}
              <button id="login-goto-signup" type="button" onClick={() => onNavigate("signup")}
                style={{ background:"none", border:"none", cursor:"pointer", color:"var(--olive)", fontWeight:700, fontFamily:"'Inter', sans-serif", fontSize:"0.875rem", padding:0 }}>
                Sign Up
              </button>
            </p>
          </motion.div>

          {/* Security badge */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", marginTop:"1.25rem" }}>
            <Lock size={11} color="var(--ink-light)" />
            <span style={{ fontSize:"0.6875rem", color:"var(--ink-light)", letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'Manrope', sans-serif", fontWeight:600 }}>
              Secure, HIPAA-Compliant Login Environment
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
