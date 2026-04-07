/**
 * API Service Layer
 * Handles all communication with the Flask backend
 * Provides type-safe abstractions for prediction requests
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import {
    GeneExpression,
    PredictionResponse,
    PredictionResult,
    UploadError,
    // APIOptions,
} from "../types";
import { API_BASE_URL, API_TIMEOUT, MAX_RETRIES } from "./constants";

class APIClient {
    private client: AxiosInstance;
    // private retries: number = MAX_RETRIES;

    constructor(baseURL: string = API_BASE_URL) {
        this.client = axios.create({
            baseURL,
            timeout: API_TIMEOUT,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(this.handleError(error))
        );
    }

    /**
     * Make a prediction based on gene expression data
     * @param genes - Array of gene expression data with Gene name and Value
     * @returns Prediction result with probability and prediction type
     */
    async predict(genes: GeneExpression[]): Promise<PredictionResult> {
        try {
            // Validate input
            if (!Array.isArray(genes) || genes.length === 0) {
                throw new Error("Invalid gene data: must provide at least one gene");
            }

            // Prepare CSV format for backend
            const csvData = this.convertToCSV(genes);
            console.log("[API] Sending CSV data:", csvData.slice(0, 200) + "...");

            const response = await this.client.post<PredictionResponse>(
                "/predict",
                { csv: csvData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[API] Response:", response.data);

            if (!response.data.success) {
                throw new Error(response.data.error || "Prediction failed");
            }

            return {
                ...response.data.data,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error("[API] Error:", error);
            throw this.handleError(error);
        }
    }

    /**
     * Health check for API connectivity
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get("/health", { timeout: 5000 });
            return response.status === 200;
        } catch {
            return false;
        }
    }

    /**
     * Convert gene expression array to CSV format
     * Backend expects: Gene,Value\ngene1,value1\ngene2,value2...
     */
    private convertToCSV(genes: GeneExpression[]): string {
        const header = "Gene,Value";
        const rows = genes
            .map((g) => `${g.Gene || "Unknown"},"${g.Value ?? 0}"`)
            .join("\n");
        return `${header}\n${rows}`;
    }

    /**
     * Centralized error handling
     */
    private handleError(error: unknown): UploadError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error?: string }>;

            // Network error
            if (!axiosError.response) {
                return {
                    code: "NETWORK_ERROR",
                    message: "Unable to connect to prediction service. Please check your internet connection.",
                    details: axiosError.message,
                };
            }

            // Server error response
            const status = axiosError.response.status;
            const errorMessage = axiosError.response.data?.error || "An error occurred";

            if (status === 400) {
                return {
                    code: "INVALID_DATA",
                    message: "Invalid gene data format. Please check your CSV file.",
                    details: errorMessage,
                };
            }

            if (status === 422) {
                return {
                    code: "VALIDATION_ERROR",
                    message: "Gene data validation failed. Please verify your data.",
                    details: errorMessage,
                };
            }

            if (status >= 500) {
                return {
                    code: "SERVER_ERROR",
                    message: "Server error. Please try again later.",
                    details: errorMessage,
                };
            }

            return {
                code: "API_ERROR",
                message: "An unexpected error occurred.",
                details: errorMessage,
            };
        }

        // Generic error
        return {
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred. Please try again.",
            details:
                error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Export singleton instance
export const apiClient = new APIClient();

/**
 * Utility function to make predictions with automatic retry logic
 */
export async function predictWithRetry(
    genes: GeneExpression[],
    maxRetries: number = MAX_RETRIES
): Promise<PredictionResult> {
    let lastError: UploadError | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiClient.predict(genes);
        } catch (error) {
            if (error && typeof error === "object" && "code" in error) {
                lastError = error as UploadError;
            } else {
                lastError = {
                    code: "UNKNOWN_ERROR",
                    message: "Unexpected error occurred",
                    details: String(error),
                };
            }
        }
    }

    if (lastError) throw lastError;

    throw {
        code: "UNKNOWN_ERROR",
        message: "Prediction failed",
        details: "",
    };
}

// ✅ MUST be outside everything
export default apiClient;