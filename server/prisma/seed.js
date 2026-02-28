/**
 * Seed Script — Legaforce
 *
 * Creates demo accounts for all 3 portals:
 *   - admin@legaforce.com   (ADMIN)
 *   - employer@legaforce.com (EMPLOYER)
 *   - applicant@legaforce.com (APPLICANT)
 *
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
