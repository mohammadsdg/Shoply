import experss from "express"
import MaterialsController from "../controllers/materials.ts";
import MaterialService from "../services/materials.ts";
import MaterialController from "../controllers/materials.ts";
const router = experss.Router();

const materialService = new MaterialService();
const materialController = new MaterialController(materialService)
router.get('/materials', materialController.getAllMaterials);
router.get('/materials/:id', materialController.getMaterial);
router.post('/materials', materialController.setMaterial);
router.put('/materials/:id', materialController.updateMaterial);
router.delete('/materials/:id', materialController.deleteMaterial);

export default router;