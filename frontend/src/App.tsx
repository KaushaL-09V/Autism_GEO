/**
 * Root App Component
 * Handles page routing and state management
 * CRITICAL: Includes medical consent modal
 */

// import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./components/Pages/HomePage";
import UploadPage from "./components/Pages/UploadPage";
import ResultsPage from "./components/Pages/ResultsPage";
import AboutPage from "./components/Pages/AboutPage";
import FAQPage from "./components/Pages/FAQPage";
import ConsentModal from "./components/ConsentModal";
import { usePredictor } from "./hooks/usePredictor";
// import { GeneExpression } from "./types";

type PageType = "home" | "upload" | "results" | "about" | "faq" | "contact";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showConsent, setShowConsent] = useState(() => {
    // Only show if user hasn't accepted yet
    return !localStorage.getItem("consent_accepted");
  });
  const { prediction, geneData, reset, predict, error, uploadStatus } = usePredictor();

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadNew = () => {
    reset();
    setCurrentPage("upload");
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* CONSENT MODAL - CRITICAL FOR MEDICAL COMPLIANCE */}
      <ConsentModal
        isOpen={showConsent}
        onAccept={() => setShowConsent(false)}
      />

      {/* Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
        {currentPage === "upload" && (
          <UploadPage
            onPredictionComplete={() => setCurrentPage("results")}
            predict={predict}
            error={error}
            uploadStatus={uploadStatus}
            geneData={geneData}
          />
        )}
        {currentPage === "results" && (
          <ResultsPage
            prediction={prediction}
            geneData={geneData}
            onUploadNew={handleUploadNew}
          />
        )}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "faq" && <FAQPage />}
        {currentPage === "contact" && (
          <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                Email: contact@autismpredictor.org
              </p>
              <p className="text-neutral-600">
                We'll respond to your inquiry as soon as possible.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;