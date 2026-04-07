# Motion Integration Guide

## Framer Motion Animation System for Healthcare UI

This guide explains how to integrate and use the animation components and configuration throughout your React application.

---

## 📁 Project Structure

```
frontend/src/
├── config/
│   └── motion.config.ts          # Global animation presets
├── hooks/
│   └── useReducedMotion.ts        # Accessibility hook
├── components/
│   ├── AnimatedComponents/        # Reusable animation wrappers
│   │   ├── PageWrapper.tsx        # Page transitions
│   │   ├── StaggerContainer.tsx   # List reveals
│   │   ├── BreathingCard.tsx      # Result cards
│   │   ├── AnimatedHero.tsx       # Hero sections
│   │   ├── AnimatedCounter.tsx    # Number animations
│   │   ├── GlassmorphismCard.tsx  # Premium cards
│   │   └── index.ts
│   ├── Charts/                    # Data visualization
│   │   ├── GeneExpressionChart.tsx
│   │   ├── ConfidenceGauge.tsx
│   │   ├── BiomarkerVisualization.tsx
│   │   └── index.ts
├── styles/
│   └── animations.css             # Animation utilities
└── ...
```

---

## 🎬 Quick Start: Import and Use

### 1. Import Global Styles

Add to your `main.tsx` or `App.tsx`:

```tsx
import "../styles/animations.css";
```

### 2. Import Components

```tsx
// Animated components
import {
  PageWrapper,
  StaggerContainer,
  StaggerItem,
  BreathingCard,
  AnimatedHero,
  AnimatedCounter,
  GlassmorphismCard,
} from "../components/AnimatedComponents";

// Charts
import {
  GeneExpressionChart,
  ConfidenceGauge,
  BiomarkerVisualization,
} from "../components/Charts";

// Accessibility hook
import { useReducedMotion } from "../hooks/useReducedMotion";
```

---

## 🎨 Component Usage Examples

### PageWrapper: Page Transitions

Wrap entire pages for consistent enter/exit animations.

```tsx
import { PageWrapper } from "../components/AnimatedComponents";

export function ResultsPage() {
  return (
    <PageWrapper className="container mx-auto">
      <h1>Results</h1>
      <p>Your prediction results...</p>
    </PageWrapper>
  );
}
```

**Props:**

- `children`: ReactNode - Page content
- `className?: string` - Additional CSS classes
- `delay?: number` - Delay in seconds before animation starts

---

### StaggerContainer & StaggerItem: List Reveals

Display lists with staggered entrance animations.

```tsx
import {
  StaggerContainer,
  StaggerItem,
} from "../components/AnimatedComponents";

export function FAQSection() {
  const faqs = [
    { id: 1, question: "What is...", answer: "..." },
    { id: 2, question: "How does...", answer: "..." },
  ];

  return (
    <StaggerContainer staggerDelay={50}>
      {faqs.map((faq) => (
        <StaggerItem key={faq.id}>
          <Card title={faq.question}>
            <p>{faq.answer}</p>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

**Props (StaggerContainer):**

- `children`: ReactNode
- `className?: string`
- `staggerDelay?: number` - Delay between items in ms (default: 50)
- `initialDelay?: number` - Delay before animation starts

---

### BreathingCard: Result Cards

Gentle pulsing animation for result cards.

```tsx
import { BreathingCard } from "../components/AnimatedComponents";

