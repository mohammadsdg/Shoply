import express from "express";
import ProductController from "../controllers/products.js";
import ProductService from "../services/products.js";
const router = express.Router();
const productService = new ProductService();
const productController = new ProductController(productService);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProduct);
router.post("/products", productController.setProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
export default router;
//# sourceMappingURL=products.js.map