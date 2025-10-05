const brandService = require("../services/brandService");
const BrandModel = require("../models/BrandModel");
const fs = require('fs');
const path = require('path');

const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const brandData = { name };

        if (req.files && req.files.logo) {
            brandData.logo = req.files.logo[0].filename;
        }

        const brand = await brandService.createBrand(brandData);
        res.status(201).json({ message: "Brand created successfully", brand });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Brand with this name already exists." });
        }
        res.status(500).json({ message: error.message });
    }
};

const getBrands = async (req, res) => {
    try {
        const brands = await brandService.getBrands();
        if (brands.length === 0) {
            return res.status(200).json({ message: "No brands found", brands });
        }
        res.status(200).json({ message: "Brands retrieved successfully", brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBrandById = async (req, res) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const brandData = { name };

        const existingBrand = await brandService.getBrandById(id);
        if (!existingBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        if (req.files && req.files.logo) {
            // If a new logo is uploaded, delete the old one
            if (existingBrand.logo) {
                const oldLogoPath = path.join(__dirname, '..', 'uploads', existingBrand.logo);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }
            }
            brandData.logo = req.files.logo[0].filename;
        }

        const brand = await brandService.updateBrand(id, brandData);
        res.status(200).json({ message: "Brand updated successfully", brand });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Brand with this name already exists." });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await brandService.getBrandById(id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        // Delete the logo file
        if (brand.logo) {
            const logoPath = path.join(__dirname, '..', 'uploads', brand.logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
            }
        }

        await brandService.deleteBrand(id);
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBrandBySlug = async (req, res) => {
    try {
        const brand = await brandService.getBrandBySlug(req.params.slug);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    getBrandBySlug,
};
