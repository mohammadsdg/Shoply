import express from "express";
import BrandController from "../controllers/brands.ts";
import BrandService from "../services/brands.ts";
const router = express.Router();

const brandService = new BrandService();
const brandController = new BrandController(brandService);

router.get("/brands", brandController.getAllBrands);
router.get("/brands/:id", brandController.getBrand);
router.post("/brands", brandController.setBrand);
router.put("/brands/:id", brandController.updateBrand);
router.delete("/brands/:id", brandController.deleteBrand);

export default router;