/**
 * FAQPage Component
 * Frequently asked questions and answers
 * Powered by medical knowledge base with evidence-based information
 */

import React, { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import Card from "../Common/Card";
import { cn } from "../../lib/cn.ts";
import { useKnowledgeBase } from "../../hooks/useKnowledgeBase";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// Transform knowledge base FAQs into component format
// const FAQPage: React.FC = () => {
//   const { faqItems: medicalFaqs } = useKnowledgeBase();
//   const [expandedId, setExpandedId] = useState<string | null>(null);

// Transform knowledge base FAQs into component format
const FAQPage: React.FC = () => {
  const { faqItems: medicalFaqs } = useKnowledgeBase();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tool-specific FAQs
  const toolFAQs: FAQItem[] = [
    {
      id: "tool-1",
      category: "Using This Tool",
      question: "What data format do I need?",
      answer:
        "You need a CSV file with two columns: 'Gene' (gene name or identifier) and 'Value' (numerical expression value). The first row should be headers.",
    },
    {
      id: "tool-2",
      category: "Using This Tool",
      question: "How do I upload my data?",
      answer:
        "Go to the Upload page, click the upload area or drag and drop your CSV file. The tool will automatically validate and process your data.",
    },
    {
      id: "tool-3",
      category: "Understanding Results",
      question: "What do the results mean?",
      answer:
        "Results indicate the likelihood of autism-associated gene expression patterns. A high score suggests patterns consistent with research findings in autism populations. However, this is NOT a diagnosis—results must be evaluated in clinical context with a healthcare provider.",
    },
    {
      id: "tool-4",
      category: "Understanding Results",
      question: "Can I share these results with my doctor?",
      answer:
        "Yes, absolutely. Results can be valuable information to discuss with your healthcare provider. Print or export the results and bring them to your appointment. Be clear that this is a research screening tool, not a clinical diagnostic evaluation.",
    },
    {
      id: "tool-5",
      category: "About This Tool",
      question: "Is this a diagnostic tool?",
      answer:
        "No. This tool provides analysis of gene expression patterns but is NOT a clinical diagnostic instrument. Autism diagnosis requires comprehensive professional assessment by qualified specialists including behavioral, developmental, and medical evaluation.",
    },
    {
      id: "tool-6",
      category: "About This Tool",
      question: "What factors does this tool NOT consider?",
      answer:
        "This tool analyzes gene expression only. It does not account for behavioral traits, developmental history, social interaction patterns, communication abilities, co-occurring conditions, or environmental factors—all crucial for diagnosis.",
    },
    {
      id: "tool-7",
      category: "Technical",
      question: "How long does analysis take?",
      answer:
        "Most analyses complete within 5-30 seconds depending on file size and server load. You'll receive status updates during processing.",
    },
    {
      id: "tool-8",
      category: "Technical",
      question: "What's the maximum file size?",
      answer:
        "The maximum file size is 10MB. Most standard gene expression CSV files are much smaller and process instantly.",
    },
    {
      id: "tool-9",
      category: "Privacy & Safety",
      question: "Is my data safe and private?",
      answer:
        "Yes. Your genetic data is processed securely using industry-standard encryption. We do NOT store your data permanently, do NOT share it with third parties, and do NOT use it for any purpose beyond providing your analysis result.",
    },
    {
      id: "tool-10",
      category: "Privacy & Safety",
      question: "Can you identify me from my genetic data?",
      answer:
        "No. We do not store names, medical IDs, or any personal identifiers. Your analysis is completely anonymized. The only information stored is your result, without any way to link it back to you.",
    },
  ];

  // Combine all FAQs
  const allFAQs = [...toolFAQs, ...medicalFaqs];

  // Get unique categories
  const categories = Array.from(
    new Set(allFAQs.map((item) => item.category))
  );

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-lg text-neutral-600">
            Find answers to common questions about autism, gene expression, and how to use this tool.
          </p>
        </div>

        {/* Disclaimer Card */}
        <Card
          variant="elevated"
          className="mb-12 border-l-4 border-amber-500 bg-amber-50"
        >
          <div className="flex gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-amber-900 mb-2">
                Important: This is a Screening Tool Only
              </h3>
              <p className="text-sm text-amber-800">
                This tool provides gene expression analysis to support decision-making,
                NOT autism diagnosis. Any results should be discussed with a qualified healthcare provider.
                Autism diagnosis requires comprehensive professional evaluation.
              </p>
            </div>
          </div>
        </Card>

        {/* FAQs by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryFaqs = allFAQs.filter((item) => item.category === category);
            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b-2 border-primary-200">
                  {category}
                </h2>

                <div className="space-y-3">
                  {categoryFaqs.map((item) => (
                    <Card
                      key={item.id}
                      variant="default"
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-primary-600 transition-transform",
                              expandedId === item.id && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 text-base">
                            {item.question}
                          </h3>

                          {/* Answer - Shown when expanded */}
                          {expandedId === item.id && (
                            <div className="mt-4 pt-4 border-t border-neutral-200">
                              <p className="text-neutral-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16 pt-12 border-t-2 border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Want to Learn More?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="elevated">
              <h3 className="font-bold text-neutral-900 mb-3">📚 About Autism</h3>
              <p className="text-sm text-neutral-700 mb-4">
                Learn about autism spectrum disorder, diagnostic criteria, support levels,
                and what autism means for individuals and families.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0 })}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Visit About Page →
              </button>
            </Card>

            <Card variant="elevated">
              <h3 className="font-bold text-neutral-900 mb-3">🧬 Gene Science</h3>
              <p className="text-sm text-neutral-700 mb-4">
                Understand how genes work, what gene expression means, and the connection
                between genetics and autism development.
              </p>
              <p className="text-xs text-neutral-600">
                See the "About" page for detailed gene science explanations.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg text-center border border-primary-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-neutral-600 mb-4">
            Contact our scientific team for more information
          </p>
          <a
            href="mailto:contact@autismpredictor.org"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;