# Framer Motion Animation System - Quick Reference

## 🚀 Getting Started (5 Minutes)

### Step 1: Import the Animation Styles

Add this to your `frontend/src/main.tsx`:

```tsx
import "./styles/animations.css";
```

### Step 2: Update a Page with Animations

Replace contents of any page file with this pattern:

```tsx
import { PageWrapper, AnimatedHero } from "../components/AnimatedComponents";
import { ConfidenceGauge } from "../components/Charts";

export function MyPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto">
        <AnimatedHero
          title="Page Title"
          subtitle="Subtitle text"
          cta={{
            label: "Button Text",
            onClick: () => console.log("Clicked"),
          }}
        />

        {/* Your content here */}
      </div>
    </PageWrapper>
  );
}
```

---

## 📦 Available Components Quick Look

### Wrappers & Containers

```tsx
// Page transitions
<PageWrapper className="container">Content</PageWrapper>

// List reveals with stagger
<StaggerContainer staggerDelay={50}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
</StaggerContainer>
```

### Visual Effects

```tsx
// Gentle pulse on cards
<BreathingCard isActive={true}>Content</BreathingCard>

// Premium frosted glass
<GlassmorphismCard title="Title" interactive={true}>
  Content
</GlassmorphismCard>

// Animated counter (0 to value)
<AnimatedCounter value={87} suffix="%" />
```

### Hero Sections

```tsx
// Staggered title, subtitle, CTA
<AnimatedHero
  title="Main Title"
  subtitle="Subtitle"
  cta={{ label: "Get Started" }}
/>
```

### Charts

```tsx
// Gene expression bars
<GeneExpressionChart data={geneData} />

// Confidence radial gauge
<ConfidenceGauge confidence={87} />

// Biomarker pathway flow
<BiomarkerVisualization biomarkers={biomarkers} />
```

---

## 🎬 Animation Timings Reference

| Animation | Duration | Feel           | Use Case                |
| --------- | -------- | -------------- | ----------------------- |
| instant   | 150ms    | Quick feedback | Micro-interactions      |
| quick     | 250ms    | Snappy         | Modal/button feedback   |
| standard  | 300ms    | Smooth         | Component entrance      |
| slow      | 400ms    | Deliberate     | Page transitions        |
| breathing | 3s       | Calming        | Result cards, attention |
| loading   | 2s       | Smooth         | Loading spinners        |

---

## 🎨 Color System Reference

### Primary Colors

- **Teal**: #4A9B8E (Main actions, primary UI)
- **Blue**: #5B8DBE (Secondary actions, info)
- **Sage Green**: #7BA98E (Accents, status)

### Semantic Colors

- **Success**: #6B8E23 (Positive outcomes)
- **Alert**: #C9844E (Warnings)
- **Neutral**: #F9F9F7 (Backgrounds)

---

## ♿ Accessibility Built-In

All components automatically respect user's motion preferences:

```tsx
// Just use normally - accessibility is built-in
<AnimatedCounter value={87} />

// Under the hood:
// - Detects prefers-reduced-motion setting
// - Shows instant result for users who prefer reduced motion
// - No extra code needed!
```

### Manual Accessibility Control

```tsx
import { useReducedMotion } from "../hooks/useReducedMotion";

export function MyComponent() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: prefersReduced ? 0 : 0.5,
      }}
    >
      Content
    </motion.div>
  );
}
```

---

## 💡 Real-World Integration Examples

### HomePage Enhancement

```tsx
import { PageWrapper, AnimatedHero } from "../components/AnimatedComponents";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <AnimatedHero
        title="Autism Screening Tool"
        subtitle="Powered by genetic biomarkers and machine learning"
        cta={{
          label: "Start Screening",
          onClick: () => navigate("/upload"),
        }}
        className="py-20 text-center"
      />

      <div className="mt-16 grid grid-cols-3 gap-6">
        {/* Feature cards from your content */}
      </div>
    </PageWrapper>
  );
}
```

