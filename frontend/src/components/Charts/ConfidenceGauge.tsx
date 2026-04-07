/**
 * ConfidenceGauge Component
 * Radial gauge chart for displaying prediction confidence/probability
 * Animated arc with color coding based on confidence level
 */

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ANIMATION_TIMINGS } from "../../config/motion.config";
import { AnimatedCounter } from "../AnimatedComponents/AnimatedCounter";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ConfidenceGaugeProps {
  confidence: number; // 0-100
  label?: string;
  subtitle?: string;
  size?: number;
  showLabel?: boolean;
  interpretation?: string;
}

/**
 * Get color based on confidence level
 * Clinical interpretation:
 * - Low (0-33): Muted gray (low confidence)
 * - Medium (33-66): Sage green (moderate confidence)
 * - High (66-100): Teal (high confidence)
 */
function getConfidenceColor(confidence: number): {
  primary: string;
  secondary: string;
  bg: string;
} {
  if (confidence < 33) {
    return {
      primary: "#A0AEC0", // Gray
      secondary: "#CBD5E0",
      bg: "#F7FAFC",
    };
  }
  if (confidence < 66) {
    return {
      primary: "#7BA98E", // Sage green
      secondary: "#A0C8B8",
      bg: "#F0F8F6",
    };
  }
  return {
    primary: "#4A9B8E", // Teal
    secondary: "#7DBDB3",
    bg: "#F0F8F7",
  };
}

/**
 * Get confidence interpretation text
 */
function getInterpretation(confidence: number): string {
  if (confidence < 33) return "Low Confidence";
  if (confidence < 50) return "Moderate-Low Confidence";
  if (confidence < 66) return "Moderate Confidence";
  if (confidence < 80) return "Good Confidence";
  return "High Confidence";
}

/**
 * ConfidenceGauge: Radial gauge for prediction confidence
 * Displays probability as an arc with animated entry
 *
 * @example
 * <ConfidenceGauge
 *   confidence={87}
 *   label="Prediction Confidence"
 *   subtitle="Based on gene expression analysis"
 * />
 */
export function ConfidenceGauge({
  confidence,
  label = "Prediction Confidence",
  subtitle,
  size = 250,
  showLabel = true,
  interpretation,
}: ConfidenceGaugeProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = getConfidenceColor(confidence);
  const displayInterpretation = interpretation || getInterpretation(confidence);

  // Clamp confidence between 0 and 100
  const clampedConfidence = Math.max(0, Math.min(100, confidence));

  // Data for pie chart (confidence vs remaining)
  const data = [
    { name: "Confidence", value: clampedConfidence },
    { name: "Remaining", value: 100 - clampedConfidence },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: ANIMATION_TIMINGS.standard,
      }}
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      style={{ backgroundColor: colors.bg }}
    >
      {label && showLabel && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-teal-900 dark:text-teal-50">
            {label}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Gauge Chart */}
      <div style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.35}
              outerRadius={size * 0.45}
              paddingAngle={2}
              dataKey="value"
              animationDuration={prefersReducedMotion ? 0 : 1000}
              isAnimationActive={!prefersReducedMotion}
            >
              <Cell fill={colors.primary} />
              <Cell fill={colors.secondary} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Percentage Display */}
      <div className="mt-6 text-center">
        <div className="text-5xl font-bold" style={{ color: colors.primary }}>
          <AnimatedCounter
            value={clampedConfidence}
            duration={1}
            suffix="%"
            decimals={1}
          />
        </div>
        <p
          className="text-sm font-medium mt-2"
          style={{ color: colors.primary }}
        >
          {displayInterpretation}
        </p>
      </div>

      {/* Additional Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: ANIMATION_TIMINGS.standard,
          delay: 0.2,
        }}
        className="mt-6 text-xs text-gray-600 dark:text-gray-400 max-w-xs text-center"
      >
        <p>
          This gauge represents the model's confidence in the prediction based
          on the provided biomarker data.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default ConfidenceGauge;
