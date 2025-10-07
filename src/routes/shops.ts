import experss from "express";
import ShopController from "../controllers/shops.ts";
import ShopService from "../services/shops.ts";
const router = experss.Router();

const shopService = new ShopService();
const shopController = new ShopController(shopService);
router.get('/shops', shopController.getAllShops);
router.get('/shops/:id', shopController.getShop);
router.post('/shops', shopController.setShop);
router.put('/shops/:id', shopController.updateShop);
router.delete('/shops/:id', shopController.deleteShop);


export default router;