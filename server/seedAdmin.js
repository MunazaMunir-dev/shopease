require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const users = [
  {
    name: "ShopEase SuperAdmin",
    email: "superadmin@shopease.com",
    password: "SuperAdmin@123",
    role: "superadmin",
  },
  {
    name: "ShopEase Manager",
    email: "manager@shopease.com",
    password: "Manager@123",
    role: "manager",
  },
  {
    name: "ShopEase Employee",
    email: "employee@shopease.com",
    password: "Employee@123",
    role: "employee",
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    for (const userData of users) {
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (existingUser) {
        console.log(`${userData.role} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        userData.password,
        12
      );

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`${userData.role} created successfully`);
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error.message);
    process.exit(1);
  }
};

seedUsers();