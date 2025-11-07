import express from "express";
import AlloysController from "../controllers/alloys.js";
import AlloyService from "../services/alloys.js";
const router = express.Router();
const alloyService = new AlloyService();
const alloyController = new AlloysController(alloyService);
router.get("/alloys", alloyController.getAllAlloys);
router.get("/alloys/:id", alloyController.getAlloy);
router.post("/alloys", alloyController.setAlloy);
router.put("/alloys/:id", alloyController.updateAlloy);
router.delete("/alloys/:id", alloyController.deleteAlloy);
export default router;
//# sourceMappingURL=alloys.js.map