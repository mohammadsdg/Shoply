export default class ShopProductsController {
    shopProductService;
    constructor(shopProductService) {
        this.shopProductService = shopProductService;
    }
    // Get all the shops with their products
    getAllShopProducts = async (_, res) => {
        try {
            const result = await this.shopProductService.getAllShopProducts();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All shop-products fetched successfully"
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
    // Get shop with its products
    getShopProduct = async (req, res) => {
        const { id } = req.params;
        const shopProductId = Number(id);
        if (isNaN(shopProductId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            });
        }
        try {
            const result = await this.shopProductService.getShopProducts(shopProductId);
            return res.status(200).json({
                success: true,
                body: result,
                message: `Shop-product ${shopProductId} fetched successfully`
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
    // Create product for a shop
    setShopProduct = async (req, res) => {
        const { shop_id, product_id } = req.body;
        if (shop_id === undefined
            || shop_id === null
            || product_id === undefined
            || product_id === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const allowedFields = {
            shop_id,
            product_id
        };
        try {
            const createdProductId = await this.shopProductService.setShopProduct(allowedFields);
            return res.status(201).json({
                success: true,
                body: {
                    ID: createdProductId,
                    ...allowedFields
                },
                message: `shop-product ${createdProductId} created successfully`
            });
        }
        catch (err) {
            if (err.code === "ER_DUP_ENTRY" && err.errno === 1062) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "یک محصول با این نام در این فروشگاه وجود دارد"
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: err.message || "Internal server error"
            });
        }
    };
    // Update product for a shop
    updateShopProduct = async (req, res) => {
        const { id } = req.params;
        const shopProductId = Number(id);
        const { shop_id, product_id } = req.body;
        if (isNaN(shopProductId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            });
        }
        if (shop_id === undefined
            || shop_id === null
            || product_id === undefined
            || product_id === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const allowedFields = {
            shop_id,
            product_id
        };
        try {
            const result = await this.shopProductService.updateShopProduct(shopProductId, allowedFields);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: shopProductId,
                        ...allowedFields
                    },
                    message: `shop-product ${shopProductId} updated successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop-product found."
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
    // Delete product for a shop
    deleteShopProduct = async (req, res) => {
        const { id } = req.params;
        const shopProductId = Number(id);
        if (isNaN(shopProductId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            });
        }
        try {
            const result = await this.shopProductService.deleteShopProduct(shopProductId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: shopProductId,
                    message: `shop-product ${shopProductId} deleted successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop-product found."
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
}
//# sourceMappingURL=shop-products.js.map