import express from "express";
import BrandController from "../controllers/brands.js";
import BrandService from "../services/brands.js";
const router = express.Router();
const brandService = new BrandService();
const brandController = new BrandController(brandService);
router.get("/brands", brandController.getAllBrands);
router.get("/brands/:id", brandController.getBrand);
router.post("/brands", brandController.setBrand);
router.put("/brands/:id", brandController.updateBrand);
router.delete("/brands/:id", brandController.deleteBrand);
export default router;
//# sourceMappingURL=brands.js.map