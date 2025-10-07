import type { Request, Response } from "express";
import ProductService from "../services/products.ts";
export default class ProductController {
    private productService: ProductService;
    constructor(productService: ProductService) {
        this.productService = productService
    }

    getAllProducts = async (_: Request, res: Response) => {
        try {
            const result = await this.productService.getAllProducts();
            res.status(200).json({
                success: true,
                body: result,
                message: "All products fetched successfully"
            })
        }
        catch(err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }

    getProduct = async (req: Request, res: Response) => {
        const {id} = req.params;
        const productId = Number(id);
        if(isNaN(productId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }
        try {
            const result = await this.productService.getProduct(productId);
            if(result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: "200"
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No product found."
                })
            }
        }
        catch(err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }

    setProduct = async (req: Request, res: Response) => {
        const {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        } = req.body;
        if (!alloy_id || !section_id || !brand_id || !grouping_id || !material_id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const productData = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        }
        try {
            const result = await this.productService.setProduct(productData)
            if (result) {
                res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...productData
                    },
                    message: "new product created successfully"
                })
            }
        }
        catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }

    updateProduct = async (req: Request, res: Response) => {
        const {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        } = req.body;
        const {id} = req.params;
        const productId = Number(id);
        if (!alloy_id || !section_id || !brand_id || !grouping_id || !material_id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const productData = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        }
        try {
            const result = await this.productService.updateProduct(productId, productData)
            return res.status(200).json({
                success: false,
                body: {
                    ID: productId,
                    ...productData
                },
                message: `product ${productId} updated successfully`
            })
        }
        catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const productId = Number(id);
            if (isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid ID"
                })
            }
            const result = await this.productService.deleteProduct(productId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: productId,
                    message: `product ${productId} deleted successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No product found"
                })
            }
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }
}