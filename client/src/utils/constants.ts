export const APP_NAME = "Legaforce";
export const APP_DESCRIPTION = "Philippine Recruitment Automation Platform";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ==================== Routes ====================
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  APPLICANTS: "/applicants",
  EMPLOYERS: "/employers",
  SERVICES: "/services",
  ABOUT: "/about",

  // Applicant Routes
  APPLICANT_DASHBOARD: "/app/dashboard",
  APPLICANT_JOBS: "/app/jobs",
  APPLICANT_APPLICATIONS: "/app/applications",
  APPLICANT_APPLICATION_DETAILS: "/app/applications/:id",
  APPLICANT_SAVED_JOBS: "/app/saved-jobs",
  APPLICANT_PROFILE: "/app/profile",
  APPLICANT_DOCUMENTS: "/app/documents",
  APPLICANT_CV_BUILDER: "/app/cv-builder",
  APPLICANT_REWARDS: "/app/rewards",
  APPLICANT_SUPPORT: "/app/support",
  APPLICANT_COMPLAINTS: "/app/complaints",
  APPLICANT_SETTINGS: "/app/settings",

  // Employer Routes
  EMPLOYER_DASHBOARD: "/employer/dashboard",
  EMPLOYER_JOB_ORDERS: "/employer/job-orders",
  EMPLOYER_JOB_ORDER_DETAILS: "/employer/job-orders/:id",
  EMPLOYER_CANDIDATES: "/employer/candidates",
  EMPLOYER_INTERVIEWS: "/employer/interviews",
  EMPLOYER_DEPLOYMENTS: "/employer/deployments",
  EMPLOYER_INVOICES: "/employer/invoices",
  EMPLOYER_REPORTS: "/employer/reports",
  EMPLOYER_PROFILE: "/employer/profile",
  EMPLOYER_SUPPORT: "/employer/support",
  EMPLOYER_SETTINGS: "/employer/settings",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_APPLICANTS: "/admin/applicants",
  ADMIN_EMPLOYERS: "/admin/employers",
  ADMIN_JOB_ORDERS: "/admin/job-orders",
  ADMIN_APPLICATIONS: "/admin/applications",
  ADMIN_DEPLOYMENTS: "/admin/deployments",
  ADMIN_COMPLIANCE: "/admin/compliance",
  ADMIN_INVOICES: "/admin/invoices",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_COMPLAINTS: "/admin/complaints",
  ADMIN_VERIFICATION: "/admin/verification",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

// ==================== Status Configurations ====================
export const STATUS_CONFIG = {
  // Application Statuses
  APPLIED: {
    label: "Applied",
    className: "status-applied",
    color: "blue",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "status-shortlisted",
    color: "amber",
  },
  INTERVIEWED: {
    label: "Interviewed",
    className: "status-interviewed",
    color: "purple",
  },
  SELECTED: {
    label: "Selected",
    className: "status-selected",
    color: "emerald",
  },
  PROCESSING: {
    label: "Processing",
    className: "status-processing",
    color: "orange",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "status-deployed",
    color: "green",
  },
  REJECTED: {
    label: "Rejected",
    className: "status-rejected",
    color: "red",
  },

  // Job Statuses
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    color: "emerald",
  },
  FILLED: {
    label: "Filled",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    color: "blue",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    color: "red",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    color: "gray",
  },

  // Complaint Statuses
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    color: "blue",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    color: "amber",
  },
  ESCALATED: {
    label: "Escalated",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    color: "red",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    color: "emerald",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    color: "gray",
  },
} as const;

// ==================== Complaint Categories ====================
export const COMPLAINT_CATEGORIES = {
  EMPLOYER_ISSUE: { label: "Employer Issue", icon: "Building2" },
  AGENCY_ISSUE: { label: "Agency Issue", icon: "Shield" },
  DEPLOYMENT_DELAY: { label: "Deployment Delay", icon: "Clock" },
  CONTRACT_VIOLATION: { label: "Contract Violation", icon: "FileText" },
  ABUSE: { label: "Abuse", icon: "AlertTriangle" },
  OTHER: { label: "Other", icon: "HelpCircle" },
} as const;

// ==================== Pagination ====================
export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  JOBS: 12,
  APPLICATIONS: 20,
  CANDIDATES: 15,
  COMPLAINTS: 10,
} as const;

// ==================== Date Formats ====================
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy hh:mm a",
  INPUT: "yyyy-MM-dd",
  API: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// ==================== Validation Rules ====================
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_MIN_LENGTH: 10,
  CV_MAX_SIZE_MB: 5,
  DOCUMENT_MAX_SIZE_MB: 10,
  IMAGE_MAX_SIZE_MB: 2,
} as const;

// ==================== File Types ====================
export const ALLOWED_FILE_TYPES = {
  CV: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  IMAGE: ["image/jpeg", "image/png", "image/jpg"],
  DOCUMENT: ["application/pdf", "image/jpeg", "image/png"],
} as const;

// ==================== Local Storage Keys ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  THEME: "theme",
  LANGUAGE: "language",
  AUTH_STORAGE: "auth-storage",
} as const;

// ==================== API Endpoints ====================
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/sign-in",
  AUTH_REGISTER: "/auth/sign-up",
  AUTH_LOGOUT: "/auth/sign-out",
  AUTH_ME: "/auth/me",
  AUTH_REFRESH: "/auth/refresh",

  // Applicants
  APPLICANT_PROFILE: "/applicants/profile",
  APPLICANT_CV: "/applicants/cv",
  APPLICANT_APPLICATIONS: "/applicants/applications",

  // Employers
  EMPLOYER_PROFILE: "/employers/profile",
  EMPLOYER_JOB_ORDERS: "/employers/job-orders",
  EMPLOYER_CANDIDATES: "/employers/candidates",

  // Jobs
  JOBS: "/jobs",
  JOB_APPLY: "/jobs/:id/apply",

  // Applications
  APPLICATIONS: "/applications",
  APPLICATION_UPDATE_STATUS: "/applications/:id/status",

  // Admin
  ADMIN_STATS: "/admin/stats",
  ADMIN_USERS: "/admin/users",
  ADMIN_COMPLAINTS: "/admin/complaints",
} as const;

// ==================== Error Messages ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
} as const;

// ==================== Success Messages ====================
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  REGISTER: "Registration successful!",
  LOGOUT: "Logged out successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  APPLICATION_SUBMITTED: "Application submitted successfully",
  JOB_POSTED: "Job order posted successfully",
  COMPLAINT_SUBMITTED: "Complaint submitted successfully",
} as const;