export function PredictionResult({ prediction }) {
  return (
    <BreathingCard isActive={true} className="p-6 rounded-lg bg-white">
      <h2 className="text-xl font-bold">Prediction Result</h2>
      <p>Confidence: {prediction.confidence}%</p>
    </BreathingCard>
  );
}
```

**Props:**

- `children`: ReactNode
- `className?: string`
- `isActive?: boolean` - Enable/disable breathing animation (default: true)
- `delay?: number` - Delay before animation starts

---

### AnimatedHero: Hero Sections

Staggered entrance for hero titles, subtitles, and CTAs.

```tsx
import { AnimatedHero } from "../components/AnimatedComponents";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <AnimatedHero
      title="Autism Screening Tool"
      subtitle="Powered by genetic biomarkers and machine learning"
      cta={{
        label: "Get Started",
        onClick: () => navigate("/upload"),
      }}
      className="py-20 text-center"
    />
  );
}
```

**Props:**

- `title: string` - Hero title
- `subtitle?: string` - Subtitle text
- `children?: ReactNode` - Additional content below CTA
- `className?: string`
- `imageUrl?: string` - Hero image
- `imageAlt?: string` - Image alt text
- `cta?: { label: string; onClick?: () => void }` - Call-to-action button

---

### AnimatedCounter: Number Animations

Animate counting from 0 to target value.

```tsx
import { AnimatedCounter } from "../components/AnimatedComponents";

export function ScoreDisplay({ confidence, accuracy }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-teal-600">
          <AnimatedCounter value={confidence} suffix="%" duration={2} />
        </div>
        <p>Confidence Score</p>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600">
          <AnimatedCounter value={accuracy} suffix="%" duration={2} />
        </div>
        <p>Model Accuracy</p>
      </div>
    </div>
  );
}
```

**Props:**

- `value: number` - Final value
- `maxValue?: number` - Maximum value (default: 100)
- `duration?: number` - Duration in seconds (default: 2)
- `decimals?: number` - Decimal places (default: 0)
- `suffix?: string` - Text to append (e.g., "%")
- `prefix?: string` - Text to prepend
- `className?: string`
- `delay?: number` - Initial delay before counting

---

### GlassmorphismCard: Premium Cards

Frosted glass effect with hover animations.

```tsx
import {
  GlassmorphismCard,
  GlassmorphismGrid,
} from "../components/AnimatedComponents";

export function BiomarkerCards({ biomarkers }) {
  return (
    <GlassmorphismGrid columns={3}>
      {biomarkers.map((biomarker, index) => (
        <GlassmorphismCard
          key={biomarker.id}
          title={biomarker.name}
          subtitle={biomarker.unit}
          interactive={true}
          delay={index * 0.1}
        >
          <p className="font-bold">Value: {biomarker.value}</p>
          <p className="text-sm text-gray-600">{biomarker.description}</p>
        </GlassmorphismCard>
      ))}
    </GlassmorphismGrid>
  );
}
```

**Props (GlassmorphismCard):**

- `children: ReactNode`
- `className?: string`
- `title?: string`
- `subtitle?: string`
- `onClick?: () => void`
- `interactive?: boolean` - Enable hover animations (default: false)
- `delay?: number` - Entry animation delay

---

### GeneExpressionChart: Bar Chart

Visualize gene expression levels with animated bars.

```tsx
import { GeneExpressionChart } from "../components/Charts";

export function GeneAnalysis({ geneData }) {
  return (
    <GeneExpressionChart
      data={geneData}
      title="Gene Expression Profile"
      subtitle="Top 10 biomarkers in your sample"
      colorScheme="teal"
      height={400}
      isAnimated={true}
    />
  );
}

// Example data structure
const geneData = [
  { gene: "CNTNAP2", value: 2.34 },
  { gene: "RELN", value: 1.89 },
  { gene: "FOXP2", value: 3.12 },
  // ...
];
```

**Props:**

- `data: GeneData[]` - Array of { gene, value, ... }
- `title?: string`
- `subtitle?: string`
- `colorScheme?: "teal" | "blue" | "sage"` (default: "teal")
- `height?: number` - Chart height in pixels (default: 400)
- `showLegend?: boolean`
- `isAnimated?: boolean` - Enable animations (default: true)

---

### ConfidenceGauge: Radial Gauge Chart

Display prediction confidence as an animated radial gauge.

```tsx
import { ConfidenceGauge } from "../components/Charts";

