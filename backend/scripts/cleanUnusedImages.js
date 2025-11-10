const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Models
const CarouselModel = require("../models/CarouselModel.js");
const FeatureImageModel = require("../models/FeatureImageModel.js");
const GeneralInfoModel = require("../models/GeneralInfoModel.js");
const ProductModel = require("../models/ProductModel.js");
const UserModel = require("../models/UserModel.js");
const BlogModel = require("../models/BlogModel.js");
const BrandModel = require("../models/BrandModel.js");
const CategoryModel = require("../models/CategoryModel.js");
const SubCategoryModel = require("../models/SubCategoryModel.js");
const ChildCategoryModel = require("../models/ChildCategoryModel.js");

// Load environment variables
dotenv.config();

const main = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Collect used images
  const usedImages = new Set();
  const addImage = (img) => {
    if (img && typeof img === "string") {
      usedImages.add(img);
    }
  };

  const collectUsedImages = async () => {
    const carousels = await CarouselModel.find({}, "imgSrc");
    carousels.forEach((item) => addImage(item.imgSrc));

    const features = await FeatureImageModel.find({}, "imgSrc");
    features.forEach((item) => addImage(item.imgSrc));

    const infos = await GeneralInfoModel.find({}, "PrimaryLogo SecondaryLogo Favicon");
    infos.forEach((item) => {
      addImage(item.PrimaryLogo);
      addImage(item.SecondaryLogo);
      addImage(item.Favicon);
    });

    const products = await ProductModel.find({}, "thumbnailImage images");
    products.forEach((product) => {
      addImage(product.thumbnailImage);
      product.images?.forEach(addImage);
    });

    const users = await UserModel.find({}, "userImage");
    users.forEach((user) => addImage(user.userImage));

    const blogs = await BlogModel.find({}, "thumbnailImage");
    blogs.forEach((blog) => addImage(blog.thumbnailImage));

    const brands = await BrandModel.find({}, "logo");
    brands.forEach((brand) => addImage(brand.logo));

    const categories = await CategoryModel.find({}, "categoryImage");
    categories.forEach((category) => addImage(category.categoryImage));

    const subCategories = await SubCategoryModel.find({}, "subCategoryImage");
    subCategories.forEach((subCategory) => addImage(subCategory.subCategoryImage));

    const childCategories = await ChildCategoryModel.find({}, "childCategoryImage");
    childCategories.forEach((childCategory) => addImage(childCategory.childCategoryImage));
  };

  await collectUsedImages();

  // Delete unused images
  const uploadsDir = path.join(__dirname, "../uploads");

  fs.readdir(uploadsDir, (err, allFiles) => {
    if (err) {
      console.error("❌ Failed to read uploads directory:", err);
      process.exit(1);
    }

    const unusedFiles = allFiles.filter((file) => !usedImages.has(file));
    let deletedCount = 0;

    if (unusedFiles.length === 0) {
      console.log("✅ No unused images to delete. Uploads folder is clean.");
      process.exit();
    }

    unusedFiles.forEach((file) => {
      const fullPath = path.join(uploadsDir, file);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`❌ Failed to delete ${file}:`, err);
        } else {
          deletedCount++;
          if (deletedCount === unusedFiles.length) {
            console.log(`✅ Cleanup complete. ${deletedCount} unused image(s) deleted.`);
            process.exit();
          }
        }
      });
    });
  });
};

main().catch((err) => {
  console.error("❌ An error occurred:", err);
  process.exit(1);
});