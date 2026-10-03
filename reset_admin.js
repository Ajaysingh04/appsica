const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Read MONGODB_URI from .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const match = envContent.split(/\r?\n/).find(l => l.startsWith("MONGODB_URI="));
if (!match) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}
const MONGODB_URI = match.slice(match.indexOf("=") + 1).trim();

const email = process.argv[2] || "admin@appsica.com";
const newPassword = process.argv[3] || "Appsica@2026";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const passwordHash = await bcrypt.hash(newPassword, 12);

    const result = await db.collection("admins").updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          email: email.toLowerCase(),
          passwordHash,
          name: "Appsica Admin",
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log("-----------------------------------------");
    console.log(" Admin Credentials Updated Successfully! ");
    console.log("-----------------------------------------");
    console.log(` Email:    ${email.toLowerCase()}`);
    console.log(` Password: ${newPassword}`);
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("Error updating admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
