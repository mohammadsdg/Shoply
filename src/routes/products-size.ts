import express from "express";
import ProductsSizeController from "../controllers/products-size.ts";
import ProductSizeService from "../services/products-size.ts";
import StockItemService from "../services/stock-items.ts";
const router = express.Router();

const stockItemService = new StockItemService();
const productSizeService = new ProductSizeService();
const productSize = new ProductsSizeController(productSizeService, stockItemService);
router.get("/products-size", productSize.getAllProducts);
router.get("/products-size/:id", productSize.getProduct);
router.post("/products-size", productSize.setProduct);

export default router;