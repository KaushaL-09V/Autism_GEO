/**
 * AboutPage Component
 * Information about the tool, methodology, and team
 */

import React from "react";
import { BookOpen, Users, Award, Shield } from "lucide-react";
import Card from "../Common/Card";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            About This Tool
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Understanding the science behind autism characterization through
            gene expression analysis
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-12">
          {/* What Is This */}
          <Card variant="elevated">
            <div className="flex gap-4 mb-4">
              <BookOpen className="h-8 w-8 text-primary-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-neutral-900">
                What is This Tool?
              </h2>
            </div>
            <p className="text-neutral-700 mb-4">
              The Autism Prediction Tool is a machine learning application
              designed to analyze gene expression data and provide insights into
              autism spectrum characteristics. It uses an Artificial Neural
              Network (ANN) trained on comprehensive genomic datasets to identify
              patterns associated with autism spectrum traits.
            </p>
            <p className="text-neutral-700">
              Rather than providing clinical diagnosis, this tool offers a
              research-based assessment that can complement professional
              evaluation and support further investigation of genetic factors in
              autism.
            </p>
          </Card>

          {/* Methodology */}
          <Card variant="elevated">
            <div className="flex gap-4 mb-4">
              <Award className="h-8 w-8 text-secondary-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-neutral-900">Methodology</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              Our model was developed using the following approach:
            </p>
            <ul className="space-y-3 text-neutral-700">
              <li>
                <strong>Data Source:</strong> Analysis of gene expression data
                from diverse populations with varying autism characteristics
              </li>
              <li>
                <strong>Feature Engineering:</strong> Selection of biomarkers
                known to be relevant in autism spectrum research
              </li>
              <li>
                <strong>Model Architecture:</strong> Multi-layer neural network
                with feature scaling and normalization
              </li>
              <li>
                <strong>Validation:</strong> Cross-validated using established
                metrics including accuracy, sensitivity, and specificity
              </li>
              <li>
                <strong>Continuous Improvement:</strong> Regular updates based
                on latest research and feedback
              </li>
            </ul>
          </Card>

          {/* How to Use */}
          <Card variant="elevated">
            <div className="flex gap-4 mb-4">
              <Users className="h-8 w-8 text-accent-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-neutral-900">How to Use</h2>
            </div>
            <div className="space-y-4 text-neutral-700">
              <p>
                Using the tool is straightforward and requires only a few steps:
              </p>
              <ol className="ml-6 space-y-2 list-decimal">
                <li>
                  <strong>Prepare Your Data:</strong> Format your gene expression
                  data as a CSV file with two columns: Gene and Value
                </li>
                <li>
                  <strong>Upload:</strong> Use the upload page to submit your CSV
                  file
                </li>
                <li>
                  <strong>Analysis:</strong> The model will process your data and
                  generate predictions
                </li>
                <li>
                  <strong>Results:</strong> Receive detailed results with
                  confidence scores and visualizations
                </li>
                <li>
                  <strong>Interpretation:</strong> Use results for research or
                  professional consultation
                </li>
              </ol>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card variant="elevated">
            <div className="flex gap-4 mb-4">
              <Shield className="h-8 w-8 text-warning-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Privacy & Security
              </h2>
            </div>
            <ul className="space-y-3 text-neutral-700">
              <li>
                <strong>No Data Storage:</strong> Your data is processed in real-time
                and not permanently stored
              </li>
              <li>
                <strong>Secure Transfer:</strong> All data transmission uses
                industry-standard encryption
              </li>
              <li>
                <strong>Privacy First:</strong> We do not share your data with
                third parties
              </li>
              <li>
                <strong>Anonymized:</strong> Results are not linked to personal
                identifiers
              </li>
              <li>
                <strong>HIPAA Considerations:</strong> While not a medical device,
                we follow privacy best practices
              </li>
            </ul>
          </Card>

          {/* Key Biomarkers */}
          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Key Biomarkers Analyzed
            </h2>
            <p className="text-neutral-700 mb-6">
              The model analyzes expression levels of genes known to be associated
              with autism spectrum characteristics:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { gene: "NLGN1", description: "Neuroligin 1 - synaptic function" },
                { gene: "CNTNAP2", description: "Contactin associated protein" },
                { gene: "PTEN", description: "Tumor suppressor and pathway regulator" },
                { gene: "CHD8", description: "Chromatin remodeling factor" },
                { gene: "GABRB3", description: "GABA receptor subunit" },
                { gene: "SYN1", description: "Synapsin I - neurotransmitter release" },
              ].map(({ gene, description }) => (
                <div
                  key={gene}
                  className="p-4 rounded-lg bg-primary-50 border border-primary-200"
                >
                  <p className="font-semibold text-primary-700">{gene}</p>
                  <p className="text-sm text-neutral-600">{description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Limitations */}
          <Card variant="default" className="bg-warning-50 border-warning-200">
            <h2 className="text-2xl font-bold text-warning-900 mb-4">
              Important Limitations
            </h2>
            <ul className="space-y-2 text-warning-800">
              <li>
                • This tool is <strong>not a diagnostic instrument</strong> and
                should not replace professional clinical evaluation
              </li>
              <li>
                • Predictions are based on gene expression data alone and do not
                account for environmental or behavioral factors
              </li>
              <li>
                • Results may vary based on data quality, processing methods, and
                individual biological variation
              </li>
              <li>
                • The model was trained on specific datasets and may not apply
                equally to all populations
              </li>
              <li>
                • Neurodiversity is normal human variation; autism diagnosis
                should involve comprehensive professional assessment
              </li>
            </ul>
          </Card>

          {/* Contact */}
          <Card variant="elevated" className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-neutral-700 mb-6">
              If you have questions about the tool, methodology, or results,
              please reach out to our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/faq"
                className="inline-block px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium hover:bg-secondary-200 transition-colors"
              >
                View FAQ
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;