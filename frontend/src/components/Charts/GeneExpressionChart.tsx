/**
 * GeneExpressionChart Component
 * Recharts bar chart for displaying gene expression levels
 * Animated bars with healthcare aesthetic
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { ANIMATION_TIMINGS } from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface GeneData {
  gene: string;
  value: number;
  [key: string]: any;
}

interface GeneExpressionChartProps {
  data: GeneData[];
  title?: string;
  subtitle?: string;
  colorScheme?: "teal" | "blue" | "sage";
  height?: number;
  showLegend?: boolean;
  isAnimated?: boolean;
}

// Healthcare color palette
const COLOR_SCHEMES = {
  teal: "#4A9B8E", // Primary teal
  blue: "#5B8DBE", // Calm blue
  sage: "#7BA98E", // Sage green
  secondary: "#E8E8E5", // Light gray
};

/**
 * Custom tooltip for better UX
 */
function CustomTooltip(props: any) {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-teal-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-teal-900">{data.gene}</p>
        <p className="text-sm text-blue-700">
          Expression: <span className="font-bold">{data.value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
}

/**
 * GeneExpressionChart: Bar chart for gene expression visualization
 * Displays biomarker data with smooth animations
 *
 * @example
 * <GeneExpressionChart
 *   data={[
 *     { gene: "CNTNAP2", value: 2.34 },
 *     { gene: "RELN", value: 1.89 },
 *     { gene: "FOXP2", value: 3.12 }
 *   ]}
 *   title="Gene Expression Profile"
 *   colorScheme="teal"
 * />
 */
export function GeneExpressionChart({
  data,
  title = "Gene Expression Profile",
  subtitle,
  colorScheme = "teal",
  height = 400,
  showLegend = true,
  isAnimated = true,
}: GeneExpressionChartProps) {
  const prefersReducedMotion = useReducedMotion();
  const barColor = COLOR_SCHEMES[colorScheme];

  // Determine animation settings
  const animationDuration = prefersReducedMotion ? 0 : 1000;
  const isBeingAnimated = isAnimated && !prefersReducedMotion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_TIMINGS.standard,
      }}
      className="w-full rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
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

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <defs>
            {/* Gradient for bars */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={0.9} />
              <stop offset="100%" stopColor={barColor} stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(74, 155, 142, 0.1)"
            vertical={false}
          />

          <XAxis
            dataKey="gene"
            tick={{ fill: "#666", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />

          <YAxis
            tick={{ fill: "#666", fontSize: 12 }}
            label={{ value: "Expression Level", angle: -90, position: "insideLeft" }}
          />

          <Tooltip content={<CustomTooltip />} />

          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="square"
            />
          )}

          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={animationDuration}
            isAnimationActive={isBeingAnimated}
            animationEasing="ease-out"
            name="Gene Expression"
          >
            {/* Optional: Add custom colors per item */}
            {/* {data.map((entry, index) => ( */}
            {data.map(( _, index) => (
              <Cell key={`cell-${index}`} fill="url(#barGradient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Note: Values represent normalized gene expression levels. Higher values
          indicate increased expression relative to baseline.
        </p>
      </div>
    </motion.div>
  );
}

export default GeneExpressionChart;
