/**
 * usePredictor Hook
 * Encapsulates prediction logic: gene parsing, API calls, state management
 * Handles loading states, errors, and gene normalization
 */

import { useState, useCallback } from "react";
import { apiClient } from "../services/api";
import { MAX_GENES, MIN_GENES } from "../services/constants";
import {
  GeneExpression,
  NormalizedGene,
  PredictionResult,
  UploadError,
  UploadStatus,
  UsePredictorReturn,
} from "../types";

/**
 * Custom hook for managing prediction workflow
 * Handles: file parsing, gene validation, API communication, state management
 */
export function usePredictor(): UsePredictorReturn {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);
  const [geneData, setGeneData] = useState<NormalizedGene[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  /**
   * Validate gene expression data
   * Checks for minimum/maximum counts, valid values, etc.
   */
  const validateGenes = useCallback(
    (genes: GeneExpression[]): { valid: boolean; error?: string } => {
      console.log("[Validation] Input genes:", genes.slice(0, 3));

      if (!genes || genes.length === 0) {
        return { valid: false, error: "No gene data provided" };
      }

      if (genes.length < MIN_GENES) {
        return {
          valid: false,
          error: `Please provide at least ${MIN_GENES} gene(s)`,
        };
      }

      if (genes.length > MAX_GENES) {
        return {
          valid: false,
          error: `Maximum ${MAX_GENES} genes allowed`,
        };
      }

      // Validate gene structure
      const invalidGene = genes.find(
        (g) =>
          !g.Gene ||
          typeof g.Value !== "number"
      );

      if (invalidGene) {
        console.error("[Validation] Invalid gene found:", invalidGene);
        return {
          valid: false,
          error: "Invalid gene data structure. Expected Gene and Value columns.",
        };
      }

      console.log("[Validation] All genes valid");
      return { valid: true };
    },
    []
  );

  /**
   * Normalize and sort gene data for visualization
   */
  const normalizeGenes = useCallback((genes: GeneExpression[]): NormalizedGene[] => {
    const normalized = genes
      .map((g) => ({
        gene: g.Gene || "Unknown",
        value: Number(g.Value ?? 0),
      }))
      .filter((g) => Number.isFinite(g.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50) // Keep top 50 for visualization
      .map((g, idx) => ({
        ...g,
        ranking: idx + 1,
        widthPct: 0, // Will be calculated based on max value
      }));

    // Calculate percentage widths
    const maxValue = normalized[0]?.value || 1;
    return normalized.map((g) => ({
      ...g,
      widthPct: Math.max(8, (g.value / maxValue) * 100),
    }));
  }, []);

  /**
   * Main prediction function
   * Orchestrates validation, API call, and state updates
   */
  const predict = useCallback(
    async (genes: GeneExpression[]): Promise<void> => {
      try {
        console.log("[Predict] Starting prediction with", genes.length, "genes");
        setLoading(true);
        setError(null);
        setPrediction(null);
        setUploadStatus("uploading");

        // Validate input
        const validation = validateGenes(genes);
        if (!validation.valid) {
          console.error("[Predict] Validation failed:", validation.error);
          setError({
            code: "VALIDATION_ERROR",
            message: validation.error || "Gene validation failed",
          });
          setUploadStatus("error");
          setLoading(false);
          return;
        }

        // Normalize gene data
        setUploadStatus("parsing");
        console.log("[Predict] Normalizing genes...");
        const normalized = normalizeGenes(genes);
        setGeneData(normalized);
        console.log("[Predict] Normalized", normalized.length, "genes");

        // Call API
        setUploadStatus("predicting");
        console.log("[Predict] Calling API for prediction...");
        const result = await apiClient.predict(genes);
        console.log("[Predict] API result:", result);

        // Update state with prediction result
        setPrediction({
          ...result,
          confidence: result.probability,
        });
        console.log("[Predict] Prediction successful");
        setUploadStatus("success");
      } catch (err: unknown) {
        console.error("[Predict] Error:", err);
        const uploadError: UploadError = {
          code: "PREDICTION_ERROR",
          message: err instanceof Error ? err.message : "Prediction failed",
          details:
            err instanceof Error
              ? err.stack
              : JSON.stringify(err),
        };
        setError(uploadError);
        setUploadStatus("error");
      } finally {
        setLoading(false);
      }
    },
    [validateGenes, normalizeGenes]
  );

  /**
   * Reset all state to initial values
   */
  const reset = useCallback((): void => {
    setPrediction(null);
    setError(null);
    setGeneData([]);
    setUploadStatus("idle");
    setLoading(false);
  }, []);

  return {
    prediction,
    loading,
    error,
    geneData,
    uploadStatus,
    predict,
    reset,
  };
}