import prisma from "../config/database.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = (pw) => bcrypt.hash(pw, salt);

    // ──────────────────────────────────────────────
    // 1. ADMIN
    // ──────────────────────────────────────────────
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@legaforce.com" },
      update: { isEmailVerified: true, password: await hash("admin123") },
      create: {
        email: "admin@legaforce.com",
        password: await hash("admin123"),
        role: "ADMIN",
        isActive: true,
        isEmailVerified: true,
      },
    });
    console.log("✅ Admin seeded:", adminUser.email);

    // ──────────────────────────────────────────────
    // 2. EMPLOYERS
    // ──────────────────────────────────────────────
    const employerData = [
      {
        email: "hr@kingfaisal.sa",
        password: await hash("employer123"),
        company: {
          companyName: "King Faisal Specialist Hospital",
          contactPerson: "Ahmed Al-Rashid",
          phone: "+966 11 464 7272",
          country: "Saudi Arabia",
          isVerified: true,
          trustScore: 85,
          totalHires: 42,
        },
      },
      {
        email: "recruitment@dha.ae",
        password: await hash("employer123"),
        company: {
          companyName: "Dubai Health Authority",
          contactPerson: "Fatima Al-Maktoum",
          phone: "+971 4 219 3000",
          country: "United Arab Emirates",
          isVerified: true,
          trustScore: 90,
          totalHires: 67,
        },
      },
      {
        email: "hiring@hamad.qa",
        password: await hash("employer123"),
        company: {
          companyName: "Hamad Medical Corporation",
          contactPerson: "Omar Al-Thani",
          phone: "+974 4439 5777",
          country: "Qatar",
          isVerified: true,
          trustScore: 88,
          totalHires: 35,
        },
      },
    ];

    const employers = [];
    for (const emp of employerData) {
      const user = await prisma.user.upsert({
        where: { email: emp.email },
        update: { isEmailVerified: true, password: emp.password },
        create: {
          email: emp.email,
          password: emp.password,
          role: "EMPLOYER",
          isActive: true,
          isEmailVerified: true,
          employer: { create: emp.company },
        },
        include: { employer: true },
      });
      employers.push(user.employer);
      console.log("✅ Employer seeded:", emp.email, "-", emp.company.companyName);
    }

    // ──────────────────────────────────────────────
    // 3. APPLICANTS
    // ──────────────────────────────────────────────
    const applicantData = [
      {
        email: "maria.santos@email.com",
        password: await hash("applicant123"),
        profile: {
          firstName: "Maria",
          lastName: "Santos",
          phone: "+63 917 123 4567",
          nationality: "PH",
          dateOfBirth: new Date("1995-03-15"),
          trustScore: 72,
          rewardPoints: 150,
          aiGeneratedCV: {
            summary: "Experienced ICU Registered Nurse with 5+ years of critical care experience. Skilled in patient assessment, ventilator management, and emergency response protocols.",
            skills: ["Patient Care", "ICU Experience", "BLS/CPR", "ACLS", "Ventilator Management", "Patient Education"],
            experience: [
              { company: "Philippine General Hospital", position: "ICU Nurse", duration: "2019 – Present", description: "Provide critical patient care in 20-bed ICU" },
              { company: "St. Luke's Medical Center", position: "Staff Nurse", duration: "2018 – 2019", description: "General nursing in medical-surgical ward" },
            ],
            education: [
              { school: "University of the Philippines Manila", degree: "Bachelor of Science in Nursing", year: "2017" },
            ],
            certifications: ["RN License - PRC", "BLS/CPR - AHA", "ACLS Certification"],
          },
        },
      },
      {
        email: "juan.delacruz@email.com",
        password: await hash("applicant123"),
        profile: {
          firstName: "Juan",
          lastName: "Dela Cruz",
          phone: "+63 918 234 5678",
          nationality: "PH",
          dateOfBirth: new Date("1992-07-22"),
          trustScore: 65,
          rewardPoints: 80,
          aiGeneratedCV: {
            summary: "Licensed Mechanical Engineer with 6 years of experience in oil & gas operations. Proficient in plant maintenance, equipment troubleshooting, and safety compliance.",
            skills: ["Mechanical Engineering", "Plant Maintenance", "AutoCAD", "Safety Compliance", "Project Management"],
            experience: [
              { company: "Petron Corporation", position: "Mechanical Engineer", duration: "2017 – Present", description: "Oversee mechanical systems in refinery operations" },
            ],
            education: [
              { school: "Mapua University", degree: "BS Mechanical Engineering", year: "2016" },
            ],
            certifications: ["Licensed Mechanical Engineer - PRC", "OSHA Safety Certification"],
          },
        },
      },
      {
        email: "anna.reyes@email.com",
        password: await hash("applicant123"),
        profile: {
          firstName: "Anna",
          lastName: "Reyes",
          phone: "+63 919 345 6789",
          nationality: "PH",
          dateOfBirth: new Date("1998-11-08"),
          trustScore: 58,
          rewardPoints: 30,
          aiGeneratedCV: {
            summary: "Dedicated caregiver with 3 years of experience in elderly and patient home care. Compassionate, reliable, and certified in basic life support.",
            skills: ["Elderly Care", "Patient Care", "First Aid", "Medication Administration", "Cooking", "Housekeeping"],
            experience: [
              { company: "Sunshine Home Care", position: "Caregiver", duration: "2021 – Present", description: "Provide daily care for elderly patients" },
            ],
            education: [
              { school: "Polytechnic University of the Philippines", degree: "BS Nursing (2 years completed)", year: "2020" },
            ],
            certifications: ["Caregiver NC II - TESDA", "First Aid Certification"],
          },
        },
      },
      {
        email: "mark.villanueva@email.com",
        password: await hash("applicant123"),
        profile: {
          firstName: "Mark",
          lastName: "Villanueva",
          phone: "+63 920 456 7890",
          nationality: "PH",
          dateOfBirth: new Date("1990-01-30"),
          trustScore: 80,
          rewardPoints: 250,
          aiGeneratedCV: {
            summary: "Senior Software Developer with 8 years of experience in full-stack web development. Expert in React, Node.js, and cloud infrastructure.",
            skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB"],
            experience: [
              { company: "Accenture Philippines", position: "Senior Software Developer", duration: "2019 – Present", description: "Lead development of enterprise web applications" },
              { company: "Globe Telecom", position: "Software Developer", duration: "2016 – 2019", description: "Built customer-facing web portals" },
            ],
            education: [
              { school: "De La Salle University", degree: "BS Computer Science", year: "2015" },
            ],
            certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
          },
        },
      },
      {
        email: "grace.lim@email.com",
        password: await hash("applicant123"),
        profile: {
          firstName: "Grace",
          lastName: "Lim",
          phone: "+63 921 567 8901",
          nationality: "PH",
          dateOfBirth: new Date("1996-05-12"),
          trustScore: 60,
          rewardPoints: 45,
          aiGeneratedCV: {
            summary: "Registered Nurse with 4 years of ER experience. Skilled in triage, emergency protocols, and trauma care.",
            skills: ["Emergency Nursing", "Triage", "Trauma Care", "BLS/CPR", "PALS", "IV Therapy"],
            experience: [
              { company: "Manila Doctors Hospital", position: "ER Nurse", duration: "2020 – Present", description: "Emergency room nursing and triage assessment" },
            ],
            education: [
              { school: "University of Santo Tomas", degree: "Bachelor of Science in Nursing", year: "2019" },
            ],
            certifications: ["RN License - PRC", "BLS/CPR - AHA", "PALS Certification"],
          },
        },
      },
    ];

    const profiles = [];
    for (const app of applicantData) {
      const user = await prisma.user.upsert({
        where: { email: app.email },
        update: { isEmailVerified: true, password: app.password },
        create: {
          email: app.email,
          password: app.password,
          role: "APPLICANT",
          isActive: true,
          isEmailVerified: true,
          profile: { create: app.profile },
        },
        include: { profile: true },
      });
      profiles.push(user.profile);
      console.log("✅ Applicant seeded:", app.email, "-", app.profile.firstName, app.profile.lastName);
    }

    // ──────────────────────────────────────────────
    // 4. JOB ORDERS
    // ──────────────────────────────────────────────
    // Delete existing jobs to avoid duplicates on re-seed
    await prisma.application.deleteMany({});
    await prisma.jobOrder.deleteMany({});

    const jobData = [
      {
        employerId: employers[0].id, // King Faisal
        title: "Registered Nurse (ICU)",
        description: "We are seeking experienced Registered Nurses with strong ICU background to join our world-class medical facility in Riyadh. You will work in a modern, state-of-the-art intensive care unit with access to cutting-edge medical equipment and collaborate with an international team of healthcare professionals.",
        requirements: {
          skills: ["RN License", "3+ years ICU experience", "BLS/CPR Certification", "ACLS preferred"],
          responsibilities: [
            "Provide direct patient care in ICU setting",
            "Monitor vital signs and patient conditions continuously",
            "Administer medications and treatments as prescribed",
            "Maintain detailed patient records and documentation",
            "Collaborate with multidisciplinary healthcare team",
          ],
          benefits: ["Competitive salary + housing allowance", "Health insurance", "Annual flight tickets home", "30 days annual leave"],
        },
        salary: 2500,
        location: "Riyadh, Saudi Arabia",
        positions: 5,
        status: "ACTIVE",
      },
      {
        employerId: employers[0].id, // King Faisal
        title: "Operating Room Nurse",
        description: "Join our surgical team as an Operating Room Nurse at King Faisal Specialist Hospital. Assist in surgical procedures, prepare operating rooms, and ensure patient safety during operations.",
        requirements: {
          skills: ["RN License", "2+ years OR experience", "Surgical instrument knowledge", "Sterile technique expertise"],
          responsibilities: [
            "Prepare and maintain sterile surgical environment",
            "Assist surgeons during procedures",
            "Monitor patient vitals during surgery",
            "Manage surgical instruments and supplies",
          ],
          benefits: ["Competitive salary + housing", "Health insurance", "Professional development", "Annual leave"],
        },
        salary: 2600,
        location: "Riyadh, Saudi Arabia",
        positions: 3,
        status: "ACTIVE",
      },
      {
        employerId: employers[1].id, // DHA
        title: "Staff Nurse - General Ward",
        description: "Dubai Health Authority is looking for dedicated Staff Nurses for our general ward. Provide comprehensive nursing care in a multicultural environment with world-class facilities.",
        requirements: {
          skills: ["RN License (DHA eligible)", "2+ years clinical experience", "BLS Certification", "English fluency"],
          responsibilities: [
            "Provide holistic patient care",
            "Administer medications safely",
            "Document patient progress accurately",
            "Educate patients and families",
          ],
          benefits: ["Tax-free salary", "Free accommodation", "Health insurance", "Annual flight tickets", "30 days paid leave"],
        },
        salary: 2200,
        location: "Dubai, UAE",
        positions: 10,
        status: "ACTIVE",
      },
      {
        employerId: employers[1].id, // DHA
        title: "Senior Nurse - Emergency Department",
        description: "Lead nursing care in our busy Emergency Department at Rashid Hospital. We need experienced nurses who can handle high-pressure situations and provide exceptional emergency care.",
        requirements: {
          skills: ["RN License", "5+ years ER experience", "ACLS/BLS", "Triage certification", "Leadership skills"],
          responsibilities: [
            "Lead nursing team in emergency department",
            "Perform triage assessments",
            "Manage critical patients",
            "Mentor junior nurses",
            "Ensure compliance with protocols",
          ],
          benefits: ["Premium salary package", "Housing allowance", "Education allowance", "Health insurance for family"],
        },
        salary: 3000,
        location: "Dubai, UAE",
        positions: 3,
        status: "ACTIVE",
      },
      {
        employerId: employers[1].id, // DHA
        title: "Software Developer",
        description: "Join Dubai Health Authority's digital transformation team. Build healthcare applications that serve millions of patients across the UAE.",
        requirements: {
          skills: ["BS Computer Science", "3+ years experience", "React/Node.js", "REST APIs", "Cloud platforms"],
          responsibilities: [
            "Develop web-based healthcare applications",
            "Build RESTful APIs and services",
            "Collaborate with UI/UX designers",
            "Write unit and integration tests",
            "Participate in code reviews",
          ],
          benefits: ["Competitive tech salary", "Latest technology stack", "Training budget", "Health insurance"],
        },
        salary: 4000,
        location: "Dubai, UAE",
        positions: 2,
        status: "ACTIVE",
      },
      {
        employerId: employers[2].id, // Hamad Medical
        title: "Senior Nurse",
        description: "Hamad Medical Corporation seeks experienced Senior Nurses to join our team in Qatar. World-class facilities, competitive compensation, and career growth opportunities await.",
        requirements: {
          skills: ["RN License", "5+ years nursing experience", "BSN degree", "BLS/ACLS certified"],
          responsibilities: [
            "Provide expert nursing care",
            "Supervise nursing staff",
            "Implement evidence-based nursing practices",
            "Participate in quality improvement projects",
          ],
          benefits: ["Tax-free salary", "Furnished housing", "Health insurance", "Annual round-trip tickets", "End of service gratuity"],
        },
        salary: 2600,
        location: "Doha, Qatar",
        positions: 4,
        status: "ACTIVE",
      },
      {
        employerId: employers[2].id, // Hamad Medical
        title: "Physiotherapist",
        description: "Join our rehabilitation department at Hamad Medical Corporation. Help patients recover and regain mobility using the latest physiotherapy techniques and equipment.",
        requirements: {
          skills: ["Licensed Physiotherapist", "3+ years clinical experience", "Musculoskeletal expertise", "English fluency"],
          responsibilities: [
            "Assess patient physical conditions",
            "Develop individualized treatment plans",
            "Perform therapeutic exercises and modalities",
            "Document patient progress",
          ],
          benefits: ["Competitive salary", "Professional development", "State-of-the-art equipment", "Multicultural team"],
        },
        salary: 2800,
        location: "Doha, Qatar",
        positions: 2,
        status: "ACTIVE",
      },
      {
        employerId: employers[0].id, // King Faisal
        title: "Medical Laboratory Technician",
        description: "King Faisal Hospital is hiring Medical Laboratory Technicians. Perform diagnostic tests, analyze samples, and support our physicians in patient diagnosis.",
        requirements: {
          skills: ["Medical Technology degree", "2+ years lab experience", "Hematology & Chemistry proficiency", "Quality control knowledge"],
          responsibilities: [
            "Perform laboratory diagnostic tests",
            "Analyze blood, tissue, and body fluid samples",
            "Maintain laboratory equipment",
            "Ensure quality control standards",
          ],
          benefits: ["Competitive salary", "Housing provided", "Health insurance", "Annual leave + flight tickets"],
        },
        salary: 2000,
        location: "Riyadh, Saudi Arabia",
        positions: 4,
        status: "ACTIVE",
      },
      {
        employerId: employers[1].id, // DHA
        title: "Caregiver / Home Health Aide",
        description: "Provide compassionate home care for elderly patients in Dubai. Join our growing home healthcare division and make a difference in patients' lives.",
        requirements: {
          skills: ["Caregiver certification", "1+ year experience", "First Aid", "English communication"],
          responsibilities: [
            "Assist with daily living activities",
            "Administer basic medications",
            "Monitor patient health status",
            "Prepare meals and manage nutrition",
            "Provide companionship and emotional support",
          ],
          benefits: ["Monthly salary + housing", "Food allowance", "Health insurance", "Weekly day off"],
        },
        salary: 800,
        location: "Dubai, UAE",
        positions: 8,
        status: "ACTIVE",
      },
      {
        employerId: employers[2].id, // Hamad Medical
        title: "Mechanical Engineer - Hospital Facilities",
        description: "Maintain and improve the mechanical systems of Hamad Medical Corporation's hospital facilities. HVAC, plumbing, and fire protection systems management.",
        requirements: {
          skills: ["BS Mechanical Engineering", "3+ years facility management", "HVAC expertise", "AutoCAD proficiency"],
          responsibilities: [
            "Manage hospital HVAC systems",
            "Oversee mechanical maintenance schedules",
            "Ensure regulatory compliance",
            "Manage vendor relationships",
          ],
          benefits: ["Tax-free salary", "Housing allowance", "Health insurance", "Professional certifications support"],
        },
        salary: 3200,
        location: "Doha, Qatar",
        positions: 2,
        status: "ACTIVE",
      },
      {
        employerId: employers[0].id, // King Faisal
        title: "Dental Hygienist",
        description: "Perform preventive dental care including cleanings, examinations, and patient education at our dental clinic within King Faisal Hospital.",
        requirements: {
          skills: ["Licensed Dental Hygienist", "2+ years experience", "Dental radiography", "Infection control"],
          responsibilities: [
            "Perform dental cleanings and prophylaxis",
            "Take and develop dental X-rays",
            "Educate patients on oral hygiene",
            "Assist dentists during procedures",
          ],
          benefits: ["Competitive salary", "Housing provided", "Health & dental coverage", "Continuing education"],
        },
        salary: 1800,
        location: "Riyadh, Saudi Arabia",
        positions: 2,
        status: "ACTIVE",
      },
      {
        employerId: employers[1].id, // DHA - closed job for variety
        title: "Nurse Educator",
        description: "Develop and deliver nursing education programs for Dubai Health Authority staff. This position has been filled.",
        requirements: {
          skills: ["MSN or equivalent", "5+ years clinical", "Teaching experience", "Curriculum development"],
          responsibilities: [
            "Develop training curriculum",
            "Conduct clinical workshops",
            "Evaluate staff competencies",
            "Implement evidence-based education",
          ],
          benefits: ["Education-sector benefits", "Research opportunities", "Conference attendance"],
        },
        salary: 3500,
        location: "Dubai, UAE",
        positions: 1,
        status: "FILLED",
      },
    ];

    const jobs = [];
    for (const job of jobData) {
      const created = await prisma.jobOrder.create({ data: job });
      jobs.push(created);
      console.log(`✅ Job seeded: ${job.title} (${job.location})`);
    }

    // ──────────────────────────────────────────────
    // 5. APPLICATIONS
    // ──────────────────────────────────────────────
    const applicationData = [
      {
        applicantId: profiles[0].id, // Maria Santos
        jobOrderId: jobs[0].id,      // ICU Nurse - King Faisal
        status: "SHORTLISTED",
        aiMatchScore: 92,
        shortlistedAt: new Date("2026-01-20"),
      },
      {
        applicantId: profiles[0].id, // Maria Santos
        jobOrderId: jobs[2].id,      // Staff Nurse - DHA
        status: "APPLIED",
        aiMatchScore: 88,
      },
      {
        applicantId: profiles[0].id, // Maria Santos
        jobOrderId: jobs[5].id,      // Senior Nurse - Hamad
        status: "INTERVIEWED",
        aiMatchScore: 85,
        shortlistedAt: new Date("2026-01-18"),
        interviewedAt: new Date("2026-01-28"),
        interviewNotes: "Excellent clinical knowledge. Strong communication skills. Recommended for next round.",
      },
      {
        applicantId: profiles[1].id, // Juan Dela Cruz
        jobOrderId: jobs[9].id,      // Mechanical Engineer - Hamad
        status: "APPLIED",
        aiMatchScore: 78,
      },
      {
        applicantId: profiles[2].id, // Anna Reyes
        jobOrderId: jobs[8].id,      // Caregiver - DHA
        status: "SELECTED",
        aiMatchScore: 90,
        shortlistedAt: new Date("2026-01-15"),
        interviewedAt: new Date("2026-01-22"),
        selectedAt: new Date("2026-01-30"),
      },
      {
        applicantId: profiles[3].id, // Mark Villanueva
        jobOrderId: jobs[4].id,      // Software Developer - DHA
        status: "INTERVIEWED",
        aiMatchScore: 95,
        shortlistedAt: new Date("2026-01-12"),
        interviewedAt: new Date("2026-01-25"),
        interviewNotes: "Exceptional technical skills. Strong React and Node.js experience.",
      },
      {
        applicantId: profiles[4].id, // Grace Lim
        jobOrderId: jobs[3].id,      // Senior ER Nurse - DHA
        status: "APPLIED",
        aiMatchScore: 82,
      },
      {
        applicantId: profiles[4].id, // Grace Lim
        jobOrderId: jobs[0].id,      // ICU Nurse - King Faisal
        status: "REJECTED",
        aiMatchScore: 68,
        shortlistedAt: new Date("2026-01-10"),
        interviewNotes: "Needs more ICU-specific experience. Encouraged to reapply in 6 months.",
      },
    ];

    for (const app of applicationData) {
      await prisma.application.create({ data: app });
      console.log(`✅ Application seeded: Profile ${app.applicantId.slice(0, 8)}... → Job ${app.jobOrderId.slice(0, 8)}... [${app.status}]`);
    }

    // ──────────────────────────────────────────────
    // SUMMARY
    // ──────────────────────────────────────────────
    console.log("\n" + "━".repeat(55));
    console.log("🎉 Seeding complete!");
    console.log("━".repeat(55));
    console.log(`  Admin:       1 (admin@legaforce.com / admin123)`);
    console.log(`  Employers:   ${employers.length}`);
    console.log(`  Applicants:  ${profiles.length}`);
    console.log(`  Jobs:        ${jobs.length}`);
    console.log(`  Applications: ${applicationData.length}`);
    console.log("━".repeat(55));
    console.log("\nTest Accounts:");
    console.log("  Admin:     admin@legaforce.com / admin123");
    console.log("  Employer:  hr@kingfaisal.sa / employer123");
    console.log("  Applicant: maria.santos@email.com / applicant123");
    console.log("━".repeat(55));
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
