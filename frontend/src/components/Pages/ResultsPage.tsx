/**
 * ResultsPage Component
 * Displays prediction results, confidence scores, and gene analysis
 */

import React from "react";
import {
  TrendingUp,
  BarChart3,
  Download,
  Share2,
} from "lucide-react";
import Card from "../Common/Card";
import Button from "../Common/Button";
import { PredictionResult, NormalizedGene } from "../../types";
import { formatProbability, getConfidenceLevel } from "../../lib/cn.ts";

interface ResultsPageProps {
  prediction: PredictionResult | null;
  geneData: NormalizedGene[];
  onUploadNew?: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  prediction,
  geneData,
  onUploadNew,
}) => {
  /**
   * Generate and download results as CSV
   */
  const handleExportResults = () => {
    if (!prediction) return;

    // Create CSV header and summary
    const timestamp = new Date(prediction.timestamp).toLocaleString();
    const csvContent = [
      "AUTISM PREDICTION ANALYSIS RESULTS",
      `Generated: ${timestamp}`,
      "",
      "PREDICTION SUMMARY",
      "-------------------",
      `Prediction: ${prediction.prediction}`,
      `Probability: ${(prediction.probability * 100).toFixed(2)}%`,
      `Confidence: ${getConfidenceLevel(prediction.probability).label}`,
      "",
      "TOP GENE EXPRESSIONS",
      "-------------------",
      "Gene,Value,Ranking",
      ...geneData.slice(0, 50).map((gene) =>
        `${gene.gene},${gene.value.toFixed(6)},${gene.ranking}`
      ),
      "",
      "DISCLAIMER",
      "-------------------",
      "These predictions are for research and educational purposes only.",
      "They should not be used for clinical diagnosis.",
      "Please consult with qualified healthcare professionals for proper assessment.",
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const filename = `autism-analysis-${new Date(prediction.timestamp).toISOString().split("T")[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Generate and download results as JSON
   */
  const handleExportJSON = () => {
    if (!prediction) return;

    const exportData = {
      timestamp: prediction.timestamp,
      prediction: {
        type: prediction.prediction,
        probability: prediction.probability,
        confidence: getConfidenceLevel(prediction.probability).label,
      },
      geneData: geneData.map((gene) => ({
        gene: gene.gene,
        value: gene.value,
        ranking: gene.ranking,
        widthPercentage: gene.widthPct,
      })),
      summary: {
        totalGenesAnalyzed: geneData.length,
        analysisDate: new Date(prediction.timestamp).toLocaleString(),
        disclaimer: "For research and educational purposes only. Not for clinical diagnosis.",
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const filename = `autism-analysis-${new Date(prediction.timestamp).toISOString().split("T")[0]}.json`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!prediction) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            No Results Available
          </h1>
          <p className="text-neutral-600 mb-8">
            Please upload gene data to receive predictions.
          </p>
          <Button onClick={onUploadNew}>Upload Data</Button>
        </div>
      </div>
    );
  }

  const confidence = getConfidenceLevel(prediction.probability);
  const isAutism = prediction.prediction === "Autism";

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Prediction Results
          </h1>
          <p className="text-neutral-600">
            Analysis completed on {new Date(prediction.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Main Prediction Card */}
        <Card
          variant="elevated"
          className={`mb-8 border-2 ${isAutism
            ? "border-secondary-300 bg-secondary-50"
            : "border-accent-300 bg-accent-50"
            }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                Prediction Result
              </p>
              <h2 className={`text-4xl font-bold ${isAutism
                ? "text-secondary-700"
                : "text-accent-700"
                }`}>
                {prediction.prediction}
              </h2>
            </div>
            {/* <div className={`flex items-center justify-center w-24 h-24 rounded-full font-bold text-white text-3xl ${isAutism
              ? "bg-gradient-to-br from-secondary-400 to-secondary-600"
              : "bg-gradient-to-br from-accent-400 to-accent-600"
              }`}>
              {formatProbability(prediction.probability)}
            </div> */}
          </div>

          <p className={`text-sm ${isAutism
            ? "text-secondary-700"
            : "text-accent-700"
            }`}>
            {isAutism
              ? "Gene expression patterns suggest characteristics associated with autism spectrum."
              : "Gene expression patterns suggest characteristics associated with control group."}
          </p>
        </Card>

        {/* Confidence and Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Confidence */}
          <Card variant="default">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <TrendingUp
                  className={`h-8 w-8 ${confidence.color}`}
                />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Confidence Level</p>
                <p className="text-xl font-bold text-neutral-900">
                  {confidence.label}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {confidence.level === "high" &&
                    "Strong evidence for this prediction"}
                  {confidence.level === "moderate" &&
                    "Moderate evidence for this prediction"}
                  {confidence.level === "low" &&
                    "Results should be considered with caution"}
                </p>
              </div>
            </div>
          </Card>

          {/* Probability Score */}
          <Card variant="default">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Probability Score</p>
                <p className="text-xl font-bold text-neutral-900">
                  {formatProbability(prediction.probability)}
                </p>
                <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                    style={{ width: `${prediction.probability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Gene Expression Visualization */}
        {geneData.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">
              Top Gene Expressions
            </h3>

            <div className="space-y-6">
              {geneData.slice(0, 10).map((gene) => (
                <div key={`${gene.gene}-${gene.ranking}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {gene.gene}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Rank #{gene.ranking}
                      </p>
                    </div>
                    <span className="text-sm font-mono text-neutral-700">
                      {gene.value.toFixed(6)}
                    </span>
                  </div>

                  <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full shadow-md"
                      style={{ width: `${gene.widthPct}%` }}
                      // aria-valuenow={Math.round(gene.widthPct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                    />
                  </div>
                </div>
              ))}
            </div>

            {geneData.length > 10 && (
              <p className="text-sm text-neutral-600 mt-6 pt-6 border-t border-neutral-200">
                Showing top 10 of {geneData.length} analyzed genes
              </p>
            )}
          </Card>
        )}

        {/* Important Information */}
        <Card variant="default" className="mb-8 bg-warning-50 border-warning-200">
          <h3 className="font-bold text-warning-900 mb-2">Important</h3>
          <p className="text-sm text-warning-800">
            These predictions are for research and educational purposes only.
            They should not be used for clinical diagnosis. Please consult with
            qualified healthcare professionals for proper assessment and
            diagnosis.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExportResults}
            className="flex items-center gap-2"
            title="Download results as CSV file"
          >
            <Download size={20} />
            Export Results (CSV)
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExportJSON}
            className="flex items-center gap-2"
            title="Download results as JSON file"
          >
            <Download size={20} />
            Export Results (JSON)
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Share2 size={20} />
            Share Results
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onUploadNew}
            className="flex-1"
          >
            Analyze New Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;