# Implementation Examples: Real-World Component Usage

Complete, copy-paste-ready examples for integrating animations into your existing pages.

---

## 🏠 HomePage Implementation

**File**: `frontend/src/components/Pages/HomePage.tsx`

```tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  AnimatedHero,
  StaggerContainer,
  StaggerItem,
  GlassmorphismCard,
} from "../AnimatedComponents";
import { Card, Button } from "../Common";

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🧬",
      title: "Advanced Genetic Analysis",
      description: "State-of-the-art machine learning analysis of biomarkers",
    },
    {
      icon: "📊",
      title: "Personalized Risk Score",
      description:
        "Get your individual risk assessment based on gene expression",
    },
    {
      icon: "🔬",
      title: "Clinical Validation",
      description:
        "Results backed by peer-reviewed research and clinical trials",
    },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <AnimatedHero
          title="Autism Screening Tool"
          subtitle="Advanced genetic biomarker analysis for early detection"
          cta={{
            label: "Start Screening",
            onClick: () => navigate("/upload"),
          }}
          className="mb-16"
        />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-center mb-12 text-teal-900"
        >
          Why Choose Our Tool?
        </motion.h2>

        <StaggerContainer
          staggerDelay={100}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <StaggerItem key={idx}>
              <GlassmorphismCard
                title={feature.title}
                interactive={true}
                delay={idx * 0.1}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <p className="text-gray-700">{feature.description}</p>
              </GlassmorphismCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our screening tool analyzes genetic biomarkers to provide
            personalized insights about autism risk factors.
          </p>
          <Button
            onClick={() => navigate("/upload")}
            className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Begin Your Analysis
          </Button>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
```

---

## 📤 UploadPage Implementation

**File**: `frontend/src/components/Pages/UploadPage.tsx`

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PageWrapper,
  AnimatedHero,
  StaggerContainer,
  StaggerItem,
} from "../AnimatedComponents";
import { Card, Button, LoadingSpinner } from "../Common";
import { usePredictor } from "../../hooks/usePredictor";

export function UploadPage() {
  const navigate = useNavigate();
  const { predict, loading, error } = usePredictor();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const result = await predict(file);
      // Navigate to results with prediction data
      navigate("/results", { state: { prediction: result } });
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-12">
        <AnimatedHero
          title="Upload Your Gene Data"
          subtitle="CSV format with Gene and Value columns"
          className="mb-12"
        />
      </section>

      {/* Upload Section */}
      <section className="container mx-auto px-4 max-w-2xl">
        <StaggerContainer staggerDelay={50}>
          {/* Instructions */}
          <StaggerItem className="mb-8">
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">
                How to Prepare Your File
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Create a CSV file with two columns: "Gene" and "Value"</li>
                <li>
                  Include at least 5 genes from the supported biomarker list
                </li>
                <li>Values should be numeric (e.g., 2.34, 1.89)</li>
                <li>Upload the file below to start analysis</li>
              </ol>
            </Card>
          </StaggerItem>

          {/* File Upload */}
          <StaggerItem className="mb-8">
            <Card>
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100"
                />
              </label>

              {file && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-sm text-green-800">
                    ✓ File selected: <strong>{file.name}</strong>
                  </p>
                </motion.div>
              )}
            </Card>
          </StaggerItem>

          {/* Error Message */}
          {error && (
            <StaggerItem className="mb-8">
              <Card className="bg-red-50 border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {error}
                </p>
              </Card>
            </StaggerItem>
          )}

          {/* Action Buttons */}
          <StaggerItem className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all
                ${
                  file && !loading
                    ? "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Data"
              )}
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="py-3 px-4 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Sample Data Section */}
      <section className="container mx-auto px-4 max-w-2xl mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-teal-900 mb-4">
            Example CSV Format
          </h3>
          <Card className="bg-gray-50">
            <pre className="text-xs text-gray-700 overflow-auto">
              {`Gene,Value
CNTNAP2,2.34
RELN,1.89
FOXP2,3.12
NEUROLIGIN3,2.56
SHANK3,1.78`}
            </pre>
          </Card>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
