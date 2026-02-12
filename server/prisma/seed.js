import prisma from "../config/database.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create or update admin user
    const adminEmail = "admin@legaforce.com";
    
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        isEmailVerified: true, // Ensure admin is verified even if already exists
        password: hashedPassword, // Ensure password is correct
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        isEmailVerified: true,
        emailVerificationOtp: null,
        emailVerificationExpiry: null,
      },
    });

    console.log("✅ Admin account seeded successfully!\n");
    console.log("━".repeat(50));
    console.log("Admin Credentials:");
    console.log("━".repeat(50));
    console.log(`Email:    ${adminEmail}`);
    console.log("Password: admin123");
    console.log("━".repeat(50));
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
