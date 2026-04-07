/**
 * HomePage Component
 * Landing page with introduction and call-to-action
 */

import React from "react";
import { ArrowRight, Zap, Shield, Brain } from "lucide-react";
import Card from "../Common/Card";
import Button from "../Common/Button";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-block rounded-full bg-primary-100 px-4 py-2">
            <p className="text-sm font-semibold text-primary-700">
              Powered by Artificial Neural Networks
            </p>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Gene Expression Analysis
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              for Autism Characterization
            </span>
          </h1>

          <p className="mb-10 text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Upload your gene expression data to receive an evidence-based
            prediction using state-of-the-art machine learning models trained
            on comprehensive genomic datasets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate?.("upload")}
              className="gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate?.("about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white border-y border-neutral-200">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose Our Tool?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Designed with accessibility and accuracy in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100">
                    <Zap className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">
                    Fast & Accurate
                  </h3>
                  <p className="text-neutral-600">
                    Receive predictions in seconds using advanced neural
                    networks trained on extensive datasets.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary-100">
                    <Shield className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">
                    Privacy First
                  </h3>
                  <p className="text-neutral-600">
                    Your data is processed securely and never stored or shared
                    with third parties.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-100">
                    <Brain className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">
                    Evidence-Based
                  </h3>
                  <p className="text-neutral-600">
                    Built on peer-reviewed research and validated with
                    comprehensive genomic data.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-neutral-900 mb-16 text-center">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Upload Your Data",
                description:
                  "Upload a CSV file containing your gene expression data with Gene names and Values.",
              },
              {
                step: 2,
                title: "Automated Processing",
                description:
                  "Your data is processed, normalized, and analyzed using our trained neural network.",
              },
              {
                step: 3,
                title: "Get Results",
                description:
                  "Receive detailed predictions with confidence scores and visualizations.",
              },
              {
                step: 4,
                title: "Interpret & Share",
                description:
                  "View your results, export them, and share with healthcare professionals as needed.",
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-bold">
                    {step}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-lg text-neutral-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-neutral-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Upload your gene expression data now to receive your personalized
            prediction.
          </p>
          <Button
            size="lg"
            className="bg-black text-primary-600 hover:bg-neutral-100"
            onClick={() => onNavigate?.("upload")}
          >
            Upload Data
            <ArrowRight size={20} />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;