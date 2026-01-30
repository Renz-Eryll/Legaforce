-- CreateEnum
CREATE TYPE "Role" AS ENUM ('APPLICANT', 'EMPLOYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED', 'PROCESSING', 'DEPLOYED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('EMPLOYER_ISSUE', 'AGENCY_ISSUE', 'DEPLOYMENT_DELAY', 'CONTRACT_VIOLATION', 'ABUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ESCALATED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "aiGeneratedCV" JSONB,
    "cvFileUrl" TEXT,
    "trustScore" INTEGER NOT NULL DEFAULT 50,
    "rewardPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDocs" JSONB,
    "trustScore" INTEGER NOT NULL DEFAULT 50,
    "totalHires" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOrder" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "salary" DOUBLE PRECISION,
    "location" TEXT NOT NULL,
    "positions" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "jobOrderId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "aiMatchScore" INTEGER,
    "shortlistedAt" TIMESTAMP(3),
    "interviewedAt" TIMESTAMP(3),
    "selectedAt" TIMESTAMP(3),
    "deployedAt" TIMESTAMP(3),
    "videoInterviewUrl" TEXT,
    "interviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "medicalStatus" "ComplianceStatus" NOT NULL DEFAULT 'PENDING',
    "medicalExpiryDate" TIMESTAMP(3),
    "visaStatus" "ComplianceStatus" NOT NULL DEFAULT 'PENDING',
    "visaExpiryDate" TIMESTAMP(3),
    "oecStatus" "ComplianceStatus" NOT NULL DEFAULT 'PENDING',
    "oecNumber" TEXT,
    "flightDate" TIMESTAMP(3),
    "arrivalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignedAdminId" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerRating" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployerRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantRating" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicantRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_userId_key" ON "Employer"("userId");

-- CreateIndex
CREATE INDEX "Employer_userId_idx" ON "Employer"("userId");

-- CreateIndex
CREATE INDEX "JobOrder_employerId_idx" ON "JobOrder"("employerId");

-- CreateIndex
CREATE INDEX "JobOrder_status_idx" ON "JobOrder"("status");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_jobOrderId_idx" ON "Application"("jobOrderId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_applicationId_key" ON "Deployment"("applicationId");

-- CreateIndex
CREATE INDEX "Deployment_applicationId_idx" ON "Deployment"("applicationId");

-- CreateIndex
CREATE INDEX "Complaint_applicantId_idx" ON "Complaint"("applicantId");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "EmployerRating_employerId_idx" ON "EmployerRating"("employerId");

-- CreateIndex
CREATE INDEX "EmployerRating_applicantId_idx" ON "EmployerRating"("applicantId");

-- CreateIndex
CREATE INDEX "ApplicantRating_applicantId_idx" ON "ApplicantRating"("applicantId");

-- CreateIndex
CREATE INDEX "ApplicantRating_employerId_idx" ON "ApplicantRating"("employerId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_employerId_idx" ON "Invoice"("employerId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOrder" ADD CONSTRAINT "JobOrder_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobOrderId_fkey" FOREIGN KEY ("jobOrderId") REFERENCES "JobOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerRating" ADD CONSTRAINT "EmployerRating_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerRating" ADD CONSTRAINT "EmployerRating_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantRating" ADD CONSTRAINT "ApplicantRating_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantRating" ADD CONSTRAINT "ApplicantRating_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
