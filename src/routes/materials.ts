import experss from "express"
import MaterialService from "../services/materials.js";
import MaterialController from "../controllers/materials.js";
const router = experss.Router();

const materialService = new MaterialService();
const materialController = new MaterialController(materialService)
router.get('/materials', materialController.getAllMaterials);
router.get('/materials/:id', materialController.getMaterial);
router.post('/materials', materialController.setMaterial);
router.put('/materials/:id', materialController.updateMaterial);
router.delete('/materials/:id', materialController.deleteMaterial);

export default router;