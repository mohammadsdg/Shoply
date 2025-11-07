import express from "express";
import ProductsSizeController from "../controllers/products-size.js";
import ProductSizeService from "../services/products-size.js";
import StockItemService from "../services/stock-items.js";
const router = express.Router();
const stockItemService = new StockItemService();
const productSizeService = new ProductSizeService();
const productSize = new ProductsSizeController(productSizeService, stockItemService);
router.get("/products-size", productSize.getAllProducts);
router.get("/products-size/:id", productSize.getProduct);
router.post("/products-size", productSize.setProduct);
export default router;
//# sourceMappingURL=products-size.js.map