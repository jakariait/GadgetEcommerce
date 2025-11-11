const ProductModel = require("../models/ProductModel");
const BrandModel = require("../models/BrandModel");
const FlagModel = require("../models/FlagModel");
const CategoryModel = require("../models/CategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");
const ChildCategoryModel = require("../models/ChildCategoryModel");
const mongoose = require("mongoose");

// Create a new product
const createProduct = async (data) => {
	try {
		// Parse specification if it's a JSON string
		if (data.specification && typeof data.specification === 'string') {
			try {
				data.specification = JSON.parse(data.specification);
			} catch (e) {
				throw new Error("Invalid specification format. Expected a valid JSON string.");
			}
		}
		const product = new ProductModel(data); // Save product with image names
		await product.save();
		return product;
	} catch (error) {
		throw new Error(error.message);
	}
};

/**
 * Get all products without pagination or filters
 */
const getProducts = async () => {
	try {
		// Fetch all products without any pagination or filters
		const products = await ProductModel.find()
			.select("-createdAt -updatedAt") // Optional fields to exclude from the response
			.populate([
				{ path: "category", select: "-createdAt -updatedAt" },
				{ path: "subCategory", select: "-createdAt -updatedAt" },
				{ path: "childCategory", select: "-createdAt -updatedAt" },
				{ path: "brand", select: "-createdAt -updatedAt" },
				{ path: "flags", select: "-createdAt -updatedAt" },
				{ path: "variants.attributes.option", model: "ProductOption" },
			]);

		return products;
	} catch (error) {
		throw new Error(error.message);
	}
};

/**
 * Get a single product by ID
 */
const getProductById = async (productId) => {
	try {
		const product = await ProductModel.findOne({ productId }).populate([
			{ path: "category", select: "-createdAt -updatedAt" },
			{ path: "subCategory", select: "-createdAt -updatedAt" },
			{ path: "childCategory", select: "-createdAt -updatedAt" },
			{ path: "brand", select: "-createdAt -updatedAt" },
			{ path: "flags", select: "-createdAt -updatedAt" },
			{ path: "variants.attributes.option", model: "ProductOption" },
		]);
		if (!product) throw new Error("Product not found");
		return product;
	} catch (error) {
		throw new Error(error.message);
	}
};

// Get a product by slug
const getProductBySlug = async (slug) => {
	try {
		// Ensure to use the slug directly, not the productId
		const product = await ProductModel.findOne({ slug }).populate([
			{ path: "category", select: "-createdAt -updatedAt" },
			{ path: "subCategory", select: "-createdAt -updatedAt" },
			{ path: "childCategory", select: "-createdAt -updatedAt" },
			{ path: "brand", select: "-createdAt -updatedAt" },
			{ path: "flags", select: "-createdAt -updatedAt" },
			{ path: "variants.attributes.option", model: "ProductOption" },
		]);

		if (!product) throw new Error("Product not found");

		return product;
	} catch (error) {
		throw new Error(error.message);
	}
};

/**
 * Delete a product by ID
 */
const deleteProduct = async (productId) => {
	try {
		const deletedProduct = await ProductModel.findOneAndDelete({ productId });
		if (!deletedProduct) throw new Error("Product not found");
		return deletedProduct;
	} catch (error) {
		throw new Error(error.message);
	}
};


