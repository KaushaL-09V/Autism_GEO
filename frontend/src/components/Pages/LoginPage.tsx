/**
 * LoginPage — Stitch Design: "Aethera Bio | Secure Login"
 * Split layout: dark branding panel (left) + form card (right)
 */

import React, { useState } from "react";
import {
  Dna,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

/* ─── SVG brand icons ─────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
    <rect width="10" height="10" fill="#F35325"/>
    <rect x="11" width="10" height="10" fill="#81BC06"/>
    <rect y="11" width="10" height="10" fill="#05A6F0"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFBA08"/>
  </svg>
);

/* ─── Shared input style factory ──────────────────────────── */
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

const ssoButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "0.6875rem 1rem",
  borderRadius: "0.875rem",
  border: "1.5px solid var(--surface-highest)",
  background: "var(--surface-white)",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--ink-dark)",
  fontFamily: "'Inter', sans-serif",
  transition: "all 200ms ease",
  width: "100%",
};

/* ─── Feature bullets data ────────────────────────────────── */
const FEATURES = [
  {
    Icon: ShieldCheck,
    label: "HIPAA & GDPR Compliant",
    desc: "Enterprise-grade security for clinical data",
  },
  {
    Icon: Zap,
    label: "Instant Analysis",
    desc: "Results in under 60 seconds",
  },
  {
    Icon: Users,
    label: "2,000+ Institutions",
    desc: "Trusted by top-tier research centers globally",
  },
];

/* ═══════════════════════════════════════════════════════════ */
const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      onNavigate("home");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--surface)",
      }}
    >
      {/* ─── LEFT PANEL — dark brand ──────────────────────── */}
      <div
        className="hidden md:flex"
        style={{
          width: "42%",
          background:
            "linear-gradient(160deg, #191d11 0%, #253317 55%, #2b4731 100%)",
          padding: "3rem 3rem 2.5rem",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(234, 254, 69, 0.035)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "-80px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(72, 101, 77, 0.18)",
            pointerEvents: "none",
          }}
        />

        {/* Logo + headline */}
        <div>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "3.5rem",
            }}
          >
            <div
              style={{
                width: "2.875rem",
                height: "2.875rem",
                borderRadius: "0.875rem",
                background:
                  "linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(234, 254, 69, 0.3)",
              }}
            >
              <Dna size={20} color="#191d11" strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.125rem",
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                AutismPredictor
              </div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Scientific Precision via Digital Care
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "2.375rem",
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "1rem",
              letterSpacing: "-0.025em",
            }}
          >
            Precision<br />Genomics for<br />
            <span style={{ color: "var(--lime)" }}>Clinical AI</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              maxWidth: "310px",
            }}
          >
            Access the world's leading autism gene expression prediction
            platform, validated by neuro‑clinical standards.
          </p>
        </div>

        {/* Feature list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.375rem",
          }}
        >
          {FEATURES.map(({ Icon, label, desc }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.625rem",
                  flexShrink: 0,
                  background: "rgba(234, 254, 69, 0.09)",
                  border: "1px solid rgba(234, 254, 69, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={15} color="var(--lime)" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#fff",
                    marginBottom: "0.1875rem",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.055)",
            borderRadius: "9999px",
            padding: "0.4375rem 0.9375rem",
            width: "fit-content",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "2rem",
          }}
        >
          <div
            className="animate-breathing"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--lime)",
            }}
          />
          <span
            style={{
              fontSize: "0.6875rem",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            System Online · Precision Tier 1
          </span>
        </div>
      </div>

      {/* ─── RIGHT PANEL — form ───────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "448px" }}>
          {/* Mobile logo (visible only on small screens) */}
          <div
            className="flex md:hidden"
            style={{
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "2rem",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "0.625rem",
                background:
                  "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dna size={16} color="var(--lime)" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "1.0625rem",
                color: "var(--ink-dark)",
              }}
            >
              AutismPredictor
            </span>
          </div>

          {/* Card */}
          <div
            className="tonal-card animate-slide-up"
            style={{ padding: "2.5rem" }}
          >
            <div style={{ marginBottom: "1.875rem" }}>
              <h2
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.875rem",
                  color: "var(--ink-dark)",
                  marginBottom: "0.375rem",
                  letterSpacing: "-0.025em",
                }}
              >
                Welcome back
              </h2>
              <p style={{ color: "var(--ink-light)", fontSize: "0.9375rem" }}>
                Access the Autism Predictor Platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "var(--error-container)",
                  color: "var(--error)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "1.25rem",
                  border: "1px solid rgba(186, 26, 26, 0.15)",
                }}
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {/* Email */}
              <div>
                <label htmlFor="login-email" style={labelStyle}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@institution.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--olive)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(90,100,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--surface-highest)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label htmlFor="login-password" style={{ ...labelStyle, marginBottom: 0 }}>
                    Password
                  </label>
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8125rem",
                      color: "var(--olive)",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "3rem" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--olive)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(90,100,0,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--surface-highest)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    id="login-toggle-password"
                    onClick={() => setShowPass((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--ink-light)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-lime"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.9375rem",
                  fontSize: "0.9375rem",
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading && (
                  <Loader2
                    size={17}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "1.5rem 0",
              }}
            >
              <div
                style={{ flex: 1, height: "1px", background: "var(--surface-highest)" }}
              />
              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--ink-light)",
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  fontFamily: "'Manrope', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Institutional SSO
              </span>
              <div
                style={{ flex: 1, height: "1px", background: "var(--surface-highest)" }}
              />
            </div>

            {/* SSO buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <button
                id="login-google-btn"
                type="button"
                style={ssoButtonStyle}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--surface-low)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--surface-white)")
                }
              >
                <GoogleIcon />
                Google
              </button>
              <button
                id="login-microsoft-btn"
                type="button"
                style={ssoButtonStyle}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--surface-low)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--surface-white)")
                }
              >
                <MicrosoftIcon />
                Microsoft
              </button>
            </div>

            {/* Sign up link */}
            <p
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "var(--ink-light)",
                margin: 0,
              }}
            >
              Don't have an account?{" "}
              <button
                id="login-goto-signup"
                type="button"
                onClick={() => onNavigate("signup")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--olive)",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  padding: 0,
                }}
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Security badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1.25rem",
            }}
          >
            <Lock size={11} color="var(--ink-light)" />
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--ink-light)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
              }}
            >
              Secure, HIPAA-Compliant Login Environment
            </span>
          </div>
        </div>
      </div>

      {/* Inline keyframes for spinner */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