```

---

## 📊 ResultsPage Implementation

**File**: `frontend/src/components/Pages/ResultsPage.tsx`

```tsx
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PageWrapper,
  BreathingCard,
  AnimatedCounter,
  StaggerContainer,
  StaggerItem,
} from "../AnimatedComponents";
import {
  ConfidenceGauge,
  GeneExpressionChart,
  BiomarkerVisualization,
} from "../Charts";
import { Card, Button } from "../Common";

// Mock data structure - replace with real API response
interface PredictionResult {
  confidence: number;
  geneData: Array<{ gene: string; value: number }>;
  biomarkers: Array<{
    id: string;
    name: string;
    value: number;
    unit?: string;
    status: "high" | "normal" | "low";
    description?: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction: PredictionResult | null = location.state?.prediction;

  if (!prediction) {
    return (
      <PageWrapper>
        <div className="container mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-teal-900 mb-4">
            No Results Found
          </h1>
          <p className="text-gray-600 mb-8">Please upload your data first</p>
          <Button
            onClick={() => navigate("/upload")}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg"
          >
            Go to Upload
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto space-y-12">
        {/* Header */}
        <section className="py-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-bold text-teal-900 mb-2"
          >
            Your Analysis Results
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-gray-600"
          >
            Comprehensive genetic biomarker analysis
          </motion.p>
        </section>

        {/* Primary Result - Confidence Gauge */}
        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <BreathingCard className="p-0">
              <ConfidenceGauge
                confidence={prediction.confidence}
                label="Prediction Confidence"
                subtitle="Based on your biomarker profile"
              />
            </BreathingCard>
          </div>

          <div>
            <Card>
              <h3 className="text-xl font-bold text-teal-900 mb-4">
                Quick Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                  <p className="text-3xl font-bold text-teal-600">
                    <AnimatedCounter
                      value={prediction.confidence}
                      suffix="%"
                      duration={1.5}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Biomarkers Analyzed</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {prediction.biomarkers.length}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    {prediction.confidence > 70
                      ? "✓ High confidence prediction"
                      : "⚠ Moderate confidence prediction"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Gene Expression Data */}
        <section>
          <h2 className="text-2xl font-bold text-teal-900 mb-6">
            Gene Expression Profile
          </h2>
          <GeneExpressionChart
            data={prediction.geneData}
            title="Top Biomarkers"
            subtitle="Expression levels in your sample"
            colorScheme="teal"
            height={400}
          />
        </section>

        {/* Detailed Biomarker Analysis */}
        <section>
          <h2 className="text-2xl font-bold text-teal-900 mb-6">
            Detailed Biomarker Analysis
          </h2>
          <BiomarkerVisualization
            biomarkers={prediction.biomarkers}
            predictionScore={prediction.confidence}
            title="Individual Biomarker Contributions"
          />
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-2xl font-bold text-teal-900 mb-6">Next Steps</h2>
          <StaggerContainer staggerDelay={75}>
            {prediction.recommendations?.map((rec, idx) => (
              <StaggerItem key={idx} className="mb-4">
                <Card className="border-l-4 border-l-teal-500 bg-teal-50">
                  <h3 className="font-bold text-teal-900 text-lg mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{rec.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Action Buttons */}
        <section className="py-8 flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Analyze Another Sample
          </Button>
          <Button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Print Results
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400"
          >
            Back to Home
          </Button>
        </section>
      </div>
    </PageWrapper>
  );
}
```

---

## ❓ FAQPage Implementation

**File**: `frontend/src/components/Pages/FAQPage.tsx`

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  PageWrapper,
  StaggerContainer,
  StaggerItem,
} from "../AnimatedComponents";
import { Card } from "../Common";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FAQPage({ faqs }: { faqs: FAQ[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-teal-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about our screening tool
          </p>
        </motion.div>

        {/* FAQ by Category */}
        {categories.map((category) => (
          <section key={category} className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-teal-900 mb-6"
            >
              {category}
            </motion.h2>

            <StaggerContainer staggerDelay={50}>
              {faqs
                .filter((f) => f.category === category)
                .map((faq) => (
                  <StaggerItem key={faq.id}>
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor:
                          expandedId === faq.id
                            ? "rgb(240, 253, 250)"
                            : "rgb(255, 255, 255)",
                      }}
                      className="mb-3 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === faq.id ? null : faq.id)
                        }
                        className="w-full p-4 text-left font-semibold text-teal-900 hover:bg-teal-50 transition-colors flex justify-between items-center"
                      >
                        {faq.question}
                        <motion.span
                          animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          ▼
                        </motion.span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedId === faq.id ? "auto" : 0,
                          opacity: expandedId === faq.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="p-4 pt-0 text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </motion.div>
                  </StaggerItem>
                ))}
            </StaggerContainer>
          </section>
        ))}
      </div>
    </PageWrapper>
  );
}
```

---

## 📱 Responsive Card Example

**Reusable pattern for consistent styling**:

```tsx
import { motion } from "framer-motion";
import { GlassmorphismCard } from "../AnimatedComponents";
import { TRANSITIONS } from "../../config/motion.config";

interface DataCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: "up" | "down" | "stable";
}

export function DataCard({
  icon,
  title,
  value,
  unit,
  description,
  trend,
}: DataCardProps) {
  return (
    <GlassmorphismCard title={title} interactive={true}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-4xl font-bold text-teal-600 mb-2">
            {value}
            {unit && <span className="text-lg text-gray-600">{unit}</span>}
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>

      {trend && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITIONS.pageTransition}
          className={`mt-4 text-sm font-semibold
            ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                  ? "text-red-600"
                  : "text-gray-600"
            }
          `}
        >
          {trend === "up" && "↑ Trending up"}
          {trend === "down" && "↓ Trending down"}
          {trend === "stable" && "→ Stable"}
        </motion.div>
      )}
    </GlassmorphismCard>
  );
}
```

---

## 🎨 CSS Class Usage Examples

```tsx
// Breathing effect on important elements
<div className="animate-breathing">
  Important notice
</div>

// Fade entrance
<motion.div className="animate-fade-in">
  Content
</motion.div>

// Slide up with nice enter
<div className="animate-slide-up">
  Feature card
</div>

// Glowing effect for emphasis
<div className="shadow-glow-teal animate-glow">
  Highlighted result
</div>

// Glassmorphism background
<div className="glassmorphism rounded-lg p-6">
  Premium card content
</div>

// Gradient background
<div className="gradient-teal-to-blue p-8 text-white">
  Gradient section
</div>

// Soft shadow styling
<div className="shadow-soft rounded-lg">
  Card with soft shadow
</div>

// Dark mode glassmorphic card
<div className="glassmorphism-dark dark:block hidden rounded-lg p-6">
  Dark mode content
</div>
```

---

## 🔄 State-Based Animation Pattern

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { VARIANTS } from "../../config/motion.config";

export function LoadingState({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          variants={VARIANTS.fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-center py-8"
        >
          <div className="animate-spin-smooth">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={VARIANTS.fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          Your actual content here
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## ✅ Ready for Integration

All examples above are production-ready and can be copied directly into your application. They follow the healthcare aesthetic guidelines and use the provided animation components.

**Key Points**:

- ✅ Uses provided animation components
- ✅ Follows color palette
- ✅ Respects motion preferences
- ✅ Mobile responsive
- ✅ TypeScript compatible
- ✅ Accessibility aware

Start with HomePage and UploadPage, then integrate charts into ResultsPage.
