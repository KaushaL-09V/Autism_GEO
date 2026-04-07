/**
 * ConsentModal Component
 * CRITICAL: Medical disclaimer and consent for screening tool
 * Must be shown before users can make predictions
 */

// import React, { useEffect, useState } from 'react';
import React, {  useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
// import Button from '../Common/Button';
import { cn } from '../lib/cn.ts';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept }) => {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (checked) {
      localStorage.setItem('consent_accepted', new Date().toISOString());
      onAccept();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
              role="alertdialog"
              aria-labelledby="consent-title"
              aria-describedby="consent-description"
            >
              {/* Header with warning icon */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 sm:px-8 py-6 border-b border-neutral-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <AlertCircle className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h2
                      id="consent-title"
                      className="text-2xl font-bold text-neutral-900"
                    >
                      Medical Disclaimer
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Please read carefully before proceeding
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-8">
                <div
                  id="consent-description"
                  className="space-y-6 text-neutral-700"
                >
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="font-semibold text-blue-900 text-sm">
                      This tool is a <strong>SCREENING SUPPORT TOOL ONLY</strong>
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                      It is NOT a diagnostic instrument and should not be used as a substitute for professional medical evaluation.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">
                      What You Should Know:
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong>Results require verification:</strong> Any findings must be reviewed by a qualified healthcare provider (pediatrician, neurologist, developmental psychologist, or autism specialist)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong>Comprehensive evaluation needed:</strong> Autism Spectrum Disorder diagnosis requires clinical assessment including developmental history, behavioral observation, and multiple clinical evaluations
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong>Gene expression is one data point:</strong> Many factors influence genetic expression and neurodevelopment; this tool analyzes patterns but cannot capture the full clinical picture
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong>Not predictive of severity or support needs:</strong> ASD presentation varies widely; this tool does not assess functioning level or support requirements
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>
                          <strong>Your data privacy:</strong> We do not store your genetic data. All analysis occurs in your browser and on secure servers
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">
                      For Parents & Patients:
                    </h3>
                    <p className="text-sm">
                      If you have concerns about autism or neurodevelopmental differences, please consult with your healthcare provider.
                      Autism is a natural variation in neurodevelopment, not a disease or defect. Early identification and support
                      can be beneficial, but diagnosis should only be made by qualified professionals through comprehensive evaluation.
                    </p>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                      className={cn(
                        'mt-1 w-5 h-5 rounded accent-primary-600',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                        'checked:bg-primary-600 checked:border-primary-600'
                      )}
                      aria-required="true"
                    />
                    <span className="text-sm text-neutral-700">
                      I understand that this is a <strong>screening tool only</strong> and that any results
                      must be reviewed with a qualified healthcare provider before making any clinical decisions.
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-neutral-50 px-6 sm:px-8 py-6 border-t border-neutral-200 flex gap-4 sm:flex-row flex-col-reverse">
                <a
                  href="/"
                  className="flex-1 px-4 py-2.5 text-center border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                  }}
                >
                  Exit
                </a>
                <button
                  onClick={handleAccept}
                  disabled={!checked}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                    checked
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  )}
                  aria-label="Accept disclaimer and continue to tool"
                >
                  <CheckCircle size={18} />
                  I Accept & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
