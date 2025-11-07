import express from "express";
import DimensionsController from "../controllers/dimensions.js";
import DimensionService from "../services/dimensions.js";
const router = express.Router();
const dimensionService = new DimensionService();
const dimensionsController = new DimensionsController(dimensionService);
router.get("/dimensions", dimensionsController.getAllDimensions);
router.get("/dimensions/:id", dimensionsController.getDimension);
router.post("/dimensions", dimensionsController.setDimension);
router.put("/dimensions/:id", dimensionsController.updateDimension);
router.delete("/dimensions/:id", dimensionsController.deleteDimension);
export default router;
//# sourceMappingURL=dimensions.js.map