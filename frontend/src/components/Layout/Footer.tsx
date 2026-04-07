/**
 * Footer Component
 * Application footer with links, copyright, and CRITICAL medical disclaimers
 */

import React from "react";
import { Heart, Mail, Github, AlertCircle, Lock, Scale } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* CRITICAL: Medical & Privacy Disclaimers */}
      <div className="bg-neutral-900 text-neutral-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Medical Disclaimer */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <h3 className="font-bold text-base">Medical Disclaimer</h3>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                This tool is a <strong>screening support tool only</strong> and is NOT a diagnostic instrument.
                Results must be reviewed by qualified healthcare providers. Autism diagnosis requires comprehensive
                professional evaluation.
              </p>
            </div>

            {/* Privacy & Data */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-green-400 flex-shrink-0" />
                <h3 className="font-bold text-base">Privacy Commitment</h3>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                We do <strong>NOT</strong> store your genetic data, do <strong>NOT</strong> collect personal identifiers,
                and do <strong>NOT</strong> share information with third parties. All data is processed securely
                using encryption.
              </p>
            </div>

            {/* Legal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Scale className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <h3 className="font-bold text-base">Terms & Liability</h3>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Users assume full responsibility for how results are used. We are not liable for diagnostic misuse
                or medical decisions based on this tool. See full terms for details.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-700 pt-8">
            {/* Disclaimer */}
            <div className="mt-8 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-2">⚠️ Clinical & Research Disclaimer</p>
                  <p className="text-xs leading-relaxed">
                    This tool is for research and educational purposes only. It is NOT a clinical diagnostic instrument.
                    It should not replace professional medical evaluation. Results must be interpreted by qualified healthcare providers
                    (developmental pediatrician, neurologist, psychologist) in the context of comprehensive clinical assessment.
                    Autism diagnosis requires behavioral observation, developmental history, and specialist evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Main content */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* About */}
            <div>
              <h3 className="font-bold text-neutral-900">About This Tool</h3>
              <p className="mt-3 text-sm text-neutral-600">
                An accessible, evidence-based prediction tool using artificial
                neural networks trained on gene expression data to support
                autism spectrum characterization.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-neutral-900">Resources</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/faq"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Learn More
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-bold text-neutral-900">Get In Touch</h3>
              <div className="mt-3 flex gap-4">
                <a
                  href="mailto:contact@autismpredictor.org"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  aria-label="Email us"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  aria-label="GitHub repository"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-neutral-200" />

          {/* Bottom bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              Made with <Heart size={16} className="text-accent-500" /> for
              neurodiversity awareness
            </p>
            <p className="text-sm text-neutral-500">
              © {currentYear} Autism Prediction Tool. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;