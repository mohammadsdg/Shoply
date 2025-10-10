import express from "express";
import ShopProductController from "../controllers/shop-products.ts";
import ShopProductService from "../services/shop-products.ts";
const router = express.Router();

const shopProductService = new ShopProductService();
const shopProductController = new ShopProductController(shopProductService);

router.get("/shop-products", shopProductController.getAllShopProducts);
router.get("/shop-products/:id", shopProductController.getShopProduct);
router.post("/shop-products", shopProductController.setShopProduct);
router.put("/shop-products/:id", shopProductController.updateShopProduct);
router.delete("/shop-products/:id", shopProductController.deleteShopProduct);

export default router;