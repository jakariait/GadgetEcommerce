const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const ProductOptionModel = require("../models/ProductOptionModel");

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const productOptions = [
  {
    name: "Color",
    values: ["Black", "White", "Silver", "Space Gray", "Gold", "Rose Gold", "Blue", "Red", "Green", "Midnight Green", "Starlight", "Midnight"],
  },
  {
    name: "Storage",
    values: ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  },
  {
    name: "RAM",
    values: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"],
  },
  {
    name: "Processor",
    values: ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "Snapdragon 8 Gen 2"],
  },
  {
    name: "Screen Size",
    values: ["11-inch", "13-inch", "14-inch", "15-inch", "16-inch", "24-inch", "27-inch", "32-inch"],
  },
  {
    name: "Condition",
    values: ["New", "Manufacturer Refurbished", "Seller Refurbished", "Used"],
  },
  {
    name: "Graphics Card",
    values: ["NVIDIA GeForce RTX 3060", "NVIDIA GeForce RTX 3070", "NVIDIA GeForce RTX 3080", "NVIDIA GeForce RTX 4070", "NVIDIA GeForce RTX 4080", "NVIDIA GeForce RTX 4090", "AMD Radeon RX 6700 XT", "AMD Radeon RX 6800 XT", "Integrated Graphics", "Apple M-series GPU"],
  },
  {
    name: "Connectivity",
    values: ["Wi-Fi", "Wi-Fi + Cellular", "Bluetooth", "NFC"],
  }
];

const seedDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is required. Make sure you have a .env file in the /backend directory with the correct database connection string.");
    return;
  }

  try {
    // database connection
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");

    console.log("Seeding product options...");

    for (const option of productOptions) {
      const result = await ProductOptionModel.updateOne(
        { name: option.name },
        { $set: { values: option.values } },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`- Created option: ${option.name}`);
      } else if (result.modifiedCount > 0) {
        console.log(`- Updated option: ${option.name}`);
      } else {
        console.log(`- Option already exists: ${option.name}`);
      }
    }

    console.log("Product options seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Ensures that the connection is closed when you finish/error
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDB();