export function ResultsPage({ prediction }) {
  return (
    <ConfidenceGauge
      confidence={prediction.confidence}
      label="Prediction Confidence"
      subtitle="Based on gene expression analysis"
      size={250}
    />
  );
}
```

**Props:**

- `confidence: number` - Confidence level (0-100)
- `label?: string`
- `subtitle?: string`
- `size?: number` - Gauge size in pixels (default: 250)
- `showLabel?: boolean`
- `interpretation?: string` - Custom interpretation text

---

### BiomarkerVisualization: Pathway Flow

Interactive flow showing biomarker contributions to prediction.

```tsx
import { BiomarkerVisualization } from "../components/Charts";

export function BiomarkerAnalysis({ biomarkers, predictionScore }) {
  return (
    <BiomarkerVisualization
      biomarkers={biomarkers}
      title="Biomarker Pathway Analysis"
      subtitle="Individual biomarker contributions"
      predictionScore={predictionScore}
    />
  );
}

// Example biomarker structure
const biomarkers = [
  {
    id: "cntnap2",
    name: "CNTNAP2",
    value: 2.34,
    unit: "ng/mL",
    status: "high" as const,
    description: "Neuronal contact-associated protein 2",
  },
  // ...
];
```

**Props:**

- `biomarkers: Biomarker[]` - Biomarker data array
- `title?: string`
- `subtitle?: string`
- `predictionScore?: number`

**Biomarker Interface:**

```tsx
interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit?: string;
  description?: string;
  status: "high" | "normal" | "low";
}
```

---

## ♿ Accessibility: Respecting User Preferences

### useReducedMotion Hook

Automatically respects user's system preference for reduced motion.

```tsx
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motion } from "framer-motion";

export function MyComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        x: 100,
        y: 50,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      This animation respects user preferences
    </motion.div>
  );
}
```

### Other Accessibility Hooks

```tsx
import {
  useReducedMotion,
  useSafeTransition,
  useSafeVariants,
} from "../hooks/useReducedMotion";

// Safe transitions (instant if motion reduced)
const transition = useSafeTransition({
  duration: 0.3,
  ease: "easeOut",
});

// Safe variants (no animation if motion reduced)
const variants = useSafeVariants(animatedVariants);
```

---

## 🎯 Global Animation Configuration

All animation timings and easing functions are defined in `config/motion.config.ts`:

```tsx
import {
  ANIMATION_TIMINGS,
  EASING,
  TRANSITIONS,
  VARIANTS,
} from "../config/motion.config";

// Use predefined timings
const myTransition = {
  duration: ANIMATION_TIMINGS.standard, // 0.3s
  ease: EASING.easeOut,
};

// Or use predefined transitions
const pageTransition = TRANSITIONS.pageTransition;
```

### Available Timings

- `instant`: 0.15s (quick feedback)
- `quick`: 0.25s
- `standard`: 0.3s (most common)
- `slow`: 0.4s
- `extended`: 0.5s
- `breathing`: 3s
- `loading`: 2s

### Available Easing Functions

- `easeIn`, `easeOut`, `easeInOut`
- `easeInQuad`, `easeOutQuad`, `easeOutCubic`
- `smooth`, `gentle`

---

## 🎨 CSS Animation Utilities

Global CSS classes available in `styles/animations.css`:

```tsx
// Glassmorphism effects
<div className="glassmorphism">Frosted glass effect</div>

// Gradients
<div className="gradient-teal-to-blue">Color gradient</div>

// Shadows
<div className="shadow-soft">Soft healthcare shadow</div>

// Animations
<div className="animate-breathing">Gentle pulse</div>
<div className="animate-spin-smooth">Smooth rotation</div>
<div className="animate-slide-up">Slide up entrance</div>
<div className="animate-glow">Glowing effect</div>

// Card interactions
<div className="card-hover">Hover to elevate</div>
```

---

## 📊 Integration with Existing Pages

### Example: Updating HomePage

```tsx
import { PageWrapper, AnimatedHero } from "../components/AnimatedComponents";

