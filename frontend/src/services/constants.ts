/**
 * Application Constants
 * Centralized configuration for the entire application
 */

// ============================================================================
// API Configuration
// ============================================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// ============================================================================
// Upload Configuration
// ============================================================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ["text/csv", ".csv"];
export const MAX_GENES = 100000;
export const MIN_GENES = 1;

// ============================================================================
// Navigation Routes
// ============================================================================

export const ROUTES = {
  HOME: "/",
  UPLOAD: "/upload",
  RESULTS: "/results",
  ABOUT: "/about",
  FAQ: "/faq",
  CONTACT: "/contact",
} as const;

// ============================================================================
// Navigation Items
// ============================================================================

export const MAIN_NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    href: ROUTES.HOME,
    description: "Return to home",
  },
  {
    id: "upload",
    label: "Upload",
    href: ROUTES.UPLOAD,
    description: "Upload gene expression data",
  },
  {
    id: "about",
    label: "About",
    href: ROUTES.ABOUT,
    description: "Learn about the tool",
  },
  {
    id: "faq",
    label: "FAQ",
    href: ROUTES.FAQ,
    description: "Frequently asked questions",
  },
  {
    id: "contact",
    label: "Contact",
    href: ROUTES.CONTACT,
    description: "Get in touch",
  },
];

// ============================================================================
// Color Palette (mapped from tailwind.config.js)
// ============================================================================

export const COLORS = {
  primary: "#4a9b8e",
  primaryLight: "#9ad5d0",
  primaryDark: "#275550",
  secondary: "#5b8dbe",
  secondaryLight: "#9fbce3",
  secondaryDark: "#344f7f",
  accent: "#7ba98e",
  accentLight: "#a8b9a8",
  accentDark: "#476553",
  success: "#6b8e23",
  warning: "#c9844e",
  error: "#a96b5a",
  neutral100: "#f9f9f7",
  neutral200: "#e8e8e5",
  neutral600: "#7a7470",
  neutral900: "#1a1310",
} as const;

// ============================================================================
// Animation Durations
// ============================================================================

export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 600,
  VERY_SLOW: 1000,
} as const;

// ============================================================================
// Messages & Text
// ============================================================================

export const MESSAGES = {
  UPLOAD: {
    WELCOME: "Upload your gene expression data to begin prediction",
    UPLOADING: "Uploading file...",
    PARSING: "Parsing CSV data...",
    PREDICTING: "Running prediction model...",
    SUCCESS: "Prediction complete!",
    ERROR: "An error occurred during prediction",
    FILE_REQUIRED: "Please select a CSV file",
    FILE_TOO_LARGE: "File size exceeds 10MB limit",
    FILE_INVALID: "Invalid file format. Please upload a CSV file.",
  },
  PREDICTION: {
    AUTISM_DETECTED: "Prediction suggests potential autism spectrum characteristics",
    CONTROL_DETECTED: "Prediction suggests control group characteristics",
    HIGH_CONFIDENCE: "High confidence prediction",
    MODERATE_CONFIDENCE: "Moderate confidence prediction",
    LOW_CONFIDENCE: "Lower confidence prediction",
  },
  ERROR: {
    NETWORK: "Network connection error. Please check your internet.",
    SERVER: "Server error. Please try again later.",
    INVALID_DATA: "Invalid data format. Please check your CSV file.",
    UNKNOWN: "An unexpected error occurred.",
  },
  SUCCESS: {
    DEFAULT: "Operation completed successfully",
  },
} as const;

// ============================================================================
// Local Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  PREDICTION_HISTORY: "app_prediction_history",
  USER_PREFERENCES: "app_user_preferences",
  LAST_PREDICTION: "app_last_prediction",
  APP_THEME: "app_theme",
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURES = {
  ENABLE_HISTORY: true,
  ENABLE_EXPORT: true,
  ENABLE_BATCH_UPLOAD: false,
  ENABLE_DARK_MODE: true,
} as const;

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  TIMEOUT_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
} as const;

// ============================================================================
// Environmental Checks
// ============================================================================

export const isDevelopment = import.meta.env.MODE === "development";
export const isProduction = import.meta.env.MODE === "production";