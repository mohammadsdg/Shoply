import express from "express";
import StockItemsController from "../controllers/stock-items.ts";
const router = express.Router();

router.get("/stock-items", StockItemsController.getAllItems);
router.get("/stock-items/:id", StockItemsController.getItem);
router.post("/stock-items", StockItemsController.setItem);

export default router;