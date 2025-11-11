const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Import models
const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CategoryModel");
const BrandModel = require("../models/BrandModel");

const fs = require("fs/promises");

// --- Helper Functions ---

// A simple fetch wrapper using the built-in fetch
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch from ${url}:`, error);
    throw error;
  }
}

// Downloads an image from a URL and saves it to a local path
async function downloadImage(url, localPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(localPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`- Failed to download image: ${url}`, error.message);
    return false;
  }
}

// Finds a brand by name or creates it. If the brand has no logo, it uses the product thumbnail.
const findOrCreateBrand = async (brandName, productThumbnailUrl) => {
    const nameToUse = brandName || "Unknown Brand";
    let brand = await BrandModel.findOne({ name: nameToUse });

    let wasCreated = false;
    if (!brand) {
        brand = new BrandModel({ name: nameToUse });
        wasCreated = true;
        console.log(`- Creating new Brand: ${nameToUse}`);
    }

    // If the brand doesn't have a logo yet and we have a thumbnail URL to use as one
    if (!brand.logo && productThumbnailUrl) {
        const uploadsDir = path.resolve(__dirname, '../uploads');
        const logoExt = path.extname(new URL(productThumbnailUrl).pathname);
        const logoFilename = `brand-logo-${nameToUse.toLowerCase().replace(/[^a-z0-9]/g, '-')}${logoExt}`;
        const logoLocalFullPath = path.join(uploadsDir, logoFilename);

        console.log(`- Checking/setting logo for brand "${nameToUse}"...`);
        if (await downloadImage(productThumbnailUrl, logoLocalFullPath)) {
            brand.logo = logoFilename; // Store just the filename
        }
    }

    // Save if it's a new brand or if the logo was just added
    if (wasCreated || brand.isModified('logo')) {
        await brand.save();
        if (!wasCreated && brand.isModified('logo')) {
            console.log(`- Updated logo for Brand: ${nameToUse}`);
        }
    }

    return brand;
};

// Finds a category by name or creates it. If the category has no image, it uses the product thumbnail.
const findOrCreateCategory = async (categoryName, productThumbnailUrl) => {
    const nameToUse = categoryName || "Unknown Category";
    let category = await CategoryModel.findOne({ name: nameToUse });

    let wasCreated = false;
    if (!category) {
        category = new CategoryModel({ name: nameToUse });
        wasCreated = true;
        console.log(`- Creating new Category: ${nameToUse}`);
    }

    // If the category doesn't have an image yet and we have a thumbnail URL to use as one
    if (!category.categoryImage && productThumbnailUrl) {
        const uploadsDir = path.resolve(__dirname, '../uploads');
        const imgExt = path.extname(new URL(productThumbnailUrl).pathname);
        const imgFilename = `category-image-${nameToUse.toLowerCase().replace(/[^a-z0-9]/g, '-')}${imgExt}`;
        const imgLocalFullPath = path.join(uploadsDir, imgFilename);

        console.log(`- Checking/setting image for category "${nameToUse}"...`);
        if (await downloadImage(productThumbnailUrl, imgLocalFullPath)) {
            category.categoryImage = imgFilename; // Store just the filename
        }
    }

    // Save if it's a new category or if the image was just added
    if (wasCreated || category.isModified('categoryImage')) {
        await category.save();
        if (!wasCreated && category.isModified('categoryImage')) {
            console.log(`- Updated image for Category: ${nameToUse}`);
        }
    }

    return category;
};


// --- Main Seeding Function ---

const seedFromApi = async () => {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is required.");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database.");

    // 1. Fetch products from DummyJSON
    console.log("Fetching products from DummyJSON API...");
    const [productsPage1, productsPage2] = await Promise.all([
      fetchJson("https://dummyjson.com/products?limit=100&skip=0"),
      fetchJson("https://dummyjson.com/products?limit=100&skip=100"),
    ]);
    const apiProducts = [...productsPage1.products, ...productsPage2.products];
    console.log(`Fetched ${apiProducts.length} products from API.`);

    // 2. Process and save each product
    console.log("Processing and saving products to the database (this may take a while)...");
    const uploadsDir = path.resolve(__dirname, '../uploads');
    await fs.mkdir(uploadsDir, { recursive: true }); // Ensure uploads directory exists

    for (const apiProduct of apiProducts) {
      console.log(`\nProcessing product: ${apiProduct.title}`);

      // --- Image Downloading ---
      let localThumbnailFilename = '';
      const localImageFilenames = [];

      // Download thumbnail
      if (apiProduct.thumbnail) {
        const thumbUrl = apiProduct.thumbnail;
        const thumbExt = path.extname(new URL(thumbUrl).pathname);
        const thumbFilename = `product-${apiProduct.id}-thumb${thumbExt}`;
        const thumbLocalFullPath = path.join(uploadsDir, thumbFilename);
        console.log(`- Downloading thumbnail: ${thumbUrl}`);
        if (await downloadImage(thumbUrl, thumbLocalFullPath)) {
            localThumbnailFilename = thumbFilename;
        }
      }

      // Download images array
      if (apiProduct.images && apiProduct.images.length > 0) {
        for (let i = 0; i < apiProduct.images.length; i++) {
            const imageUrl = apiProduct.images[i];
            const imgExt = path.extname(new URL(imageUrl).pathname);
            const imageFilename = `product-${apiProduct.id}-image-${i + 1}${imgExt}`;
            const imageLocalFullPath = path.join(uploadsDir, imageFilename);
            console.log(`- Downloading image ${i+1}: ${imageUrl}`);
            if (await downloadImage(imageUrl, imageLocalFullPath)) {
                localImageFilenames.push(imageFilename);
            }
        }
      }
      
      if (!localThumbnailFilename && localImageFilenames.length > 0) {
          localThumbnailFilename = localImageFilenames[0]; // Use first image as thumbnail if thumb fails
      } else if (!localThumbnailFilename && localImageFilenames.length === 0) {
          console.warn(`- No images could be downloaded for ${apiProduct.title}. Skipping product.`);
          continue; // Skip this product if no images are available
      }

      // --- Find/Create Brand & Category ---
      const brand = await findOrCreateBrand(apiProduct.brand, apiProduct.thumbnail);
      const category = await findOrCreateCategory(apiProduct.category, apiProduct.thumbnail);

      // --- Map API data to our Product schema ---
      const productData = {
        name: apiProduct.title,
        shortDesc: apiProduct.description,
        longDesc: `A high-quality ${apiProduct.title} from ${apiProduct.brand}. Rated ${apiProduct.rating} out of 5 by customers.`,
        productCode: apiProduct.sku,
        rewardPoints: Math.floor(apiProduct.price / 10),
        isActive: true,
        category: category._id,
        brand: brand._id,
        metaTitle: `Buy ${apiProduct.title} Online`,
        metaDescription: `Get the best price on the ${apiProduct.title}. ${apiProduct.description}`,
        thumbnailImage: localThumbnailFilename,
        images: localImageFilenames,
        finalPrice: apiProduct.price,
        finalStock: apiProduct.stock,
        purchasePrice: apiProduct.price * 0.8,
      };

      // --- Use "find-then-save" to ensure Mongoose pre-hooks are triggered ---
      let product = await ProductModel.findOne({ name: productData.name });
      if (product) {
        product.set(productData);
        console.log(`- Updating product in DB: ${product.name}`);
      } else {
        product = new ProductModel(productData);
        console.log(`- Creating product in DB: ${product.name}`);
      }
      await product.save();
    }

    console.log("\nDatabase successfully seeded with products and images from the API!");

  } catch (error) {
    console.error("\nAn error occurred during the seeding process:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedFromApi();
