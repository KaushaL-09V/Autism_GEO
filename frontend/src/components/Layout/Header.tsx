/**
 * Header — Role-Aware Navigation
 * Renders different nav items for Patient vs Doctor roles.
 * Glassmorphism bar with lime CTA, olive branding.
 */

import React, { useState, useEffect } from "react";
import { Menu, X, Dna, LogOut, User, Stethoscope, FlaskConical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isDashboard?: boolean;
}

const PATIENT_NAV = [
  { id: "patient-dashboard", label: "Dashboard" },
  { id: "patient-assessment", label: "Assessment" },
  { id: "patient-book-appointment", label: "Book Appointment" },
  { id: "patient-results", label: "My Results" },
  { id: "support", label: "Resources" },
];

const DOCTOR_NAV = [
  { id: "doctor-dashboard", label: "Dashboard" },
  { id: "doctor-patients", label: "Patient Management" },
  { id: "doctor-upload", label: "Data Upload" },
  { id: "doctor-analysis", label: "Analysis" },
  { id: "about", label: "About" },
];

const PUBLIC_NAV = [
  { id: "home", label: "Home" },
  { id: "upload", label: "Upload" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Resources" },
  { id: "about", label: "About" },
];

const Header: React.FC<HeaderProps> = ({ currentPage = "home", onNavigate, isDashboard }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, userRole } = useAuth();

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const navLinks = userRole === "doctor"
    ? DOCTOR_NAV
    : userRole === "patient"
      ? PATIENT_NAV
      : PUBLIC_NAV;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    onNavigate?.("login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (page: string) => {
    setMobileOpen(false);
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const roleBadge = userRole === "doctor" ? (
    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6875rem", fontWeight: 700, color: "red", background: "rgba(124,158,245,0.12)", padding: "0.125rem 0.5rem", borderRadius: "9999px", border: "1px solid rgba(124,158,245,0.25)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'Manrope', sans-serif" }}>
      <Stethoscope size={9} /> Doctor
    </span>
  ) : userRole === "patient" ? (
    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6875rem", fontWeight: 700, color: "red ", background: "rgba(234,254,69,0.12)", padding: "0.125rem 0.5rem", borderRadius: "9999px", border: "1px solid rgba(234,254,69,0.25)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'Manrope', sans-serif" }}>
      <FlaskConical size={9} /> Patient
    </span>
  ) : null;

  return (
    <>
      <header
        style={{
          position: isDashboard ? "sticky" : "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled
            ? "rgba(247, 251, 231, 0.90)"
            : "rgba(247, 251, 231, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(199, 200, 173, 0.4)"
            : "1px solid rgba(199, 200, 173, 0.2)",
          transition: "all 300ms ease",
          boxShadow: scrolled ? "0 2px 20px rgba(25,29,17,0.06)" : "none",
        }}
      >
        <div className="container-wide">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.5rem" }}>

            {/* Logo */}
            <button
              id="header-logo-btn"
              onClick={() => handleNav(userRole === "doctor" ? "doctor-dashboard" : userRole === "patient" ? "patient-dashboard" : "home")}
              style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              aria-label="Go to Dashboard"
            >
              <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", background: "linear-gradient(135deg, #5a6400 0%, #48654d 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(90,100,0,0.3)" }}>
                <Dna size={18} color="#eafe45" strokeWidth={2.5} />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.0625rem", color: "var(--ink-dark)", letterSpacing: "-0.01em" }}>
                  AutismPredictor
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--ink-light)", fontWeight: 500, letterSpacing: "0.02em" }}>
                  Gene Expression Analysis
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.125rem" }}>
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => handleNav(link.id)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.875rem",
                      color: isActive ? "var(--olive)" : "var(--ink-mid)",
                      background: isActive ? "rgba(90, 100, 0, 0.09)" : "transparent",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "0.375rem 0.8125rem",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-dark)";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(25, 29, 17, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-mid)";
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.625rem" }}>
              {isAuthenticated && user ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(90,100,0,0.07)", borderRadius: "9999px", padding: "0.25rem 0.75rem 0.25rem 0.3125rem", border: "1px solid rgba(90,100,0,0.14)" }}>
                    <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.6875rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                      {userInitials}
                    </div>
                    <div style={{ lineHeight: 1.2 }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--olive)", fontFamily: "'Inter', sans-serif", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                      {roleBadge}
                    </div>
                  </div>
                  <button
                    id="header-logout-btn"
                    onClick={handleLogout}
                    style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "transparent", border: "1.5px solid rgba(186,26,26,0.25)", color: "var(--error)", borderRadius: "9999px", padding: "0.375rem 0.875rem", fontSize: "0.8125rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", transition: "all 200ms ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(186,26,26,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    title="Sign out"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button id="header-login-btn" onClick={() => handleNav("login")} style={{ background: "transparent", border: "1.5px solid var(--ink-dark)", color: "var(--ink-dark)", borderRadius: "9999px", padding: "0.4375rem 1.125rem", fontSize: "0.875rem", fontWeight: 600, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "all 200ms ease", display: "inline-flex", alignItems: "center", gap: "0.375rem" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(25,29,17,0.06)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                    <User size={14} /> Log In
                  </button>
                  <button id="header-signup-btn" onClick={() => handleNav("signup")} className="btn-lime" style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.375rem", borderRadius: "0.5rem", color: "var(--ink-dark)" }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down" style={{ position: "fixed", top: "3.75rem", left: 0, right: 0, zIndex: 49, background: "rgba(247,251,231,0.98)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(199,200,173,0.3)", padding: "1rem 1.5rem 1.5rem" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNav(link.id)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontFamily: "'Inter', sans-serif", fontWeight: isActive ? 600 : 500, fontSize: "0.9375rem", color: isActive ? "var(--olive)" : "var(--ink-dark)", background: isActive ? "rgba(90,100,0,0.08)" : "transparent", border: "none", cursor: "pointer" }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(199,200,173,0.3)", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {isAuthenticated && user ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0" }}>
                  <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.75rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>{userInitials}</div>
                  <div>
                    <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--ink-dark)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-light)" }}>{user.email}</div>
                  </div>
                </div>
                {roleBadge}
                <button id="mobile-logout-btn" onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.875rem", background: "rgba(186,26,26,0.08)", border: "1.5px solid rgba(186,26,26,0.2)", color: "var(--error)", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer" }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button id="mobile-login-btn" onClick={() => handleNav("login")} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.875rem", border: "1.5px solid var(--ink-dark)", background: "transparent", color: "var(--ink-dark)", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer" }}>Log In</button>
                <button id="mobile-signup-btn" onClick={() => handleNav("signup")} className="btn-lime" style={{ width: "100%", justifyContent: "center" }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;