const getAllProducts = async ({
	page = 1,
	limit = 10,
	sort,
	category,
	subcategory,
	childCategory,
	brand,
	stock,
	flags,
	isActive,
	search,
}) => {
	try {
		// Fetch category, subcategory, childCategory, and flags independently
		const [
			categoryDoc,
			subCategoryDoc,
			childCategoryDoc,
			brandDoc,
			flagDocs,
		] = await Promise.all([
			category
				? CategoryModel.findOne({ name: category }).select("_id")
				: null,
			subcategory
				? SubCategoryModel.findOne({
						slug: subcategory,
						isActive: true,
				  }).select("_id")
				: null,
			childCategory
				? ChildCategoryModel.findOne({
						slug: childCategory,
						isActive: true,
				  }).select("_id")
				: null,
			brand
				? BrandModel.findOne({ slug: brand }).select("_id")
				: null,
			flags
				? FlagModel.find({
						name: { $in: flags.split(",") },
						isActive: true,
				  }).select("_id")
				: [],
		]);

		// If any provided category, subcategory, childCategory, or flags are invalid, return empty result
		if (
			(category && !categoryDoc) ||
			(subcategory && !subCategoryDoc) ||
			(childCategory && !childCategoryDoc) ||
			(brand && !brandDoc) ||
			(flags && flagDocs.length === 0)
		) {
			return {
				products: [],
				totalProducts: 0,
				totalPages: 0,
				currentPage: page,
			};
		}

		// Build the query object
		let query = {};

		if (typeof isActive === "boolean") {
			query.isActive = isActive;
		}

		if (categoryDoc) query.category = categoryDoc._id;
		if (subCategoryDoc) query.subCategory = subCategoryDoc._id;
		if (childCategoryDoc) query.childCategory = childCategoryDoc._id;
		if (brandDoc) query.brand = brandDoc._id;

		if (stock === "in") query.finalStock = { $gt: 0 };
		if (stock === "out") query.finalStock = { $lte: 0 };

		if (flagDocs.length) {
			query.flags = { $in: flagDocs.map((flag) => flag._id) };
		}

		// Add search filter: partial, case-insensitive match on product name
		if (search && search.trim()) {
			query.name = { $regex: search.trim(), $options: "i" };
		}

		// Validate sort option
		const validSortValues = [
			"price_high",
			"price_low",
			"name_asc",
			"name_desc",
			"latest",
			"oldest",
		];
		if (sort && !validSortValues.includes(sort)) {
			return {
				products: [],
				totalProducts: 0,
				totalPages: 0,
				currentPage: page,
			};
		}

		// Define sorting options
		let sortOption = { createdAt: -1 }; // default newest first
		if (sort === "price_high") sortOption = { finalDiscount: -1 };
		if (sort === "price_low") sortOption = { finalDiscount: 1 };
		if (sort === "name_asc") sortOption = { name: 1 };
		if (sort === "name_desc") sortOption = { name: -1 };
		if (sort === "oldest") sortOption = { createdAt: 1 };

		// Count total documents matching the query
		const totalProducts = await ProductModel.countDocuments(query);

		// Fetch products with filters, sorting, and pagination
		const products = await ProductModel.find(query)
			.sort(sortOption)
			.skip((page - 1) * limit) // Apply skip for pagination
			.limit(limit) // Apply limit for pagination
			.select(
				"name slug finalDiscount finalPrice finalStock thumbnailImage isActive images productId category brand variants flags"
			)
			.populate([
				{ path: "category", select: "-createdAt -updatedAt" },
				{ path: "brand", select: "-createdAt -updatedAt" },
				{ path: "flags", select: "-createdAt -updatedAt" },
				{ path: "variants.attributes.option", model: "ProductOption" },
			]);

		return {
			products,
			totalProducts,
			totalPages: Math.ceil(totalProducts / limit),
			currentPage: page,
		};
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateProduct = async (productId, updatedData, files) => {
  try {

    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID format");
    }

    // 1. Find the existing product by its MongoDB _id
    const product = await ProductModel.findById(productId); // Use findById for MongoDB _id
    if (!product) {
      throw new Error("Product not found");
    }

    // Parse specification if it's a JSON string
    if (updatedData.specification && typeof updatedData.specification === 'string') {
      try {
        updatedData.specification = JSON.parse(updatedData.specification);
      } catch (e) {
        throw new Error("Invalid specification format. Expected a valid JSON string.");
      }
    }

		// --- IMAGE HANDLING START ---
		// Handle thumbnail image update (only if a new file is uploaded)
		if (files && files.thumbnailImage && files.thumbnailImage.length > 0) {
			product.thumbnailImage = files.thumbnailImage[0].filename;
		}
		// If no new thumbnail uploaded, keep the old one (do nothing)

		// Handle images array update
		// updatedData.images = req.body.existingImages (may be string or array)
		let images = [];

		if (updatedData.existingImages) {
			images = Array.isArray(updatedData.existingImages)
				? updatedData.existingImages
				: [updatedData.existingImages];
		}

		if (files && files.images && files.images.length > 0) {
			images = images.concat(files.images.map((f) => f.filename));
		}

// Handle deleted images
		if (updatedData.imagesToDelete) {
			const toDelete = Array.isArray(updatedData.imagesToDelete)
				? updatedData.imagesToDelete
				: [updatedData.imagesToDelete];
			images = images.filter((img) => !toDelete.includes(img));
		}

		product.images = images;

		// --- IMAGE HANDLING END ---

		// 2. Secure variant updates
		if (updatedData.variants && Array.isArray(updatedData.variants)) {
			const existingVariantsMap = new Map();
			product.variants.forEach((v) => {
				existingVariantsMap.set(v._id.toString(), v);
			});

			updatedData.variants = updatedData.variants.map((variantData, index) => {
				const variantId = variantData._id ? variantData._id.toString() : null;

				if (variantId) { // This is an existing variant
					const existingVariant = existingVariantsMap.get(variantId);

					if (existingVariant) {
						return {
							_id: existingVariant._id,
							attributes: existingVariant.attributes, // attributes are not updatable this way
							stock:
								variantData.stock !== undefined
									? Number(variantData.stock)
									: existingVariant.stock,
							price:
								variantData.price !== undefined
									? Number(variantData.price)
									: existingVariant.price,
							discount:
								variantData.discount !== undefined
									? variantData.discount === ""
										? null
										: Number(variantData.discount)
									: existingVariant.discount,
							sku: variantData.sku !== undefined ? variantData.sku : existingVariant.sku
						};
					}
				}

				// New variant
				if (!variantData.attributes || !variantData.price || !variantData.stock) {
					throw new Error(`New variant requires attributes, price and stock`);
				}

				return {
					attributes: variantData.attributes,
					price: Number(variantData.price),
					stock: Number(variantData.stock),
					discount:
						variantData.discount === ""
							? null
							: Number(variantData.discount) || null,
					sku: variantData.sku
				};
			});
		}

		// Handle other updates and save...
		Object.assign(product, updatedData);


		await product.save();

		return product;
	  } catch (error) {
	    console.error("Update failed:", {
	      error: error.message,
	      inputVariants: updatedData.variants,
	      existingVariants: product ? product.variants?.map((v) => ({ // Conditionally access product.variants
	        _id: v._id,
	        attributes: v.attributes,
	        price: v.price,
	        stock: v.stock,
	      })) : undefined, // If product is null, set existingVariants to undefined
	    });
	    throw new Error(`Update failed: ${error.message}`);
	  }};


// Similar Products for product details page
const getSimilarProducts = async (category, excludeId) => {
	try {
		const categoryObjectId = new mongoose.Types.ObjectId(category);
		const excludeObjectId = new mongoose.Types.ObjectId(excludeId);

		// Fetch products without specific sorting
		const similarProducts = await ProductModel.find({
			category: categoryObjectId,
			_id: { $ne: excludeObjectId },
			isActive: true,
		})
			.limit(12) // Limiting to 12 products
			.select(
				"name slug finalDiscount finalPrice finalStock thumbnailImage isActive images productId category brand variants flags"
			)
			.populate([
				{ path: "category", select: "-createdAt -updatedAt" },
				{ path: "brand", select: "-createdAt -updatedAt" },
				{ path: "flags", select: "-createdAt -updatedAt" },
				{ path: "variants.attributes.option", model: "ProductOption" },
			]);

		// Randomize the order using a Fisher-Yates shuffle
		const shuffledProducts = shuffleArray(similarProducts);

		return shuffledProducts;
	} catch (error) {
		throw new Error("Failed to fetch similar products: " + error.message);
	}
};

// Fisher-Yates shuffle function to randomize the array
const shuffleArray = (array) => {
	let shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // Random index
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
	}
	return shuffledArray;
};

