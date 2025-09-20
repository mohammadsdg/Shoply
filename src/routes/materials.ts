import experss from "express"
import MaterialsController from "../controllers/materials.ts";
const router = experss.Router();

router.get('/materials', MaterialsController.getAllMaterials);
router.get('/materials/:id', MaterialsController.getMaterial);
router.post('/materials', MaterialsController.setMaterial);
router.put('/materials/:id', MaterialsController.updateMaterial);
router.delete('/materials/:id', MaterialsController.deleteMaterial);

export default router;