import prisma from "../config/database.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create or update admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin account created successfully!\n");
    console.log("━".repeat(50));
    console.log("Admin Credentials:");
    console.log("━".repeat(50));
    console.log("Email:    admin@test.com");
    console.log("Password: admin123");
    console.log("━".repeat(50));
    console.log(`\nAdmin ID: ${adminUser.id}\n`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
