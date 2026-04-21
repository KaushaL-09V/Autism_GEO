/**
 * Root App Component – Dual-Role Routing
 * Handles all page navigation, auth state, and medical consent.
 * Supports Patient and Doctor role-based dashboards.
 */

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

// ── Shared pages ────────────────────────────────────────────────
import HomePage      from "./components/Pages/HomePage";
import AboutPage     from "./components/Pages/AboutPage";
import FAQPage       from "./components/Pages/FAQPage";
import SupportPage   from "./components/Pages/SupportPage";
import LoginPage     from "./components/Pages/LoginPage";
import SignUpPage    from "./components/Pages/SignUpPage";
import ConsentModal  from "./components/ConsentModal";
import PageWrapper   from "./components/AnimatedComponents/PageWrapper";

// ── Legacy analysis pages (preserved) ───────────────────────────
import UploadPage        from "./components/Pages/UploadPage";
import ResultsPage       from "./components/Pages/ResultsPage";
import QuestionnairePage from "./components/Pages/QuestionnairePage";
import { usePredictor }  from "./hooks/usePredictor";

// ── Patient pages ────────────────────────────────────────────────
import PatientDashboard    from "./components/Pages/Patient/PatientDashboard";
import PatientResultsPage  from "./components/Pages/Patient/PatientResultsPage";
import AssessmentPage      from "./components/Pages/Patient/AssessmentPage";
import BookAppointmentPage from "./components/Pages/Patient/BookAppointmentPage";

// ── Doctor pages ─────────────────────────────────────────────────
import DoctorDashboard   from "./components/Pages/Doctor/Dashboard";
import DoctorPatients    from "./components/Pages/Doctor/Patients";
import DoctorPatientDetail from "./components/Pages/Doctor/PatientDetail";
import DoctorAnalytics   from "./components/Pages/Doctor/Analytics";
import DoctorUpload      from "./components/Pages/Doctor/Upload";

// ══════════════════════════════════════════════════════════════════
export type PageType =
  | "home" | "upload" | "questionnaire" | "results"
  | "about" | "faq" | "support" | "contact"
  | "login" | "signup"
  // Patient
  | "patient-dashboard" | "patient-results"
  | "patient-assessment" | "patient-book-appointment"
  // Doctor
  | "doctor-dashboard" | "doctor-patients"
  | "doctor-patient-detail" | "doctor-analysis" | "doctor-upload";

const AUTH_PAGES: PageType[]    = ["login", "signup"];
const PATIENT_PAGES: PageType[] = ["patient-dashboard","patient-results","patient-assessment","patient-book-appointment"];
const DOCTOR_PAGES: PageType[]  = ["doctor-dashboard","doctor-patients","doctor-patient-detail","doctor-analysis","doctor-upload"];
const PROTECTED_PAGES: PageType[] = [...PATIENT_PAGES, ...DOCTOR_PAGES, "upload","questionnaire","results"];

