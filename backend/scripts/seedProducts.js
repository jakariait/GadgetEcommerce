const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Import all necessary models
const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CategoryModel");
const BrandModel = require("../models/BrandModel");
const ProductOptionModel = require("../models/ProductOptionModel");
const FlagModel = require("../models/FlagModel");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedProducts = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is required.");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");

    // --- 1. Fetch required data for relations ---
    console.log("Fetching required data for product creation...");

    const category = await CategoryModel.findOne();
    const brand = await BrandModel.findOne();
    const flags = await FlagModel.find().limit(2); // Get up to 2 flags
    const colorOption = await ProductOptionModel.findOne({ name: "Color" });
    const storageOption = await ProductOptionModel.findOne({ name: "Storage" });

    if (!category || !brand) {
      console.error("Please seed categories and brands before seeding products.");
      await mongoose.connection.close();
      return;
    }
    if (!colorOption || !storageOption) {
        console.error("Please seed product options (Color, Storage) before seeding products.");
        await mongoose.connection.close();
        return;
    }

    console.log("Required data fetched successfully.");

    // --- 2. Define Dummy Product Data ---

    const productsToCreate = [
      {
        name: "iPhone 15 Pro",
        shortDesc: "The latest and greatest iPhone.",
        longDesc: "Experience the power of the A17 Pro chip, a new customizable Action button, and the best iPhone camera system yet.",
        productCode: "IP15P",
        rewardPoints: 1000,
        videoUrl: "https://www.youtube.com/watch?v=xqyIzeMGg_w",
        isActive: true,
        category: category._id,
        brand: brand._id,
        flags: flags.map(f => f._id),
        metaTitle: "Buy iPhone 15 Pro",
        metaDescription: "Get the best deals on the new iPhone 15 Pro.",
        metaKeywords: ["iphone", "apple", "smartphone"],
        searchTags: ["phone", "mobile", "gadget"],
        thumbnailImage: "uploads/1762445552970.webp",
        images: ["uploads/1762445443865.webp", "uploads/1762439468857.webp"],
        specification: [
            {
                title: "General",
                specs: [
                    { label: "In The Box", value: "iPhone, USB-C Charge Cable" },
                    { label: "Model Number", value: "MTL93LL/A" },
                ]
            },
            {
                title: "Display",
                specs: [
                    { label: "Display Size", value: "6.1 inch" },
                    { label: "Resolution", value: "2556 x 1179 Pixels" },
                ]
            }
        ],
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        shortDesc: "The new standard of mobile AI.",
        longDesc: "Unleash new levels of creativity, productivity and possibility with the most epic Galaxy yet.",
        productCode: "SGS24U",
        rewardPoints: 1200,
        videoUrl: "https://www.youtube.com/watch?v=1-o1g9x1s_k",
        isActive: true,
        category: category._id,
        brand: brand._id,
        flags: flags.map(f => f._id),
        metaTitle: "Buy Samsung Galaxy S24 Ultra",
        metaDescription: "Discover the Samsung Galaxy S24 Ultra with Galaxy AI.",
        metaKeywords: ["samsung", "galaxy", "s24", "android"],
        searchTags: ["phone", "mobile", "gadget", "ai"],
        thumbnailImage: "uploads/1762439431888.webp",
        images: ["uploads/1762439428253.webp", "uploads/1762427308354.png"],
        specification: [
            {
                title: "Processor",
                specs: [
                    { label: "CPU Speed", value: "3.39GHz, 3.1GHz, 2.9GHz, 2.2GHz" },
                    { label: "CPU Type", value: "Octa-Core" },
                ]
            },
            {
                title: "Display",
                specs: [
                    { label: "Display Size", value: "6.8 inch" },
                    { label: "Resolution", value: "3120 x 1440 (Quad HD+)" },
                ]
            }
        ],
      }
    ];


    // --- 3. Generate Variants and Create Products ---
    console.log("Generating variants and creating products...");

    for (const productData of productsToCreate) {
        const variants = [];
        const colors = colorOption.values.slice(0, 3); // Use first 3 colors
        const storages = storageOption.values.slice(0, 2); // Use first 2 storages

        let skuCounter = 1;
        for (const color of colors) {
            for (const storage of storages) {
                variants.push({
                    attributes: [
                        { option: colorOption._id, value: color },
                        { option: storageOption._id, value: storage },
                    ],
                    stock: Math.floor(Math.random() * 100), // Random stock
                    price: 999 + (storages.indexOf(storage) * 200), // Price increases with storage
                    discount: Math.random() > 0.7 ? 50 : 0, // 30% chance of discount
                    sku: `${productData.productCode}-${color.charAt(0)}-${storage.replace('GB','')}-${skuCounter++}`
                });
            }
        }
        productData.variants = variants;
        
        let product = await ProductModel.findOne({ name: productData.name });

        if (product) {
            // Product exists, update it
            product.set(productData); // Update with new data
            console.log(`- Updating product: ${productData.name}`);
        } else {
            // Product doesn't exist, create a new one
            product = new ProductModel(productData);
            console.log(`- Creating product: ${productData.name}`);
        }

        await product.save(); // This will trigger the pre-hooks
        console.log(`- Saved product: ${product.name} with productId: ${product.productId}`);
    }

    console.log("Products seeded successfully!");

  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedProducts();