export function HomePage() {
  return (
    <PageWrapper>
      <AnimatedHero
        title="Autism Screening Tool"
        subtitle="Genetic biomarker analysis for early detection"
        cta={{
          label: "Start Screening",
          onClick: () => navigate("/upload"),
        }}
      />

      {/* Rest of page content */}
    </PageWrapper>
  );
}
```

### Example: Updating ResultsPage

```tsx
import {
  PageWrapper,
  BreathingCard,
  StaggerContainer,
  StaggerItem,
} from "../components/AnimatedComponents";
import {
  ConfidenceGauge,
  GeneExpressionChart,
  BiomarkerVisualization,
} from "../components/Charts";

export function ResultsPage({ prediction, geneData, biomarkers }) {
  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Confidence Score */}
        <BreathingCard className="p-6 rounded-lg">
          <ConfidenceGauge
            confidence={prediction.confidence}
            label="Prediction Result"
          />
        </BreathingCard>

        {/* Gene Data */}
        <GeneExpressionChart data={geneData} />

        {/* Biomarker Analysis */}
        <BiomarkerVisualization
          biomarkers={biomarkers}
          predictionScore={prediction.confidence}
        />

        {/* Recommendations */}
        <StaggerContainer>
          {prediction.recommendations?.map((rec, idx) => (
            <StaggerItem key={idx}>
              <Card title={rec.title}>
                <p>{rec.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageWrapper>
  );
}
```

---

## 🔧 Customization

### Override Animation Timings

Modify `config/motion.config.ts`:

```tsx
export const ANIMATION_TIMINGS = {
  standard: 0.5, // Increase to 0.5s for slower animations
  breathing: 4, // Slower breathing animation
  // ...
};
```

### Add Custom Variants

Add to `config/motion.config.ts`:

```tsx
export const VARIANTS = {
  // ... existing variants
  customVariants: {
    initial: { opacity: 0, rotate: -10 },
    animate: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.5 },
    },
  },
};
```

---

## 📋 Checklist: Integration Steps

- [ ] Import animations.css in main application file
- [ ] Update HomePage with AnimatedHero component
- [ ] Wrap pages with PageWrapper component
- [ ] Use StaggerContainer for FAQ and gene lists
- [ ] Add BreathingCard to result display
- [ ] Integrate ConfidenceGauge for confidence scores
- [ ] Add GeneExpressionChart for gene data
- [ ] Add BiomarkerVisualization for detailed analysis
- [ ] Test with `prefers-reduced-motion` setting
- [ ] Verify accessibility with screen reader
- [ ] Test on mobile, tablet, and desktop
- [ ] Verify performance metrics

---

## 🧪 Testing

### Test Reduced Motion Support

```bash
# macOS: System Preferences → Accessibility → Display → Reduce Motion
# Windows: Settings → Ease of Access → Display → Show animations
# Check browser DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion
```

### Test Components in Isolation

```tsx
import { Meta, StoryObj } from "@storybook/react";
import { PageWrapper } from "../components/AnimatedComponents";

export default {
  component: PageWrapper,
  title: "Animations/PageWrapper",
} as Meta;

export const Default: StoryObj = {
  args: {
    children: <div>Test content</div>,
  },
};
```

---

## 📚 Learning Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Recharts Docs**: https://recharts.org/
- **Web Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Animation Easing**: https://easings.net/

---

## 🆘 Troubleshooting

### Animations not appearing

- Ensure `styles/animations.css` is imported in main file
- Check that components are wrapped in motion.div
- Verify Framer Motion is installed: `npm list framer-motion`

### Animations stuttering

- Check component re-render frequency
- Use `useCallback` to memoize functions
- Verify GPU acceleration is enabled in browser

### Accessibility issues

- Test with screen reader (NVDA, JAWS, VoiceOver)
- Check `aria-hidden` attributes on decorative animations
- Verify focus management in interactive components

### Chart rendering issues

- Ensure ResponsiveContainer has a parent with defined height
- Check data format matches expected interface
- Verify Recharts is properly installed: `npm list recharts`

---

## 📧 Support

For issues or questions:

1. Check the example code above
2. Review component prop types in TypeScript
3. Consult official documentation links
4. Create issue with minimal reproduction

---

**Last Updated**: April 2026  
**Version**: 1.0.0 (Production Ready)
