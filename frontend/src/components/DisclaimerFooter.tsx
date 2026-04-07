/**
 * Disclaimer Footer Component
 * CRITICAL: Medical liability and data privacy notices
 */

import React from 'react';
import { AlertCircle, Lock, Scale } from 'lucide-react';
import { cn } from '../lib/cn.ts';

interface DisclaimerFooterProps {
  className?: string;
}

export const DisclaimerFooter: React.FC<DisclaimerFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'bg-gradient-to-r from-neutral-900 to-neutral-800 text-neutral-100 py-12',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              or medical decisions based on this tool. See full terms and privacy policy for details.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-700 pt-8 mb-8">
          <div className="grid md:grid-cols-4 gap-6 text-xs text-neutral-400">
            <div>
              <p className="font-semibold text-neutral-300 mb-2">Resources</p>
              <ul className="space-y-1">
                <li>
                  <a href="#faq" className="hover:text-neutral-200 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-neutral-200 transition">
                    About Autism
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Gene Science
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-neutral-300 mb-2">Legal</p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-neutral-300 mb-2">Clinical Info</p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Find a Specialist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Diagnostic Criteria
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Support Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-neutral-300 mb-2">Contact</p>
              <ul className="space-y-1">
                <li>
                  <a href="mailto:contact@autismpredictor.org" className="hover:text-neutral-200 transition">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Report Issue
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-200 transition">
                    Feedback Form
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="border-t border-neutral-700 pt-6 text-center text-xs text-neutral-500">
          <p className="mb-2">
            © 2026 Autism Predictor. All rights reserved. |
            <span className="mx-1">
              <a href="#" className="hover:text-neutral-300 transition">
                Privacy Policy
              </a>
            </span>
            |
            <span className="mx-1">
              <a href="#" className="hover:text-neutral-300 transition">
                Terms
              </a>
            </span>
          </p>
          <p className="text-neutral-600">
            <strong>Research Tool Disclaimer:</strong> This is a research and educational tool.
            It should not replace professional medical evaluation, diagnosis, or treatment.
            Always consult qualified healthcare providers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DisclaimerFooter;