/* ─── Inner component with access to AuthContext ─────────── */
const AppInner: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const stored = localStorage.getItem("autism_predictor_user");
    if (!stored) return "login";
    const u = JSON.parse(stored);
    return u.role === "doctor" ? "doctor-dashboard" : "patient-dashboard";
  });

  // State passed between doctor pages
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p001");

  const [showConsent, setShowConsent] = useState(() => {
    return !localStorage.getItem("consent_accepted");
  });

  const { prediction, geneData, reset, predict, error, uploadStatus } = usePredictor();

  const handleNavigate = (page: string, extra?: Record<string, string>) => {
    const target = page as PageType;

    if (PROTECTED_PAGES.includes(target) && !isAuthenticated) {
      setCurrentPage("login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Role-based guard
    if (DOCTOR_PAGES.includes(target) && user?.role !== "doctor") {
      setCurrentPage(user ? "patient-dashboard" : "login");
      return;
    }
    if (PATIENT_PAGES.includes(target) && user?.role !== "patient") {
      setCurrentPage(user ? "doctor-dashboard" : "login");
      return;
    }

    // Carry extra state (e.g. patient id for detail page)
    if (extra?.patientId) setSelectedPatientId(extra.patientId);

    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadNew = () => { reset(); setCurrentPage("upload"); };

  const isAuthPage      = AUTH_PAGES.includes(currentPage);
  const isDashboardPage = PATIENT_PAGES.includes(currentPage) || DOCTOR_PAGES.includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Medical consent modal */}
      <ConsentModal isOpen={showConsent} onAccept={() => setShowConsent(false)} />

      {/* Header — hidden on auth + dashboard pages (dashboards have own nav) */}
      {!isAuthPage && !isDashboardPage && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Role-aware dashboard header */}
      {isDashboardPage && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} isDashboard />
      )}

      <main id="main-content" className="flex-1" style={{ background: "var(--surface)" }}>
        <AnimatePresence mode="wait">

          {/* ── Auth ── */}
          {currentPage === "login"  && <LoginPage  key="login"  onNavigate={handleNavigate} />}
          {currentPage === "signup" && <SignUpPage  key="signup" onNavigate={handleNavigate} />}

          {/* ── Public pages ── */}
          {currentPage === "home" && (
            <PageWrapper key="home"><HomePage onNavigate={handleNavigate} /></PageWrapper>
          )}
          {currentPage === "about" && (
            <PageWrapper key="about"><AboutPage /></PageWrapper>
          )}
          {currentPage === "faq" && (
            <PageWrapper key="faq"><FAQPage /></PageWrapper>
          )}
          {currentPage === "support" && (
            <PageWrapper key="support"><SupportPage onNavigate={handleNavigate} /></PageWrapper>
          )}
          {currentPage === "contact" && (
            <PageWrapper key="contact">
              <div style={{ minHeight:"100vh", background:"var(--surface)", padding:"5rem 1.5rem", display:"flex", alignItems:"flex-start", justifyContent:"center" }}>
                <div style={{ maxWidth:"560px", textAlign:"center" }}>
                  <h1 style={{ fontFamily:"'Manrope', sans-serif", fontSize:"2.5rem", fontWeight:800, color:"var(--ink-dark)", letterSpacing:"-0.02em", marginBottom:"1rem" }}>Contact Us</h1>
                  <p style={{ fontSize:"1rem", color:"var(--ink-mid)", marginBottom:"0.5rem" }}>Email: <a href="mailto:kaushalvadher09@gmail.com" style={{ color:"var(--olive)", fontWeight:600 }}>kaushalvadher09@gmail.com</a></p>
                  <p style={{ color:"var(--ink-light)", fontSize:"0.9375rem" }}>We'll respond to your inquiry as soon as possible.</p>
                </div>
              </div>
            </PageWrapper>
          )}

          {/* ── Legacy pages (preserved) ── */}
          {currentPage === "upload" && (
            <PageWrapper key="upload">
              <UploadPage onPredictionComplete={() => setCurrentPage("results")} predict={predict} error={error} uploadStatus={uploadStatus} geneData={geneData} />
            </PageWrapper>
          )}
          {currentPage === "questionnaire" && (
            <PageWrapper key="questionnaire"><QuestionnairePage onNavigate={handleNavigate} /></PageWrapper>
          )}
          {currentPage === "results" && (
            <PageWrapper key="results"><ResultsPage prediction={prediction} geneData={geneData} onUploadNew={handleUploadNew} /></PageWrapper>
          )}

          {/* ══ PATIENT PAGES ══ */}
          {currentPage === "patient-dashboard" && (
            <PatientDashboard key="patient-dashboard" onNavigate={handleNavigate} />
          )}
          {currentPage === "patient-assessment" && (
            <AssessmentPage key="patient-assessment" onNavigate={handleNavigate} />
          )}
          {currentPage === "patient-results" && (
            <PatientResultsPage key="patient-results" onNavigate={handleNavigate} />
          )}
          {currentPage === "patient-book-appointment" && (
            <BookAppointmentPage key="patient-book-appointment" onNavigate={handleNavigate} />
          )}

          {/* ══ DOCTOR PAGES ══ */}
          {currentPage === "doctor-dashboard" && (
            <DoctorDashboard key="doctor-dashboard" onNavigate={handleNavigate} />
          )}
          {currentPage === "doctor-patients" && (
            <DoctorPatients key="doctor-patients" onNavigate={handleNavigate} selectedPatientId={selectedPatientId} setSelectedPatientId={setSelectedPatientId} />
          )}
          {currentPage === "doctor-patient-detail" && (
            <DoctorPatientDetail key="doctor-patient-detail" onNavigate={handleNavigate} patientId={selectedPatientId} />
          )}
          {currentPage === "doctor-analysis" && (
            <DoctorAnalytics key="doctor-analysis" onNavigate={handleNavigate} patientId={selectedPatientId} />
          )}
          {currentPage === "doctor-upload" && (
          <DoctorUpload key="doctor-upload" onNavigate={handleNavigate} patientId={selectedPatientId} />
          )}

        </AnimatePresence>
      </main>

      {/* Footer — hidden on auth + dashboard pages */}
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;