import express from "express";
import ShopProductsController from "../controllers/shop-products.ts";
const router = express.Router();

router.get("/shop-products", ShopProductsController.getAllShopProducts);
router.get("/shop-products/:id", ShopProductsController.getShopProduct);
router.post("/shop-products", ShopProductsController.setShopProduct);
router.put("/shop-products/:id", ShopProductsController.updateShopProduct);
router.delete("/shop-products/:id", ShopProductsController.deleteShopProduct);

export default router;