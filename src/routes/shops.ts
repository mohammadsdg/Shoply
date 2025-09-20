import experss from "express";
import ShopsController from "../controllers/shops.ts";
const router = experss.Router();

router.get('/shops', ShopsController.getAllShops);
router.get('/shops/:id', ShopsController.getShop);
router.post('/shops', ShopsController.setShop);
router.put('/shops/:id', ShopsController.updateShop);
router.delete('/shops/:id', ShopsController.deleteShop);


export default router;