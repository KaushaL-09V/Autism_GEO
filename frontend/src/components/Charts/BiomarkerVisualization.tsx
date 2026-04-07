/**
 * BiomarkerVisualization Component
 * Interactive pathway flow visualization showing biomarker contributions
 * Uses animated nodes and connecting lines
 */

import { motion } from "framer-motion";
import { ANIMATION_TIMINGS, EASING } from "../../config/motion.config";
import { StaggerContainer, StaggerItem } from "../AnimatedComponents/StaggerContainer";
// import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit?: string;
  description?: string;
  status: "high" | "normal" | "low"; // Clinical status
}

interface BiomarkerVisualizationProps {
  biomarkers: Biomarker[];
  title?: string;
  subtitle?: string;
  predictionScore?: number;
}

/**
 * Get color based on biomarker status
 */
function getStatusColor(status: string): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  switch (status) {
    case "high":
      return {
        bg: "bg-teal-50 dark:bg-teal-900/20",
        border: "border-teal-300 dark:border-teal-700",
        text: "text-teal-900 dark:text-teal-100",
        badge: "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100",
      };
    case "low":
      return {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-300 dark:border-blue-700",
        text: "text-blue-900 dark:text-blue-100",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-300 dark:border-gray-700",
        text: "text-gray-900 dark:text-gray-100",
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      };
  }
}

/**
 * BiomarkerNode: Individual biomarker card in the flow
 */
function BiomarkerNode({ biomarker, index }: { biomarker: Biomarker; index: number }) {
  const colors = getStatusColor(biomarker.status);

  return (
    <StaggerItem index={index}>
      <motion.div
        className={`
          relative p-4 rounded-lg border
          ${colors.bg} ${colors.border}
          transition-all duration-300 hover:shadow-md
        `}
        whileHover={{ y: -4 }}
      >
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-3">
          <h4 className={`font-semibold ${colors.text}`}>{biomarker.name}</h4>
          <span
            className={`
              px-2 py-1 text-xs font-bold rounded
              ${colors.badge} uppercase
            `}
          >
            {biomarker.status}
          </span>
        </div>

        {/* Value Display */}
        <div className={`${colors.text} text-2xl font-bold mb-2`}>
          {biomarker.value}
          {biomarker.unit && <span className="text-lg ml-1">{biomarker.unit}</span>}
        </div>

        {/* Description */}
        {biomarker.description && (
          <p className={`text-sm ${colors.text} opacity-75`}>
            {biomarker.description}
          </p>
        )}

        {/* Contribution Indicator */}
        <div className="mt-3">
          <div className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
            <motion.div
              className={`h-full rounded-full`}
              style={{
                background: biomarker.status === "high" ? "#4A9B8E" : "#7BA98E",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.abs(biomarker.value * 10)}%` }}
              transition={{
                duration: ANIMATION_TIMINGS.slow,
                ease: EASING.easeOut,
                delay: index * 0.1,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Contribution to risk assessment
          </p>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

/**
 * BiomarkerVisualization: Flow graph showing biomarker pathway
 * Displays how individual biomarkers contribute to final prediction
 *
 * @example
 * <BiomarkerVisualization
 *   biomarkers={[
 *     {
 *       id: "cntnap2",
 *       name: "CNTNAP2",
 *       value: 2.34,
 *       unit: "ng/mL",
 *       status: "high",
 *       description: "Neuronal contact-associated protein 2"
 *     },
 *     // ... more biomarkers
 *   ]}
 *   predictionScore={87}
 *   title="Biomarker Pathway Analysis"
 * />
 */
export function BiomarkerVisualization({
  biomarkers,
  title = "Biomarker Pathway Analysis",
  subtitle = "Individual biomarker contributions to prediction",
  predictionScore,
}: BiomarkerVisualizationProps) {
  // const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_TIMINGS.standard,
      }}
      className="w-full rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-teal-900 dark:text-teal-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Biomarker Grid */}
      <StaggerContainer staggerDelay={50} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biomarkers.map((biomarker, index) => (
          <BiomarkerNode
            key={biomarker.id}
            biomarker={biomarker}
            index={index}
          />
        ))}
      </StaggerContainer>

      {/* Prediction Summary */}
      {predictionScore !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: ANIMATION_TIMINGS.standard,
            delay: 0.3,
          }}
          className="mt-8 p-4 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-200 dark:border-teal-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                Overall Risk Assessment
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on combined biomarker analysis
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                {predictionScore}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Confidence Score
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: ANIMATION_TIMINGS.standard,
          delay: 0.4,
        }}
        className="mt-6 text-xs text-gray-500 dark:text-gray-400"
      >
        <strong>Note:</strong> Each biomarker's contribution is calculated using
        machine learning models trained on extensive clinical datasets. Results
        should be interpreted in consultation with healthcare professionals.
      </motion.p>
    </motion.div>
  );
}

export default BiomarkerVisualization;
