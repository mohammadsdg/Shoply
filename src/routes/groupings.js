import express from "express";
import GroupingsController from "../controllers/groupings.js";
import GroupingService from "../services/groupings.js";
const router = express.Router();
const groupingService = new GroupingService();
const groupingController = new GroupingsController(groupingService);
router.get("/groupings", groupingController.getAllGroupings);
router.get("/groupings/:id", groupingController.getGrouping);
router.post("/groupings", groupingController.postGrouping);
router.put("/groupings/:id", groupingController.updateGrouping);
router.delete("/groupings/:id", groupingController.deleteGrouping);
export default router;
//# sourceMappingURL=groupings.js.map