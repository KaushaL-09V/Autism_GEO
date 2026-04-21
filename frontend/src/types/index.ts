/**
 * Type definitions for the Autism Prediction Tool
 * Centralized interfaces for API responses, form data, and application state
 */

// ============================================================================
// API Response Types
// ============================================================================

export interface PredictionResult {
  prediction: "Autism" | "Control";
  probability: number;
  confidence: number;
  timestamp: string;
}

export interface PredictionResponse {
  success: boolean;
  data: PredictionResult;
  message?: string;
  error?: string;
}

export interface ScreeningPayload {
  A1: number;
  A2: number;
  A3: number;
  A4: number;
  A5: number;
  A6: number;
  A7: number;
  A8: number;
  A9: number;
  A10_Autism_Spectrum_Quotient: number;
  Age_Years: number;
  Sex: string;
  Ethnicity: string;
  Jaundice: string;
  Family_mem_with_ASD: string;
  Who_completed_the_test: string;
}

export interface ScreeningPredictionResponse {
  success: boolean;
  data: {
    prediction: "Autism" | "Control";
    probability: number;
    raw_label?: string;
  };
  error?: string;
}

// ============================================================================
// Gene Data Types
// ============================================================================

export interface GeneExpression {
  Gene: string;
  Value: number;
}

export interface NormalizedGene {
  gene: string;
  value: number;
  widthPct?: number;
  ranking?: number;
}

export interface GeneDataset {
  genes: NormalizedGene[];
  total: number;
  maxValue: number;
  minValue: number;
}

// ============================================================================
// Prediction Context Types
// ============================================================================

export interface PredictionRequest {
  genes: GeneExpression[];
  sampleId?: string;
  timestamp?: string;
}

export interface PredictionHistory {
  id: string;
  timestamp: string;
  sampleId: string;
  geneCount: number;
  prediction: "Autism" | "Control";
  probability: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export type UploadStatus = "idle" | "uploading" | "parsing" | "predicting" | "success" | "error";

export interface UploadError {
  code: string;
  message: string;
  details?: string;
}

export interface AppState {
  currentPage: "home" | "upload" | "results" | "about" | "faq" | "contact";
  isLoading: boolean;
  prediction: PredictionResult | null;
  geneData: NormalizedGene[];
  error: UploadError | null;
  uploadStatus: UploadStatus;
  history: PredictionHistory[];
}

// ============================================================================
// FAQ & Knowledge Base Types
// ============================================================================

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedTopics?: string[];
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  sources?: string[];
  lastUpdated: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UsePredictorReturn {
  prediction: PredictionResult | null;
  loading: boolean;
  error: UploadError | null;
  geneData: NormalizedGene[];
  uploadStatus: UploadStatus;
  predict: (genes: GeneExpression[]) => Promise<void>;
  reset: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  setValues: (values: T) => void;
  resetForm: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type APIMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface APIOptions {
  method?: APIMethod;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}