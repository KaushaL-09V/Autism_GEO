/**
 * Header Component — Stitch Design
 * Glassmorphism nav bar with lime CTA, olive branding
 * Includes auth state: shows user avatar + logout when signed in
 */

import React, { useState, useEffect } from "react";
import { Menu, X, Dna, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const NAV_LINKS = [
  { id: "home",    label: "Home" },
  { id: "upload",  label: "Upload" },
  { id: "results", label: "Results" },
  { id: "faq",     label: "FAQ" },
  { id: "support", label: "Resources" },
  { id: "about",   label: "About" },
];

const Header: React.FC<HeaderProps> = ({ currentPage = "home", onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    onNavigate?.("login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 11,
          zIndex: 50,
          background: scrolled
            ? "rgba(247, 251, 231, 0.85)"
            : "rgba(247, 251, 231, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(199, 200, 173, 0.3)"
            : "1px solid transparent",
          transition: "all 300ms ease",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.5rem",
            }}
          >
            {/* Logo */}
            <button
              id="header-logo-btn"
              onClick={() => handleNav("home")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Go to Home"
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.625rem",
                  background: "linear-gradient(135deg, #5a6400 0%, #48654d 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Dna size={18} color="#eafe45" strokeWidth={2.5} />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.0625rem",
                    color: "var(--ink-dark)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  AutismPredictor
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--ink-light)",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  Gene Expression Analysis
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.25rem" }}>
              {NAV_LINKS.map((link) => {
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
                      background: isActive ? "rgba(90, 100, 0, 0.08)" : "transparent",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "0.375rem 0.875rem",
                      cursor: "pointer",
                      transition: "all 200ms ease",
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
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
              {isAuthenticated && user ? (
                <>
                  {/* User avatar pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(90,100,0,0.08)",
                      borderRadius: "9999px",
                      padding: "0.3125rem 0.75rem 0.3125rem 0.375rem",
                      border: "1px solid rgba(90,100,0,0.15)",
                    }}
                  >
                    <div
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--lime)",
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        fontFamily: "'Manrope', sans-serif",
                        flexShrink: 0,
                      }}
                    >
                      {userInitials}
                    </div>
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--olive)",
                        fontFamily: "'Inter', sans-serif",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name}
                    </span>
                  </div>
                  {/* Logout */}
                  <button
                    id="header-logout-btn"
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      background: "transparent",
                      border: "1.5px solid rgba(186,26,26,0.25)",
                      color: "var(--error)",
                      borderRadius: "9999px",
                      padding: "0.375rem 0.875rem",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(186,26,26,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                    title="Sign out"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="header-login-btn"
                    onClick={() => handleNav("login")}
                    style={{
                      background: "transparent",
                      border: "1.5px solid var(--ink-dark)",
                      color: "var(--ink-dark)",
                      borderRadius: "9999px",
                      padding: "0.4375rem 1.125rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      fontFamily: "'Manrope', sans-serif",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(25,29,17,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <User size={14} />
                    Log In
                  </button>
                  <button
                    id="header-signup-btn"
                    onClick={() => handleNav("signup")}
                    className="btn-lime"
                    style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.375rem",
                borderRadius: "0.5rem",
                color: "var(--ink-dark)",
                transition: "background 200ms",
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden animate-slide-down"
          style={{
            position: "fixed",
            top: "4rem",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "rgba(247, 251, 231, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(199, 200, 173, 0.3)",
            padding: "1rem 1.5rem 1.5rem",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNav(link.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9375rem",
                    color: isActive ? "var(--olive)" : "var(--ink-dark)",
                    background: isActive ? "rgba(90, 100, 0, 0.08)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 200ms",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(199, 200, 173, 0.3)", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {isAuthenticated && user ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0" }}>
                  <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "linear-gradient(135deg, var(--olive) 0%, var(--forest) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lime)", fontSize: "0.75rem", fontWeight: 800, fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
                    {userInitials}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--ink-dark)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-light)" }}>{user.email}</div>
                  </div>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={handleLogout}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.875rem", background: "rgba(186,26,26,0.08)", border: "1.5px solid rgba(186,26,26,0.2)", color: "var(--error)", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer" }}
                >
                  <LogOut size={16} />
                  Sign Out
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