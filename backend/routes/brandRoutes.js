const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const upload = require("../middlewares/uploadMiddleware");
const { adminProtect } = require("../middlewares/authAdminMiddleware");
const checkPermission = require("../middlewares/checkPermissionMiddleware");

router.post(
  "/",
  adminProtect,
  checkPermission("brand"),
  upload.single("logo"),
  brandController.createBrand,
);
router.get("/", brandController.getBrands);
router.get("/slug/:slug", brandController.getBrandBySlug);
router.get("/:id", brandController.getBrandById);
router.put(
  "/:id",
  adminProtect,
  checkPermission("brand"),
  upload.single("logo"),
  brandController.updateBrand,
);
router.delete(
  "/:id",
  adminProtect,
  checkPermission("brand"),
  brandController.deleteBrand,
);

module.exports = router;
