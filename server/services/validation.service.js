import { z } from "zod";

export const jobApplicationSchema = z.object({
  jobId: z.string().uuid("Invalid job ID").optional(),
  coverLetter: z.string().optional(),
  expectedSalary: z.number().positive().optional(),
}).passthrough(); // allows other fields just in case MVP logic relies on it

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[0-9\s-]+$/, "Invalid phone number").optional(),
  nationality: z.string().optional(),
  highestEducation: z.string().optional(),
  yearsExperience: z.number().nonnegative().optional(),
}).passthrough();

export const jobOrderSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(10000),
  location: z.string().min(2),
  salary: z.number().positive().optional(),
  positions: z.number().int().positive().optional(),
}).passthrough();

export const complaintUpdateSchema = z.object({
  status: z.enum(["SUBMITTED", "UNDER_REVIEW", "ESCALATED", "RESOLVED", "CLOSED", "open", "OPEN", "pending", "PENDING"]).optional(),
  assignedAdminId: z.string().optional(),
  resolution: z.string().optional(),
}).passthrough();

export const deploymentUpdateSchema = z.object({
  medicalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  visaStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  oecStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
}).passthrough();

// ── Auth ──

const emailField = z.string().trim().email("Invalid email address");

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: emailField,
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.enum(["APPLICANT", "EMPLOYER"], { message: "Role must be APPLICANT or EMPLOYER" }),
});

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: emailField,
  otp: z.string().trim().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: emailField,
});
