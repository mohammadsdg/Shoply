import express from "express";
import SectionsController from "../controllers/sections.ts";
const router = express.Router();

router.get("/sections", SectionsController.getAllSections)
router.get("/sections/:id", SectionsController.getSection)
router.post("/sections", SectionsController.setSection)
router.put("/sections/:id", SectionsController.updateSection)
// router.delete("/sections/:id", SectionsController.getAllSections)

export default router;