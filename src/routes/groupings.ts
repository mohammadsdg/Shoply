import express from "express";
import GroupingsController from "../controllers/groupings.ts";
const router = express.Router();

router.get("/groupings", GroupingsController.getAllGroupings);
router.get("/groupings/:id", GroupingsController.getGrouping);
router.post("/groupings", GroupingsController.postGrouping);
router.put("/groupings/:id", GroupingsController.updateGrouping);
router.delete("/groupings/:id", GroupingsController.deleteGrouping)

export default router;