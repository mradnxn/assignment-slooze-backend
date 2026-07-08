import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Clean existing tables to prevent key violation errors
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Cleared existing records.");

  // Seed Users
  const defaultPassword = "Password123!";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const usersToSeed = [
    {
      email: "nick.fury@shield.gov",
      name: "Nick Fury",
      password: hashedPassword,
      role: "ADMIN",
      country: null,
    },
    {
      email: "captain.marvel@shield.gov",
      name: "Captain Marvel",
      password: hashedPassword,
      role: "MANAGER",
      country: "India",
    },
    {
      email: "captain.america@shield.gov",
      name: "Captain America",
      password: hashedPassword,
      role: "MANAGER",
      country: "America",
    },
    {
      email: "thanos@shield.gov",
      name: "Thanos",
      password: hashedPassword,
      role: "MEMBER",
      country: "India",
    },
    {
      email: "thor@shield.gov",
      name: "Thor",
      password: hashedPassword,
      role: "MEMBER",
      country: "India",
    },
    {
      email: "travis@shield.gov",
      name: "Travis",
      password: hashedPassword,
      role: "MEMBER",
      country: "America",
    },
  ];

  for (const user of usersToSeed) {
    await prisma.user.create({
      data: user,
    });
  }
  console.log("Seeded default users.");

  // Seed Restaurants & Menu Items
  // India Restaurants
  await prisma.restaurant.create({
    data: {
      name: "Royal Indian Feast",
      country: "India",
      menuItems: {
        create: [
          { name: "Butter Chicken", price: 350.00 },
          { name: "Paneer Tikka", price: 280.00 },
          { name: "Garlic Naan", price: 60.00 }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: "Mumbai Street Eats",
      country: "India",
      menuItems: {
        create: [
          { name: "Vada Pav", price: 50.00 },
          { name: "Pav Bhaji", price: 120.00 },
          { name: "Masala Chai", price: 30.00 }
        ]
      }
    }
  });

  // America Restaurants
  await prisma.restaurant.create({
    data: {
      name: "Liberty Diner",
      country: "America",
      menuItems: {
        create: [
          { name: "Classic Cheeseburger", price: 12.99 },
          { name: "French Fries", price: 4.99 },
          { name: "Chocolate Shake", price: 5.99 }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: "NY Slice Pizzeria",
      country: "America",
      menuItems: {
        create: [
          { name: "Pepperoni Slice", price: 3.99 },
          { name: "Garlic Knots", price: 4.50 },
          { name: "Buffalo Wings", price: 9.99 }
        ]
      }
    }
  });

  console.log("Seeded restaurants & menus.");
  console.log("Database seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
