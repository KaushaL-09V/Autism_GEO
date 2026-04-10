/**
 * Root App Component
 * Handles page routing, auth state, and session management.
 * CRITICAL: Includes medical consent modal.
 */

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./components/Pages/HomePage";
import UploadPage from "./components/Pages/UploadPage";
import ResultsPage from "./components/Pages/ResultsPage";
import AboutPage from "./components/Pages/AboutPage";
import FAQPage from "./components/Pages/FAQPage";
import SupportPage from "./components/Pages/SupportPage";
import LoginPage from "./components/Pages/LoginPage";
import SignUpPage from "./components/Pages/SignUpPage";
import ConsentModal from "./components/ConsentModal";
import PageWrapper from "./components/AnimatedComponents/PageWrapper";
import { usePredictor } from "./hooks/usePredictor";

type PageType =
  | "home"
  | "upload"
  | "results"
  | "about"
  | "faq"
  | "support"
  | "contact"
  | "login"
  | "signup";

/* ─── Auth pages don't render the shared Header / Footer ──── */
const AUTH_PAGES: PageType[] = ["login", "signup"];

/* ─── Pages that require login to access ─────────────────── */
const PROTECTED_PAGES: PageType[] = ["upload", "results"];

/* ═══════════════════════════════════════════════════════════ */
const AppInner: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    // If user already has a session, land on home; otherwise go to login
    const stored = localStorage.getItem("autism_predictor_user");
    return stored ? "home" : "login";
  });

  const [showConsent, setShowConsent] = useState(() => {
    return !localStorage.getItem("consent_accepted");
  });

  const { prediction, geneData, reset, predict, error, uploadStatus } =
    usePredictor();

  const handleNavigate = (page: string) => {
    const target = page as PageType;

    // Redirect unauthenticated users away from protected pages
    if (PROTECTED_PAGES.includes(target) && !isAuthenticated) {
      setCurrentPage("login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadNew = () => {
    reset();
    setCurrentPage("upload");
  };

  const isAuthPage = AUTH_PAGES.includes(currentPage);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "var(--surface)" }}
    >
      {/* CONSENT MODAL — CRITICAL FOR MEDICAL COMPLIANCE */}
      <ConsentModal
        isOpen={showConsent}
        onAccept={() => setShowConsent(false)}
      />

      {/* Header — hidden on auth pages */}
      {!isAuthPage && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1"
        style={{ background: "var(--surface)" }}
      >
        <AnimatePresence mode="wait">
          {/* ── Auth pages ── */}
          {currentPage === "login" && (
            <LoginPage key="login" onNavigate={handleNavigate} />
          )}

          {currentPage === "signup" && (
            <SignUpPage key="signup" onNavigate={handleNavigate} />
          )}

          {/* ── App pages ── */}
          {currentPage === "home" && (
            <PageWrapper key="home">
              <HomePage onNavigate={handleNavigate} />
            </PageWrapper>
          )}

          {currentPage === "upload" && (
            <PageWrapper key="upload">
              <UploadPage
                onPredictionComplete={() => setCurrentPage("results")}
                predict={predict}
                error={error}
                uploadStatus={uploadStatus}
                geneData={geneData}
              />
            </PageWrapper>
          )}

          {currentPage === "results" && (
            <PageWrapper key="results">
              <ResultsPage
                prediction={prediction}
                geneData={geneData}
                onUploadNew={handleUploadNew}
              />
            </PageWrapper>
          )}

          {currentPage === "about" && (
            <PageWrapper key="about">
              <AboutPage />
            </PageWrapper>
          )}

          {currentPage === "faq" && (
            <PageWrapper key="faq">
              <FAQPage />
            </PageWrapper>
          )}

          {currentPage === "support" && (
            <PageWrapper key="support">
              <SupportPage onNavigate={handleNavigate} />
            </PageWrapper>
          )}

          {currentPage === "contact" && (
            <PageWrapper key="contact">
              <div
                style={{
                  minHeight: "100vh",
                  background: "var(--surface)",
                  padding: "5rem 1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <div style={{ maxWidth: "560px", textAlign: "center" }}>
                  <h1
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: "var(--ink-dark)",
                      letterSpacing: "-0.02em",
                      marginBottom: "1rem",
                    }}
                  >
                    Contact Us
                  </h1>
                  <p
                    style={{
                      fontSize: "1.0625rem",
                      color: "var(--ink-mid)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email:{" "}
                    <a
                      href="mailto:kaushalvadher09@gmail.com"
                      style={{ color: "var(--olive)", fontWeight: 600 }}
                    >
                      kaushalvadher09@gmail.com
                    </a>
                  </p>
                  <p
                    style={{
                      color: "var(--ink-light)",
                      fontSize: "0.9375rem",
                    }}
                  >
                    We'll respond to your inquiry as soon as possible.
                  </p>
                </div>
              </div>
            </PageWrapper>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — hidden on auth pages */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

/* ─── Wrap everything in AuthProvider ────────────────────── */
const App: React.FC = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;