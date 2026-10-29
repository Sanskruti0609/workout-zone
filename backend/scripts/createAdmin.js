// Creates (or resets the password of) an admin account. Run: npm run admin:create
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let prompted = false;
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (!prompted) { prompted = true; process.stdout.write(s); }
        else if (s.includes("\n") || s.includes("\r")) process.stdout.write(s);
      };
    }
    rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(answer.trim()); });
  });
}

async function main() {
  const name = await ask("Name: ");
  const email = (await ask("Email: ")).toLowerCase();
  const password = await ask("Password (min 12 characters, hidden): ", true);
  const confirm = await ask("Repeat password: ", true);

  if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a name and a valid email.");
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");
  if (password !== confirm) throw new Error("Passwords did not match.");

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash, role: "ADMIN" },
  });
  console.log(existing ? `Updated password for ${email}.` : `Created admin ${email}.`);
}

main()
  .catch((e) => { console.error(e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
