// ==================== User Types ====================
export interface User {
  id: string;
  email: string;
  role: "APPLICANT" | "EMPLOYER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  employer?: Employer;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  aiGeneratedCV?: any;
  cvFileUrl?: string;
  trustScore: number;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employer {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  country: string;
  isVerified: boolean;
  verificationDocs?: any;
  trustScore: number;
  totalHires: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Application Types ====================
export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEWED"
  | "SELECTED"
  | "PROCESSING"
  | "DEPLOYED"
  | "REJECTED";

export interface Application {
  id: string;
  applicantId: string;
  jobOrderId: string;
  status: ApplicationStatus;
  aiMatchScore?: number;
  shortlistedAt?: string;
  interviewedAt?: string;
  selectedAt?: string;
  deployedAt?: string;
  videoInterviewUrl?: string;
  interviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  applicant?: Profile;
  jobOrder?: JobOrder;
  deployment?: Deployment;
}

// ==================== Job Types ====================
export type JobStatus = "ACTIVE" | "FILLED" | "CANCELLED" | "EXPIRED";

export interface JobOrder {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requirements: any;
  salary?: number;
  location: string;
  positions: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  employer?: Employer;
  applications?: Application[];
}

// ==================== Deployment Types ====================
export type ComplianceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export interface Deployment {
  id: string;
  applicationId: string;
  medicalStatus: ComplianceStatus;
  medicalExpiryDate?: string;
  visaStatus: ComplianceStatus;
  visaExpiryDate?: string;
  oecStatus: ComplianceStatus;
  oecNumber?: string;
  flightDate?: string;
  arrivalDate?: string;
  createdAt: string;
  updatedAt: string;
  application?: Application;
}

// ==================== Complaint Types ====================
export type ComplaintCategory =
  | "EMPLOYER_ISSUE"
  | "AGENCY_ISSUE"
  | "DEPLOYMENT_DELAY"
  | "CONTRACT_VIOLATION"
  | "ABUSE"
  | "OTHER";

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export interface Complaint {
  id: string;
  applicantId: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  assignedAdminId?: string;
  resolution?: string;
  resolvedAt?: string;
  isAnonymous: boolean;
  escalationLevel: number;
  createdAt: string;
  updatedAt: string;
  applicant?: Profile;
}

// ==================== Rating Types ====================
export interface EmployerRating {
  id: string;
  employerId: string;
  applicantId: string;
  rating: number;
  review?: string;
  createdAt: string;
  employer?: Employer;
}

export interface ApplicantRating {
  id: string;
  applicantId: string;
  employerId: string;
  rating: number;
  review?: string;
  createdAt: string;
  applicant?: Profile;
}

// ==================== Invoice Types ====================
export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Invoice {
  id: string;
  employerId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  lineItems: any;
  createdAt: string;
  updatedAt: string;
  employer?: Employer;
}

// ==================== API Response Types ====================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Form Types ====================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "APPLICANT" | "EMPLOYER";
}

export interface JobOrderFormData {
  title: string;
  description: string;
  requirements: any;
  salary?: number;
  location: string;
  positions: number;
}

export interface ComplaintFormData {
  category: ComplaintCategory;
  description: string;
  isAnonymous: boolean;
}
