/**
 * Seed Script — Legaforce
 *
 * Creates demo accounts for all 3 portals:
 *   - admin@legaforce.com   (ADMIN)
 *   - employer@legaforce.com (EMPLOYER)
 *   - applicant@legaforce.com (APPLICANT)
 *
 * Also creates sample job orders and data.
 *
 * Run: npm run prisma:seed
 */
import prisma from "../config/database.js";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD = "Demo@12345";

async function main() {
  console.log("🌱 Seeding Legaforce database...\n");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ── 1. Admin account ─────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@legaforce.com" },
    update: {},
    create: {
      email: "admin@legaforce.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
      isEmailVerified: true,
    },
  });
  console.log(` Admin:      admin@legaforce.com / ${DEMO_PASSWORD}`);

  // ── 2. Employer account ──────────────────────
  const employerUser = await prisma.user.upsert({
    where: { email: "employer@legaforce.com" },
    update: {},
    create: {
      email: "employer@legaforce.com",
      password: hashedPassword,
      role: "EMPLOYER",
      isActive: true,
      isEmailVerified: true,
    },
  });

  const employer = await prisma.employer.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: "Al Haramain Healthcare Group",
      contactPerson: "Ahmed Al-Rashid",
      phone: "+966 50 123 4567",
      country: "Saudi Arabia",
      isVerified: true,
      trustScore: 85,
      totalHires: 12,
      verificationDocs: [
        { name: "Business License", status: "approved", uploadedAt: new Date().toISOString() },
        { name: "Trade Registration", status: "approved", uploadedAt: new Date().toISOString() },
      ],
    },
  });
  console.log(` Employer:   employer@legaforce.com / ${DEMO_PASSWORD}`);

  // ── 3. Applicant account ─────────────────────
  const applicantUser = await prisma.user.upsert({
    where: { email: "applicant@legaforce.com" },
    update: {},
    create: {
      email: "applicant@legaforce.com",
      password: hashedPassword,
      role: "APPLICANT",
      isActive: true,
      isEmailVerified: true,
    },
  });

  const applicant = await prisma.profile.upsert({
    where: { userId: applicantUser.id },
    update: {},
    create: {
      userId: applicantUser.id,
      firstName: "Maria",
      lastName: "Santos",
      phone: "+63 917 123 4567",
      nationality: "Filipino",
      dateOfBirth: new Date("1995-03-15"),
      trustScore: 72,
      rewardPoints: 450,
      aiGeneratedCV: {
        personalInfo: {
          fullName: "Maria Santos",
          email: "applicant@legaforce.com",
          phone: "+63 917 123 4567",
          location: "Manila, Philippines",
          bio: "Dedicated registered nurse with 5 years of hospital experience.",
        },
        experience: [
          {
            id: "exp-1",
            position: "Registered Nurse",
            company: "Philippine General Hospital",
            employer: "Philippine General Hospital",
            startDate: "2019-06",
            endDate: "2024-12",
            description: "Provided direct patient care in the medical-surgical ward. Managed medication administration and patient assessments.",
          },
          {
            id: "exp-2",
            position: "Staff Nurse",
            company: "St. Luke's Medical Center",
            employer: "St. Luke's Medical Center",
            startDate: "2017-01",
            endDate: "2019-05",
            description: "Worked in the emergency department handling trauma cases and triage.",
          },
        ],
        education: [
          {
            id: "edu-1",
            degree: "Bachelor of Science in Nursing",
            institution: "University of the Philippines Manila",
            school: "University of the Philippines Manila",
            year: "2017",
          },
        ],
        skills: ["Patient Care", "IV Therapy", "Wound Care", "ECG Monitoring", "BLS/ACLS", "Medication Administration"],
        certifications: [
          { id: "cert-1", name: "Philippine Nursing License (PRC)", issuer: "PRC", year: "2017" },
          { id: "cert-2", name: "BLS/ACLS Certified", issuer: "AHA", year: "2023" },
        ],
        skillTags: ["Patient Care", "IV Therapy", "Wound Care", "ECG Monitoring", "BLS/ACLS", "Medication Administration", "Philippine Nursing License (PRC)", "BLS/ACLS Certified"],
        cvSummary: "Maria Santos is a dedicated registered nurse with 7 years of clinical experience in both medical-surgical and emergency departments at leading Philippine hospitals.",
        profileReady: true,
        generatedAt: new Date().toISOString(),
      },
    },
  });
  console.log(` Applicant:  applicant@legaforce.com / ${DEMO_PASSWORD}`);

  // ── 4. Sample Job Orders ─────────────────────
  const jobOrder1 = await prisma.jobOrder.upsert({
    where: { id: "seed-job-001" },
    update: {},
    create: {
      id: "seed-job-001",
      employerId: employer.id,
      title: "Registered Nurse — ICU",
      description: "We are looking for experienced ICU nurses to join our critical care team at a leading hospital in Riyadh, Saudi Arabia. The successful candidate will provide specialized nursing care to critically ill patients.\n\nResponsibilities:\n- Monitor and assess patients in the ICU\n- Administer medications and treatments\n- Operate ventilators and other life-support equipment\n- Collaborate with physicians and healthcare team\n- Document patient care accurately",
      requirements: {
        skills: ["ICU", "Critical Care", "Ventilators", "BLS/ACLS", "Patient Monitoring"],
        experience: "3+ years ICU experience",
        education: "BSN required",
      },
      salary: 5000,
      location: "Riyadh, Saudi Arabia",
      positions: 5,
      status: "ACTIVE",
    },
  });

  const jobOrder2 = await prisma.jobOrder.upsert({
    where: { id: "seed-job-002" },
    update: {},
    create: {
      id: "seed-job-002",
      employerId: employer.id,
      title: "Staff Nurse — Medical Ward",
      description: "Join our medical ward team at a prestigious hospital in Dubai. We offer competitive salary, accommodation, and benefits.\n\nRequirements:\n- Valid nursing license\n- Minimum 2 years experience\n- Good English communication skills",
      requirements: {
        skills: ["Patient Care", "Medication Administration", "Wound Care", "Documentation"],
        experience: "2+ years",
        education: "BSN required",
      },
      salary: 3500,
      location: "Dubai, UAE",
      positions: 10,
      status: "ACTIVE",
    },
  });

  const jobOrder3 = await prisma.jobOrder.upsert({
    where: { id: "seed-job-003" },
    update: {},
    create: {
      id: "seed-job-003",
      employerId: employer.id,
      title: "Operating Room Nurse",
      description: "Experienced OR nurses needed for a state-of-the-art surgical center in Doha, Qatar.\n\nResponsibilities:\n- Assist surgeons during procedures\n- Prepare operating room and instruments\n- Monitor patient vital signs during surgery\n- Maintain sterile environment",
      requirements: {
        skills: ["OR Nursing", "Surgical Assistance", "Sterilization", "Patient Monitoring", "BLS/ACLS"],
        experience: "3+ years OR experience",
        education: "BSN required",
      },
      salary: 4500,
      location: "Doha, Qatar",
      positions: 3,
      status: "ACTIVE",
    },
  });

  console.log(` Created 3 sample job orders`);

  // ── 5. Sample Application ────────────────────
  const application = await prisma.application.upsert({
    where: { id: "seed-app-001" },
    update: {},
    create: {
      id: "seed-app-001",
      applicantId: applicant.id,
      jobOrderId: jobOrder2.id,
      status: "SHORTLISTED",
      aiMatchScore: 78,
      shortlistedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      videoInterviewUrl: "https://meet.jit.si/legaforce-demo-interview",
    },
  });
  console.log(` Created sample application (SHORTLISTED)`);

  // ── Done ─────────────────────────────────────
  console.log("\n🎉 Seed complete! Demo credentials:");
  console.log("   ────────────────────────────────");
  console.log(`   Admin:      admin@legaforce.com      / ${DEMO_PASSWORD}`);
  console.log(`   Employer:   employer@legaforce.com   / ${DEMO_PASSWORD}`);
  console.log(`   Applicant:  applicant@legaforce.com  / ${DEMO_PASSWORD}`);
  console.log("   ────────────────────────────────\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
