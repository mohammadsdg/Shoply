import MaterialService from "../services/materials.js";
export default class MaterialController {
    materialService;
    constructor(materialService) {
        this.materialService = materialService;
    }
    getAllMaterials = async (_, res) => {
        try {
            const result = await this.materialService.getAllMaterials();
            res.status(200).json({
                success: true,
                body: result,
                message: "All materials fetched successfully"
            });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            });
        }
    };
    getMaterial = async (req, res) => {
        const { id } = req.params;
        const materialId = Number(id);
        if (!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: 'Invalid request'
            });
        }
        try {
            const result = await this.materialService.getMaterial(materialId);
            res.status(200).json({
                success: true,
                body: result,
                message: `Material ${id} fetched successfully`
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            });
        }
    };
    setMaterial = async (req, res) => {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const materialData = {
            name
        };
        try {
            const result = await this.materialService.setMaterial(materialData);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...materialData
                },
                message: "Material created successfully"
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            });
        }
    };
    updateMaterial = async (req, res) => {
        const { id } = req.params;
        const materialId = Number(id);
        const { name } = req.body;
        if (!req.body.name && !req.params.id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const materialData = {
            name
        };
        try {
            const result = await this.materialService.updateMaterial(materialId, materialData);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: materialId,
                        ...materialData
                    },
                    message: `Material ${req.params.id} updated`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Material found."
                });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            });
        }
    };
    deleteMaterial = async (req, res) => {
        const { id } = req.params;
        const materialId = Number(id);
        try {
            if (await this.materialService.deleteMaterial(materialId)) {
                res.status(200).json({
                    success: true,
                    body: req.params.id,
                    message: `Material ${req.params.id} removed successfully`
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Material found."
                });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Internal server error"
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            });
        }
    };
}
//# sourceMappingURL=materials.js.map