### ResultsPage Enhancement

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
      <div className="container mx-auto space-y-12">
        {/* Prediction Result */}
        <section>
          <h1 className="text-3xl font-bold mb-8">Your Results</h1>

          <BreathingCard className="p-8 rounded-lg bg-white">
            <ConfidenceGauge
              confidence={prediction.confidence}
              label="Prediction Confidence"
              subtitle="Based on genetic biomarker analysis"
            />
          </BreathingCard>
        </section>

        {/* Gene Data */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Gene Expression Profile</h2>
          <GeneExpressionChart
            data={geneData}
            title="Top Biomarkers"
            colorScheme="teal"
          />
        </section>

        {/* Biomarker Analysis */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
          <BiomarkerVisualization
            biomarkers={biomarkers}
            predictionScore={prediction.confidence}
            title="Biomarker Contributions"
          />
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <StaggerContainer>
            {prediction.recommendations?.map((rec, idx) => (
              <StaggerItem key={idx} className="mb-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-teal-900">{rec.title}</h3>
                  <p className="text-sm text-gray-700 mt-2">
                    {rec.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </div>
    </PageWrapper>
  );
}
```

### FAQPage Enhancement

```tsx
import {
  PageWrapper,
  StaggerContainer,
  StaggerItem,
} from "../components/AnimatedComponents";
import { Card } from "../components/Common/Card";

export function FAQPage({ faqs }) {
  return (
    <PageWrapper>
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h1>

        <StaggerContainer staggerDelay={50}>
          {faqs.map((faq, idx) => (
            <StaggerItem key={idx} className="mb-4">
              <Card>
                <h3 className="font-bold text-lg text-teal-900">
                  {faq.question}
                </h3>
                <p className="text-gray-700 mt-3">{faq.answer}</p>
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

## 📊 Data Format Reference

### GeneData Format

```tsx
const geneData = [
  {
    gene: "CNTNAP2",
    value: 2.34,
  },
  {
    gene: "RELN",
    value: 1.89,
  },
];
```

### Biomarker Format

```tsx
interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit?: string;
  description?: string;
  status: "high" | "normal" | "low";
}

const biomarkers: Biomarker[] = [
  {
    id: "cntnap2",
    name: "CNTNAP2",
    value: 2.34,
    unit: "ng/mL",
    status: "high",
    description: "Neuronal contact-associated protein",
  },
];
```

---

## 🧪 Testing Animations

### Test prefers-reduced-motion

1. Open browser DevTools
2. Go to: DevTools → Rendering → Check "Emulate CSS media feature prefers-reduced-motion"
3. Animations should become instant

### Visual Testing

1. Open each page
2. Watch animations play
3. Check on mobile (small viewport)
4. Test with slow network (DevTools → Network → Slow 3G)

### Accessibility Testing

1. Use screen reader (JAWS, NVDA, VoiceOver)
2. Tab through interactive elements
3. Verify focus rings visible
4. Check aria-labels on images

---

## ⚡ Performance Tips

### Do's:

- ✅ Use `useCallback` to memoize functions passed to handlers
- ✅ Use `useMemo` for expensive calculations
- ✅ Keep animations under 500ms (except breathing effects)
- ✅ Test on actual mobile devices

### Don'ts:

- ❌ Don't animate layout properties (use transform instead)
- ❌ Don't animate width/height (use transform scale)
- ❌ Don't use setTimeout in animations
- ❌ Don't animate more than 50 elements simultaneously

### Example Performance Optimization

```tsx
import { useCallback, useMemo } from "react";

export function ResultsPage({ data }) {
  // Memoize expensive calculation
  const sortedGenes = useMemo(() => {
    return data.genes.sort((a, b) => b.value - a.value).slice(0, 10);
  }, [data.genes]);

  // Memoize handler
  const handleDownload = useCallback(() => {
    downloadReport(data);
  }, [data]);

  return (
    <div>
      <GeneExpressionChart data={sortedGenes} />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

---

## 🔗 CSS Utility Classes

Quick classes to add animations to existing elements:

```tsx
// Add to any element's className
<div className="animate-breathing">Pulsing effect</div>
<div className="animate-spin-smooth">Rotating loader</div>
<div className="animate-slide-up">Entrance animation</div>
<div className="animate-fade-in">Fade in</div>
<div className="animate-glow">Glowing effect</div>

// Visual effects
<div className="glassmorphism">Frosted glass</div>
<div className="gradient-teal-to-blue">Color gradient</div>
<div className="shadow-soft">Soft shadow</div>
<div className="shadow-glow-teal">Glow effect</div>
```

---

## 🆘 Common Issues & Fixes

### "Animations not showing"

**Fix**: Make sure to import `animations.css` in main.tsx

```tsx
import "./styles/animations.css";
```

### "Components stuttering"

**Fix**: Check for heavy re-renders, use React DevTools Profiler

```bash
npm run dev  # Then open React Profiler in DevTools
```

### "Not respecting prefers-reduced-motion"

**Fix**: Component automatically handles it, but ensure you're not overriding transitions

```tsx
// ❌ Wrong - overrides safety
<motion.div transition={{ duration: 5 }}>...</motion.div>

// ✅ Right - uses safe defaults
<motion.div>...</motion.div>
```

### "Charts not rendering"

**Fix**: Ensure parent container has defined height

```tsx
<div style={{ width: "100%", height: 400 }}>
  <GeneExpressionChart data={data} />
</div>
```

---

## 📚 File Reference

| File                              | Purpose           | Key Exports                          |
| --------------------------------- | ----------------- | ------------------------------------ |
| `config/motion.config.ts`         | Animation presets | ANIMATION_TIMINGS, EASING, VARIANTS  |
| `hooks/useReducedMotion.ts`       | Accessibility     | useReducedMotion, useSafeTransition  |
| `components/AnimatedComponents/*` | UI components     | PageWrapper, StaggerContainer, etc   |
| `components/Charts/*`             | Data vis          | GeneExpressionChart, ConfidenceGauge |
| `styles/animations.css`           | Global utilities  | animate-breathing, animate-glow, etc |

---

## ✅ Implementation Checklist

- [ ] Import animations.css in main.tsx
- [ ] Add PageWrapper to all page components
- [ ] Add AnimatedHero to HomePage
- [ ] Add animations.css to Home, About, FAQ pages
- [ ] Add BreathingCard to results display
- [ ] Add ConfidenceGauge to results page
- [ ] Add GeneExpressionChart to results page
- [ ] Add BiomarkerVisualization to detailed analysis
- [ ] Test on mobile browsers
- [ ] Test with prefers-reduced-motion enabled
- [ ] Test with screen reader
- [ ] Performance check (mobile device)
- [ ] Dark mode testing
- [ ] Cross-browser testing

---

## 📞 Need Help?

Refer to `MOTION_INTEGRATION_GUIDE.md` for:

- Complete API documentation
- Detailed prop explanations
- Advanced customization
- Troubleshooting guide
- Learning resources

---

**Quick Links**:

- Main Guide: `MOTION_INTEGRATION_GUIDE.md`
- Deliverables: `AGENT_3_DELIVERABLES.md`
- Config: `frontend/src/config/motion.config.ts`
- Style Utils: `frontend/src/styles/animations.css`

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: April 2, 2026
