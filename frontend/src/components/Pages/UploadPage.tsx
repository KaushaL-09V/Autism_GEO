/**
 * UploadPage Component
 * CSV file upload interface with drag-and-drop support
 */

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import Papa from "papaparse";
import Button from "../Common/Button";
import Card from "../Common/Card";
import LoadingSpinner from "../Common/LoadingSpinner";
import { GeneExpression, UploadError, UploadStatus, NormalizedGene } from "../../types";
import { MAX_FILE_SIZE } from "../../services/constants";
import { formatFileSize } from "../../lib/cn.ts";

interface UploadPageProps {
  onPredictionComplete?: () => void;
  predict?: (genes: GeneExpression[]) => Promise<void>;
  error?: UploadError | null;
  uploadStatus?: UploadStatus;
  geneData?: NormalizedGene[];
}

const UploadPage: React.FC<UploadPageProps> = ({
  onPredictionComplete,
  predict: externalPredict,
  error: externalError,
  uploadStatus: externalUploadStatus,
  geneData: externalGeneData
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<UploadError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use external props if provided, otherwise fallback to local state
  const error = externalError || localError;
  const uploadStatus = externalUploadStatus || "idle";
  const geneData = externalGeneData || [];
  const predict = externalPredict;

  /**
   * Parse CSV file and extract gene data
   */
  const parseCSVFile = (file: File): Promise<GeneExpression[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false, // Keep as strings for now
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error(result.errors[0].message));
            return;
          }
          // Convert Value to number and filter invalid rows
          const genes = (result.data as any[]).map((row) => ({
            Gene: row.Gene?.trim() || "",
            Value: parseFloat(row.Value) || 0,
          })).filter((g) => g.Gene && !isNaN(g.Value));

          if (genes.length === 0) {
            reject(new Error("No valid gene data found in CSV"));
            return;
          }
          resolve(genes as GeneExpression[]);
        },
        error: (err) => reject(err),
      });
    });
  };

  /**
   * Handle file selection and prediction
   */
  const handleFile = async (file: File) => {
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`
      );
    }

    if (!file.name.endsWith(".csv")) {
      throw new Error(
        "Invalid file format. Please upload a CSV file."
      );
    }

    setSelectedFile(file);

    // Parse and predict
    try {
      const genes = await parseCSVFile(file);
      if (predict) {
        await predict(genes);
        onPredictionComplete?.();
      } else {
        throw new Error("Prediction function not available");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse file";
      setLocalError({
        code: "PARSE_ERROR",
        message: message,
      });
      throw new Error(message);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      try {
        await handleFile(files[0]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      }
    }
  };

  const handleFileInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await handleFile(e.target.files[0]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Upload Gene Data
          </h1>
          <p className="text-lg text-neutral-600">
            Click to upload or drag and drop your CSV file here
          </p>
        </div>

        {/* Upload Area */}
        {uploadStatus === "idle" || !selectedFile ? (
          <Card
            variant="outlined"
            className={`mb-8 cursor-pointer transition-all ${dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-neutral-300"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center py-12">
              <Upload
                size={48}
                className={`mb-4 transition-colors ${dragActive
                  ? "text-primary-600"
                  : "text-neutral-400"
                  }`}
              />
              <p className="mb-2 text-lg font-semibold text-neutral-900">
                Upload your CSV file
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                Required columns: Gene, Value
              </p>
              <Button variant="secondary" size="sm">
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                aria-label="Select CSV file"
              />
            </div>
          </Card>
        ) : null}

        {/* Status Messages */}
        {error && (
          <Card variant="default" className="mb-8 border-error-300 bg-error-50">
            <div className="flex gap-4">
              <AlertCircle
                className="h-6 w-6 flex-shrink-0 text-error-600"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-bold text-error-900">{error.code}</h3>
                <p className="text-sm text-error-800">{error.message}</p>
              </div>
            </div>
          </Card>
        )}

        {uploadStatus === "uploading" && (
          <Card className="mb-8">
            <LoadingSpinner label="Uploading file..." size="md" />
          </Card>
        )}

        {uploadStatus === "parsing" && (
          <Card className="mb-8">
            <LoadingSpinner label="Parsing CSV data..." size="md" />
          </Card>
        )}

        {uploadStatus === "predicting" && (
          <Card className="mb-8">
            <LoadingSpinner label="Running prediction model..." size="md" />
          </Card>
        )}

        {uploadStatus === "success" && geneData.length > 0 && (
          <>
            <Card variant="elevated" className="mb-8 border-success-300 bg-success-50">
              <div className="flex gap-4">
                <CheckCircle
                  className="h-6 w-6 flex-shrink-0 text-success-600"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-bold text-success-900">File uploaded successfully</h3>
                  <p className="text-sm text-success-800 mt-1">
                    {geneData.length} genes found and processed
                  </p>
                </div>
              </div>
            </Card>

            {/* Gene Data Preview */}
            <Card className="mb-8">
              <h3 className="font-bold text-neutral-900 mb-4">Top Genes</h3>
              <div className="space-y-4">
                {geneData.slice(0, 5).map((gene) => (
                  <div key={`${gene.gene}-${gene.ranking}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900">
                        {gene.gene}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {gene.value.toFixed(4)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                        style={{ width: `${gene.widthPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {geneData.length > 5 && (
                <p className="text-sm text-neutral-600 mt-4">
                  ... and {geneData.length - 5} more genes
                </p>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  setSelectedFile(null);
                  fileInputRef.current?.click();
                }}
              >
                Upload Another File
              </Button>
            </div>
          </>
        )}

        {/* Info Card */}
        <Card variant="default" className="mt-8 bg-accent-50 border-accent-200">
          <h3 className="font-bold text-accent-900 mb-2">CSV Format Guide</h3>
          <p className="text-sm text-accent-800 mb-4">
            Your CSV file must contain two columns:
          </p>
          <ul className="text-sm text-accent-800 space-y-2">
            <li>
              <strong>Gene:</strong> Gene name or identifier
            </li>
            <li>
              <strong>Value:</strong> Expression value (numeric)
            </li>
          </ul>
          <p className="text-xs text-accent-700 mt-4">
            Example: <code>NLGN1,0.85</code>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;