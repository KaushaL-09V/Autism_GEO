/**
 * healthcareApi.ts — Centralised Axios client for the Autism Platform API
 *
 * Every component imports from here — never raw axios.
 * Auth: X-User-Id header (integer user.id stored in localStorage after login).
 * Base URL: http://localhost:5000
 */

import axios, { AxiosInstance, AxiosError } from "axios";

// ─── Types ───────────────────────────────────────────────────────
export type UserRole = "patient" | "doctor";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
}

export interface ApiPatient {
  id: number;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  dob: string | null;
  address: string | null;
  guardian_name: string | null;
  diagnosis_date: string | null;
  risk_level: "high" | "medium" | "low" | "unknown";
  clinical_notes: string | null;
  doctor_id: number | null;
  results?: ApiResult[];
  appointments?: ApiAppointment[];
}

export interface ApiAppointment {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  scheduled_at: string;
  duration_min: number;
  status: "scheduled" | "completed" | "cancelled";
  appt_type: string;
  reason: string;
  notes?: string;
}

export interface ApiResult {
  id: number;
  patient_id: number;
  assessment_type: "screening" | "genomic";
  prediction: "Autism" | "Control";
  probability: number;
  raw_label?: string | null;
  feature_data?: Record<string, unknown> | null;
  created_at: string;
}

export interface PredictResponse {
  prediction: "Autism" | "Control";
  probability: number;
  raw_label?: string;
}

// ─── Storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = "autism_predictor_user";

export function getStoredUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: ApiUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Axios instance ───────────────────────────────────────────────
const BASE_URL = "http://localhost:5000";

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  // Inject X-User-Id on every request
  client.interceptors.request.use((config) => {
    const user = getStoredUser();
    if (user?.id) config.headers["X-User-Id"] = String(user.id);
    return config;
  });

  // Normalise error messages
  client.interceptors.response.use(
    (r) => r,
    (err: AxiosError<{ error?: string }>) => {
      const msg =
        err.response?.data?.error ||
        (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK"
          ? "Cannot reach the server. Is the Flask backend running on port 5000?"
          : err.message);
      return Promise.reject(new Error(msg));
    }
  );

  return client;
}

const client = createClient();

// ══════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════
export const authApi = {
  async login(email: string, password: string): Promise<ApiUser> {
    const { data } = await client.post<{ user: ApiUser }>("/api/auth/login", {
      email,
      password,
    });
    setStoredUser(data.user);
    return data.user;
  },

  async signup(
    name: string,
    institution: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<ApiUser> {
    const { data } = await client.post<{ user: ApiUser }>("/api/auth/signup", {
      name,
      email,
      password,
      role,
      institution,
    });
    setStoredUser(data.user);
    return data.user;
  },

  async me(): Promise<ApiUser> {
    const { data } = await client.get<{ user: ApiUser }>("/api/auth/me");
    return data.user;
  },
};

// ══════════════════════════════════════════════════════════════════
// PATIENTS
// ══════════════════════════════════════════════════════════════════
export const patientsApi = {
  async list(): Promise<ApiPatient[]> {
    const { data } = await client.get<{ patients: ApiPatient[] }>("/api/patients");
    return data.patients;
  },

  async get(patientId: number, includeHistory = false): Promise<ApiPatient> {
    const { data } = await client.get<{ patient: ApiPatient }>(
      `/api/patients/${patientId}`,
      { params: { include_history: includeHistory } }
    );
    return data.patient;
  },

  async updateNotes(
    patientId: number,
    notes: string,
    riskLevel?: string
  ): Promise<ApiPatient> {
    const { data } = await client.patch<{ patient: ApiPatient }>(
      `/api/patients/${patientId}/notes`,
      { clinical_notes: notes, ...(riskLevel ? { risk_level: riskLevel } : {}) }
    );
    return data.patient;
  },
};

// ══════════════════════════════════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════════════════════════════════
export const appointmentsApi = {
  async list(): Promise<ApiAppointment[]> {
    const { data } = await client.get<{ appointments: ApiAppointment[] }>(
      "/api/appointments"
    );
    return data.appointments;
  },

  async create(payload: {
    scheduled_at: string;
    duration_min?: number;
    appt_type?: string;
    reason?: string;
    notes?: string;
    doctor_id?: number;
    patient_id?: number;
  }): Promise<ApiAppointment> {
    const { data } = await client.post<{ appointment: ApiAppointment }>(
      "/api/appointments",
      payload
    );
    return data.appointment;
  },
};

// ══════════════════════════════════════════════════════════════════
// RESULTS
// ══════════════════════════════════════════════════════════════════
export const resultsApi = {
  async list(patientId?: number): Promise<ApiResult[]> {
    const { data } = await client.get<{ results: ApiResult[] }>("/api/results", {
      params: patientId ? { patient_id: patientId } : {},
    });
    return data.results;
  },

  async save(payload: {
    prediction: string;
    probability: number;
    assessment_type: "screening" | "genomic";
    raw_label?: string | null;
    feature_data?: Record<string, unknown> | null;
    patient_id?: number;
  }): Promise<ApiResult> {
    const { data } = await client.post<{ result: ApiResult }>(
      "/api/results",
      payload
    );
    return data.result;
  },
};

// ══════════════════════════════════════════════════════════════════
// PREDICTIONS (ML models)
// ══════════════════════════════════════════════════════════════════
export const predictApi = {
  /** Genomic CSV → send as raw text in JSON body */
  async genomicCsv(csvText: string): Promise<PredictResponse> {
    const { data } = await client.post<{
      success: boolean;
      data: { prediction: string; probability: number };
    }>("/predict", { csv: csvText });
    if (!data.success) throw new Error("Prediction failed");
    return {
      prediction: data.data.prediction as "Autism" | "Control",
      probability: data.data.probability,
    };
  },

  /** Genomic CSV → multipart file upload */
  async genomicFile(file: File): Promise<PredictResponse> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await client.post<{
      success: boolean;
      data: { prediction: string; probability: number };
    }>("/predict/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!data.success) throw new Error("Prediction failed");
    return {
      prediction: data.data.prediction as "Autism" | "Control",
      probability: data.data.probability,
    };
  },

  /** Behavioral screening JSON payload */
  async screening(payload: Record<string, unknown>): Promise<PredictResponse> {
    const { data } = await client.post<{
      success: boolean;
      data: { prediction: string; probability: number; raw_label?: string };
    }>("/predict/screening", payload);
    if (!data.success) throw new Error("Screening prediction failed");
    return {
      prediction: data.data.prediction as "Autism" | "Control",
      probability: data.data.probability,
      raw_label: data.data.raw_label,
    };
  },
};

// ══════════════════════════════════════════════════════════════════
// Combined default export for convenience
// ══════════════════════════════════════════════════════════════════
const healthcareApi = {
  auth: authApi,
  patients: patientsApi,
  appointments: appointmentsApi,
  results: resultsApi,
  predict: predictApi,
};

export default healthcareApi;
