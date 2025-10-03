import express from "express";
import ProductsSizeController from "../controllers/products-size.ts";
const router = express.Router();

router.get("/products-size", ProductsSizeController.getAllProducts);
router.get("/products-size/:id", ProductsSizeController.getProduct);
router.post("/products-size", ProductsSizeController.setProduct);

export default router;