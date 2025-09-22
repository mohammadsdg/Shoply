import express from "express";
import DimensionsController from "../controllers/dimensions.ts";
const router = express.Router();

router.get("/dimensions", DimensionsController.getAllDimensions);
router.get("/dimensions/:id", DimensionsController.getDimension);
router.post("/dimensions", DimensionsController.setDimension);
router.put("/dimensions/:id", DimensionsController.updateDimension);
router.delete("/dimensions/:id", DimensionsController.deleteDimension);

export default router;