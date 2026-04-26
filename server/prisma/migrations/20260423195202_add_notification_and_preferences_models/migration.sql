-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION_STATUS', 'JOB_RECOMMENDATION', 'OFFER', 'MESSAGE', 'SYSTEM', 'DEPLOYMENT');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('MEDICAL', 'VISA', 'OEC', 'FLIGHT', 'CONTRACT', 'OTHER');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "profileViews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "relatedId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "emailNotif" BOOLEAN NOT NULL DEFAULT true,
    "pushNotif" BOOLEAN NOT NULL DEFAULT true,
    "smsNotif" BOOLEAN NOT NULL DEFAULT false,
    "applicationStatus" BOOLEAN NOT NULL DEFAULT true,
    "jobRecommendation" BOOLEAN NOT NULL DEFAULT true,
    "offers" BOOLEAN NOT NULL DEFAULT true,
    "messages" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentDocument" (
    "id" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileKey" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeploymentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_profileId_idx" ON "Notification"("profileId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_profileId_key" ON "NotificationPreference"("profileId");

-- CreateIndex
CREATE INDEX "NotificationPreference_profileId_idx" ON "NotificationPreference"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "PlatformSetting_key_idx" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "DeploymentDocument_deploymentId_idx" ON "DeploymentDocument"("deploymentId");

-- CreateIndex
CREATE INDEX "DeploymentDocument_category_idx" ON "DeploymentDocument"("category");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentDocument" ADD CONSTRAINT "DeploymentDocument_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
