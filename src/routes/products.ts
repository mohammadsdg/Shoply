import express from "express";
import ProductsController from "../controllers/products.ts";
const router = express.Router();

router.get("/products", ProductsController.getAllProducts);
router.get("/products/:id", ProductsController.getProduct);
router.post("/products", ProductsController.setProduct);
router.put("/products/:id", ProductsController.updateProduct);
router.delete("/products/:id", ProductsController.deleteProduct)

export default router;