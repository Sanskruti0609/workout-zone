// Seeds ONLY information supplied by the gym owner. No prices, bios, or credentials are invented.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.businessProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Workout Zone",
      marathiName: "व्यायामाचा जिम",
      address:
        "Damodar Hall, Social Service League School, Dr. Babasaheb Ambedkar Road, Parel East, Parel, Mumbai, Maharashtra 400012, India",
      phone: "+91 84528 03039",
      googleRating: 4.2,
      reviewCount: 282,
      openingInfo: "Open daily, 6:00 AM to 10:00 PM",
      // mapUrl intentionally left empty until a verified Google Maps link is supplied.
    },
  });

  const trainers = [
    { name: "Atish Babu Shinde", role: "Main Trainer", gender: "MALE", isMainTrainer: true },
    { name: "Siddhesh Manglekar", gender: "MALE" },
    { name: "Mayur Khutikar", gender: "MALE" },
    { name: "Mohit Korade", gender: "MALE" },
    { name: "Arun", gender: "MALE" },
    { name: "Sarita Jadhav", gender: "FEMALE" },
    { name: "Jayshree", gender: "FEMALE" },
  ];
  for (const [i, t] of trainers.entries()) {
    await prisma.trainer.upsert({
      where: { name: t.name },
      update: {},
      create: { ...t, displayOrder: i + 1 },
    });
  }

  const services = [
    ["Strength Training", "gym-strength-training", "Training"],
    ["HYROX Training", "hyrox-training", "Training"],
    ["Yoga", "yoga", "Training"],
    ["Zumba", "zumba", "Training"],
    ["Fitness Supplements", "fitness-supplements", "Store"],
    ["Ladies-Only Gym Sessions", "ladies-only-sessions", "Training"],
    ["Steam", "steam", "Recovery"],
    ["Massage", "massage", "Recovery"],
    ["Equipment and Cleanliness", "equipment-cleanliness", "Facilities"],
  ];
  for (const [i, [name, slug, category]] of services.entries()) {
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: { name, slug, category, displayOrder: i + 1 },
    });
  }

  // Homepage Services section: Strength Training, Yoga and Zumba. Run once; the admin controls this afterwards.
  await prisma.service.updateMany({
    where: { slug: "gym-strength-training", name: "Gym and Strength Training" },
    data: { name: "Strength Training" },
  });
  if ((await prisma.service.count({ where: { isFeatured: true } })) === 0) {
    await prisma.service.updateMany({
      where: { slug: { in: ["gym-strength-training", "yoga", "zumba"] } },
      data: { isFeatured: true },
    });
  }
  // Short, general descriptions (editable in the admin). Only filled in where empty.
  const blurbs = {
    "gym-strength-training": "Build strength and muscle with guided strength training.",
    yoga: "Improve flexibility, balance and calm with yoga sessions.",
    zumba: "Dance-based cardio workouts that make fitness fun.",
  };
  for (const [slug, description] of Object.entries(blurbs)) {
    await prisma.service.updateMany({ where: { slug, description: null }, data: { description } });
  }

  const plans = [
    ["Monthly", 1],
    ["Quarterly", 3],
    ["Annual", 12],
  ];
  for (const [i, [name, durationMonths]] of plans.entries()) {
    await prisma.membershipPlan.upsert({
      where: { name },
      update: {},
      create: { name, durationMonths, displayOrder: i + 1 }, // price null = "Contact for Pricing"
    });
  }

  if ((await prisma.gymTiming.count()) === 0) {
    const blocks = [
      ["06:00", "12:00", "UNISEX"],
      ["12:00", "15:00", "LADIES_ONLY"],
      ["15:00", "22:00", "UNISEX"],
    ];
    const rows = [];
    for (let day = 0; day < 7; day++) {
      for (const [startTime, endTime, sessionType] of blocks) {
        rows.push({ dayOfWeek: day, startTime, endTime, sessionType });
      }
    }
    await prisma.gymTiming.createMany({ data: rows });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
