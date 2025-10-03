import type { Request, Response } from "express";
import ShopProductsModel from "../models/shop-products.ts";

export default class ShopProductsController {
    static async getAllShopProducts(_: Request, res: Response) {
        try {
            const result = await ShopProductsModel.getAllShopProduct();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All shop-products fetched successfully"
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

    static async getShopProduct(req: Request, res: Response) {
        const {id} = req.params;
        const shopProductId = Number(id);
        if (isNaN(shopProductId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }
        console.log('s')
        try {
            const result = await ShopProductsModel.getShopProduct(shopProductId);
            return res.status(200).json({
                success: true,
                body: result,
                message: `Shop-product ${shopProductId} fetched successfully`
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

    static async setShopProduct(req: Request, res: Response) {
        const {shop_id, product_id} = req.body;
        if(shop_id === undefined 
            || shop_id === null 
            || product_id === undefined
            || product_id === null
        ) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            shop_id,
            product_id
        }
        try {
            const result = await ShopProductsModel.setShopProduct(allowedFields);
            return res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...allowedFields
                },
                message: `shop-product ${result} created successfully`
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
                message: "Unknown message"
            })
        }
    }

    static async updateShopProduct(req: Request, res: Response) {
        const {id} = req.params;
        const shopProductId = Number(id);
        const {shop_id, product_id} = req.body;

        if(isNaN(shopProductId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }

        if(shop_id === undefined 
            || shop_id === null 
            || product_id === undefined
            || product_id === null
        ) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            shop_id,
            product_id
        }
        try {
            const result = await ShopProductsModel.updateShopProduct(allowedFields, shopProductId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: shopProductId,
                        ...allowedFields
                    },
                    message: `shop-product ${shopProductId} updated successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop-product found."
                })
            }
        }
        catch(err) {
            if (err instanceof Error) {
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

    static async deleteShopProduct(req: Request, res: Response) {
        const {id} = req.params;
        const shopProductId = Number(id);
        if(isNaN(shopProductId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }
        try{
            const result = await ShopProductsModel.deleteShopProduct(shopProductId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: shopProductId,
                    message: `shop-product ${shopProductId} deleted successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop-product found."
                })
            }
        }
        catch(err) {
            if (err instanceof Error) {
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
}