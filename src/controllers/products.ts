import type { Request, Response } from "express";
import ProductsModel from "../models/products.ts";
export default class ProductsController {
    static async getAllProducts(_: Request, res: Response) {
        try {
            const result = await ProductsModel.getAllProducts();
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

    static async getProduct(req: Request, res: Response) {
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
            const result = await ProductsModel.getProduct(productId);
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

    static async setProduct(req: Request, res: Response) {
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
        const requiredFields = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        }
        try {
            const result = await ProductsModel.setProduct(requiredFields);
            if (result) {
                res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...requiredFields
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

    static async updateProduct(req: Request, res: Response) {
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
        const allowedFields = {
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        }
        try {
            const result = await ProductsModel.updateProduct(allowedFields, productId);
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

    static async deleteProduct(req: Request, res: Response) {
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
            const result = await ProductsModel.deleteProduct(productId);
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
        }
        return res.status(500).json({
            success: false,
            body: null,
            message: "Unknown error"
        })
    }
}