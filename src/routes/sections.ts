import express from "express";
import SectionsController from "../controllers/sections.js";
import SectionService from "../services/sections.js";
const router = express.Router();

const sectionService = new SectionService();
const sectionController = new SectionsController(sectionService);
router.get("/sections", sectionController.getAllSections)
router.get("/sections/:id", sectionController.getSection)
router.post("/sections", sectionController.setSection)
router.put("/sections/:id", sectionController.updateSection)
router.delete("/sections/:id", sectionController.deleteSection)

export default router;