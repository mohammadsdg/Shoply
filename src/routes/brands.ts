import express from "express";
import BrandsController from "../controllers/brands.ts";
const router = express.Router();

router.get("/brands", BrandsController.getAllBrands);
router.get("/brands/:id", BrandsController.getBrand);
router.post("/brands", BrandsController.setBrand);
router.put("/brands/:id", BrandsController.updateBrand);
router.delete("/brands/:id", BrandsController.deleteBrand);

export default router;