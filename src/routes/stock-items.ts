import express from "express";
import StockItemsController from "../controllers/stock-items.ts";
import StockItemService from "../services/stock-items.ts";
const router = express.Router();

const stockItemService = new StockItemService();
const stockItemController = new StockItemsController(stockItemService);

router.get("/stock-items", stockItemController.getAllItems);
router.get("/stock-items/:id", stockItemController.getItem);
router.post("/stock-items", stockItemController.setItem);

export default router;