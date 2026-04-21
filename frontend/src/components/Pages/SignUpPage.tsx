/**
 * SignUpPage — Role-Selection Registration
 * Split layout matching the existing design system.
 * Stitch reference: fbace0deb41449c48972b64854d1f997
 */

import React, { useState } from "react";
import { Dna, Lock, Loader2, Eye, EyeOff, ArrowRight, Stethoscope, FlaskConical, CheckCircle2 } from "lucide-react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { motion } from "framer-motion";

interface SignUpPageProps {
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

const PATIENT_BENEFITS = [
  "Track your behavioral assessments over time",
  "Book appointments with your specialist",
  "Access AI-powered screening results",
  "Receive personalized recommendations",
];
const DOCTOR_BENEFITS = [
  "Manage all your patients in one place",
  "Upload & analyze genomic CSV data",
  "View ANN confidence scores & markers",
  "Track patient progress over time",
];

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [role,        setRole]        = useState<UserRole>("patient");
  const [name,        setName]        = useState("");
  const [institution, setInstitution] = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const benefits = role === "doctor" ? DOCTOR_BENEFITS : PATIENT_BENEFITS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) { setError("Please fill in all required fields."); return; }
    if (!agreed) { setError("Please accept the terms and privacy policy to continue."); return; }
    setLoading(true); setError("");
    try {
      await signup(name.trim(), institution.trim(), email.trim(), password, role);
      onNavigate(role === "doctor" ? "doctor-dashboard" : "patient-dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--olive)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(90,100,0,0.1)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--surface-highest)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--surface)" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden md:flex" style={{ width:"40%", background:"linear-gradient(160deg, #191d11 0%, #253317 55%, #2b4731 100%)", padding:"3rem", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(234,254,69,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"80px", left:"-60px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(72,101,77,0.15)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <div style={{ width:"2.75rem", height:"2.75rem", borderRadius:"0.875rem", background:"linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(234,254,69,0.3)" }}>
            <Dna size={20} color="#191d11" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.125rem", color:"#fff", letterSpacing:"-0.01em" }}>AutismPredictor</div>
            <div style={{ fontSize:"0.6875rem", color:"rgba(255,255,255,0.45)", fontWeight:500, letterSpacing:"0.07em", textTransform:"uppercase" }}>Dual-Role Clinical Platform</div>
          </div>
        </div>

        {/* Role-specific benefits */}
        <motion.div key={role} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.3 }}>
          <h2 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.875rem", color:"#fff", lineHeight:1.2, marginBottom:"0.75rem", letterSpacing:"-0.02em" }}>
            Join as a<br /><span style={{ color:role==="doctor"?"#7c9ef5":"var(--lime)" }}>{role === "doctor" ? "Clinician" : "Patient"}</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.9rem", lineHeight:1.65, marginBottom:"2rem" }}>
            {role === "doctor"
              ? "Access clinical-grade genomic analysis and manage your patient cohort."
              : "Get personalized autism screening and connect with your specialist."}
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
                <CheckCircle2 size={16} color={role==="doctor"?"#7c9ef5":"var(--lime)"} style={{ flexShrink:0, marginTop:"0.0625rem" }} />
                <span style={{ fontSize:"0.875rem", color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,255,255,0.055)", borderRadius:"9999px", padding:"0.4375rem 0.9375rem", width:"fit-content", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div className="animate-breathing" style={{ width:"7px", height:"7px", borderRadius:"50%", background:"var(--lime)" }} />
          <span style={{ fontSize:"0.6875rem", color:"rgba(255,255,255,0.55)", fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'Manrope', sans-serif" }}>Open Enrollment · Free Tier</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2.5rem 1.5rem" }}>
        <div style={{ width:"100%", maxWidth:"464px" }}>
          <motion.div className="tonal-card" style={{ padding:"2.25rem" }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, ease:"easeOut" }}>

            <div style={{ marginBottom:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Manrope', sans-serif", fontWeight:800, fontSize:"1.75rem", color:"var(--ink-dark)", marginBottom:"0.375rem", letterSpacing:"-0.025em" }}>Create your account</h2>
              <p style={{ color:"var(--ink-light)", fontSize:"0.9375rem" }}>Join the Autism Gene AI Platform</p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom:"1.25rem" }}>
              <p style={{ ...labelStyle, marginBottom:"0.625rem" }}>I am registering as</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", padding:"0.3125rem", background:"var(--surface)", borderRadius:"1rem", border:"1px solid var(--surface-highest)" }}>
                {(["patient","doctor"] as UserRole[]).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.625rem 1rem", borderRadius:"0.75rem", border:"none", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:"0.875rem", transition:"all 250ms ease",
                      background: role===r ? (r==="doctor"?"#1a2744":"var(--ink-dark)") : "transparent",
                      color:      role===r ? (r==="doctor"?"#7c9ef5":"var(--lime)") : "var(--ink-light)",
                      boxShadow:  role===r ? "0 2px 8px rgba(25,29,17,0.18)" : "none",
                    }}>
                    {r==="patient" ? <FlaskConical size={15}/> : <Stethoscope size={15}/>}
                    {r==="patient" ? "Patient" : "Doctor / Clinician"}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background:"var(--error-container)", color:"var(--error)", borderRadius:"0.75rem", padding:"0.75rem 1rem", fontSize:"0.875rem", fontWeight:500, marginBottom:"1.25rem", border:"1px solid rgba(186,26,26,0.15)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {/* Name */}
              <div>
                <label htmlFor="signup-name" style={labelStyle}>{role==="doctor"?"Full Name & Title":"Full Name"}</label>
                <input id="signup-name" type="text" autoComplete="name" placeholder={role==="doctor"?"Dr. Priya Nair":"Arjun Sharma"} value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Institution */}
              <div>
                <label htmlFor="signup-institution" style={labelStyle}>{role==="doctor"?"Hospital / Institution":"Referred by (optional)"}</label>
                <input id="signup-institution" type="text" placeholder={role==="doctor"?"AIIMS New Delhi":"Dr. Priya Nair"} value={institution} onChange={(e)=>setInstitution(e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="signup-email" style={labelStyle}>Email Address</label>
                <input id="signup-email" type="email" autoComplete="email" placeholder={role==="doctor"?"doctor@hospital.org":"patient@email.com"} value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Password */}
              <div>
                <label htmlFor="signup-password" style={labelStyle}>Password</label>
                <div style={{ position:"relative" }}>
                  <input id="signup-password" type={showPass?"text":"password"} autoComplete="new-password" placeholder="Min. 8 characters" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ ...inputStyle, paddingRight:"3rem" }} onFocus={focusStyle} onBlur={blurStyle} />
                  <button type="button" onClick={()=>setShowPass(v=>!v)} aria-label="Toggle password visibility" style={{ position:"absolute", right:"0.875rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--ink-light)", display:"flex", alignItems:"center", padding:0 }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              {/* Terms */}
              <label style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem", cursor:"pointer" }}>
                <input type="checkbox" id="signup-agree" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:"0.1875rem", accentColor:"var(--olive)", flexShrink:0, width:"1rem", height:"1rem" }} />
                <span style={{ fontSize:"0.8125rem", color:"var(--ink-mid)", lineHeight:1.5, fontFamily:"'Inter', sans-serif" }}>
                  I agree to the <button type="button" style={{ background:"none", border:"none", color:"var(--olive)", fontWeight:600, cursor:"pointer", fontSize:"0.8125rem", padding:0 }}>Terms of Service</button> and <button type="button" style={{ background:"none", border:"none", color:"var(--olive)", fontWeight:600, cursor:"pointer", fontSize:"0.8125rem", padding:0 }}>Privacy Policy</button>. HIPAA compliance is maintained.
                </span>
              </label>
              {/* Submit */}
              <button id="signup-submit-btn" type="submit" disabled={loading} className="btn-lime"
                style={{ width:"100%", justifyContent:"center", padding:"0.9375rem", fontSize:"0.9375rem", opacity:loading?0.8:1,
                  background: role==="doctor" ? "linear-gradient(135deg, #1a2744 0%, #2d4270 100%)" : undefined,
                  color: role==="doctor" ? "#7c9ef5" : undefined,
                  marginTop:"0.25rem"
                }}>
                {loading && <Loader2 size={17} style={{ animation:"spin 1s linear infinite" }}/>}
                {loading ? "Creating account…" : `Create ${role==="doctor"?"Doctor":"Patient"} Account`}
                {!loading && <ArrowRight size={16}/>}
              </button>
            </form>

            <p style={{ textAlign:"center", fontSize:"0.875rem", color:"var(--ink-light)", margin:"1.25rem 0 0" }}>
              Already have an account?{" "}
              <button id="signup-goto-login" type="button" onClick={()=>onNavigate("login")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--olive)", fontWeight:700, fontFamily:"'Inter', sans-serif", fontSize:"0.875rem", padding:0 }}>Sign In</button>
            </p>
          </motion.div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", marginTop:"1.25rem" }}>
            <Lock size={11} color="var(--ink-light)" />
            <span style={{ fontSize:"0.6875rem", color:"var(--ink-light)", letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'Manrope', sans-serif", fontWeight:600 }}>Encrypted · HIPAA-Compliant Registration</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default SignUpPage;
