import express from "express";
import StockItemsController from "../controllers/stock-items.js";
import StockItemService from "../services/stock-items.js";
const router = express.Router();
const stockItemService = new StockItemService();
const stockItemController = new StockItemsController(stockItemService);
router.get("/stock-items", stockItemController.getAllItems);
router.post("/stock-items", stockItemController.setItem);
export default router;
//# sourceMappingURL=stock-items.js.map