// Get Products Details For Order
const getProductDetailsService = async ({ productId, variantId }) => {
	if (!productId) {
		throw { status: 400, message: "⚠️ productId is required!" };
	}

	const product = await ProductModel.findById(productId).lean();

	if (!product) {
		throw { status: 404, message: "❌ Product not found!" };
	}

	// Check if the product has variants
	const hasVariants =
		Array.isArray(product.variants) && product.variants.length > 0;

	// 🔒 If product has variants but no variantId provided
	if (hasVariants && !variantId) {
		throw {
			status: 400,
			message: "⚠️ variantId is required for products with variants!",
		};
	}

	// 👉 If variantId is provided
	if (variantId) {
		const selectedVariant = product.variants.find(
			(variant) => variant._id.toString() === variantId
		);

		if (!selectedVariant) {
			throw { status: 404, message: "❌ Variant not found!" };
		}

		return {
			message: "✅ Product variant retrieved successfully!",
			variant: true,
			data: {
				productId: product._id,
				name: product.name,
				thumbnailImage: product.thumbnailImage,
				images: product.images,
				category: product.category,
				selectedVariant: {
					_id: selectedVariant._id,
					size: selectedVariant.size,
					price: selectedVariant.price,
					stock: selectedVariant.stock,
					discount: selectedVariant.discount ?? 0,
				},
			},
		};
	}

	// ✅ If product has no variants and no variantId is required
	return {
		message: "✅ Product (no variant) retrieved successfully!",
		variant: false,
		data: {
			productId: product._id,
			name: product.name,
			shortDesc: product.shortDesc,
			longDesc: product.longDesc,
			thumbnailImage: product.thumbnailImage,
			images: product.images,
			category: product.category,
			finalPrice: product.finalPrice,
			finalDiscount: product.finalDiscount,
			finalStock: product.finalStock,
		},
	};
};

const getHomePageProducts = async () => {
	try {
		// Step 1: Get all active flags
		const flags = await FlagModel.find({ isActive: true }).sort({
			createdAt: -1,
		});

		// Step 2: Prepare an object to hold products for each flag
		const result = {};

		for (const flag of flags) {
			const products = await ProductModel.find({
				flags: flag._id,
				isActive: true,
			})
				.limit(10)
				.sort({ createdAt: -1 }) // Sort products by newest first

				.select(
					"name slug finalDiscount finalPrice finalStock thumbnailImage isActive images productId category brand variants flags"
				)
				.populate([
					{ path: "category", select: "-createdAt -updatedAt" },
					{ path: "brand", select: "-createdAt -updatedAt" },
					{ path: "flags", select: "-createdAt -updatedAt" },
					{ path: "variants.attributes.option", model: "ProductOption" },
				]);

			result[flag.name] = products;
		}

		return result;
	} catch (error) {
		throw new Error("Failed to load homepage products: " + error.message);
	}
};

module.exports = {
	createProduct,
	getProducts,
	getProductBySlug,
	getProductById,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getSimilarProducts,
	getProductDetailsService,
	getHomePageProducts,
};
