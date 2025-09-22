import express from "express";
import AlloysController from "../controllers/alloys.ts";
const router = express.Router();

router.get("/alloys", AlloysController.getAllAlloys);
router.get("/alloys/:id", AlloysController.getAlloy);
router.post("/alloys", AlloysController.setAlloy);
router.put("/alloys/:id", AlloysController.updateAlloy);
router.delete("/alloys/:id", AlloysController.deleteAlloy);


export default router;