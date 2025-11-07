import BrandService from "../services/brands.js";
export default class BrandController {
    brandService;
    constructor(brandService) {
        this.brandService = brandService;
    }
    // Get all brands
    getAllBrands = async (_, res) => {
        try {
            const result = await this.brandService.getAllBrands();
            res.status(200).json({
                success: true,
                body: result,
                message: "All brands fetched successfully"
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
        }
    };
    // Get one brand by id
    getBrand = async (req, res) => {
        const { id } = req.params;
        const brandId = Number(id);
        if (!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        try {
            const result = await this.brandService.getBrand(brandId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Brand ${id} fetched successfully`
                });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
        }
    };
    // Create brand with user_id, name, info
    setBrand = async (req, res) => {
        const { user_id, name } = req.body;
        if (!user_id || !name) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const brandFields = {
            user_id,
            name
        };
        try {
            const result = await this.brandService.setBrand(brandFields);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...brandFields
                },
                message: "Brand created successfully"
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
        }
    };
    // Update brand with 
    updateBrand = async (req, res) => {
        const { id } = req.params;
        const brandId = Number(id);
        const { name, info } = req.body;
        if (!name || !id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const brandData = {
            name,
        };
        try {
            const result = await this.brandService.updateBrand(brandId, brandData);
            return res.status(200).json({
                success: true,
                body: {
                    ID: result,
                    ...brandData
                },
                message: `Brand ${id} updated successfully`
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Unknown Error"
                });
            }
        }
    };
    deleteBrand = async (req, res) => {
        const { id } = req.params;
        const brandId = Number(id);
        try {
            const result = await this.brandService.deleteBrand(brandId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Brand ${id} deleted`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No brand found."
                });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Unknown message"
                });
            }
        }
    };
}
//# sourceMappingURL=brands.js.map