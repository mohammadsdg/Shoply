import ProductService from "../services/products.js";
export default class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    // Get all products name
    getAllProducts = async (_, res) => {
        try {
            const result = await this.productService.getAllProducts();
            res.status(200).json({
                success: true,
                body: result,
                message: "All products fetched successfully"
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
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            });
        }
    };
    // Get product by ID
    getProduct = async (req, res) => {
        const { id } = req.params;
        const productId = Number(id);
        if (isNaN(productId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            });
        }
        try {
            const result = await this.productService.getProduct(productId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: "200"
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No product found."
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
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            });
        }
    };
    // Create product
    setProduct = async (req, res) => {
        const { alloy_id, section_id, brand_id, grouping_id, material_id } = req.body;
        if (!alloy_id || !section_id || !brand_id || !grouping_id || !material_id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const productData = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        };
        try {
            const result = await this.productService.setProduct(productData);
            if (result) {
                res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...productData
                    },
                    message: "new product created successfully"
                });
            }
        }
        catch (err) {
            if (err.code === 'ER_DUP_ENTRY' && err.errno === 1062) {
                return res.status(422).json({
                    success: false,
                    body: null,
                    message: "یک ایتم با این مشخصات وجود دارد"
                });
            }
            if (err.code === "ER_NO_REFERENCED_ROW_2" && err.errno === 1452) {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "این ایتم به رکوردی اشاره میکند که وجود ندارد"
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: err.message || "Internal server error"
            });
        }
    };
    // Update product by their alloy_id, section_id, brand_id, grouping_id, material_id
    updateProduct = async (req, res) => {
        const { alloy_id, section_id, brand_id, grouping_id, material_id } = req.body;
        const { id } = req.params;
        const productId = Number(id);
        if (!alloy_id || !section_id || !brand_id || !grouping_id || !material_id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const productData = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        };
        try {
            const updatedProductId = await this.productService.updateProduct(productId, productData);
            if (updatedProductId) {
                return res.status(200).json({
                    success: false,
                    body: {
                        ID: productId,
                        ...productData
                    },
                    message: `product ${productId} updated successfully`
                });
            }
        }
        catch (err) {
            if (err.code === "ER_NO_REFERENCED_ROW_2" && err.errno === 1452) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "این ایتم به مرجعی اشاره میکند که وجود ندارد"
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: err.message || "Internal server error"
            });
        }
    };
    deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const productId = Number(id);
            if (isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid ID"
                });
            }
            const result = await this.productService.deleteProduct(productId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: productId,
                    message: `product ${productId} deleted successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No product found"
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
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            });
        }
    };
}
//# sourceMappingURL=products.js.map