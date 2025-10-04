import StockItemsModel from "../models/stock-items.ts";
import type { Request, Response } from "express";

export default class StockItemsController {
    static async getAllItems(_: Request, res: Response) {
        try {
            const result = await StockItemsModel.getAllItems();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All Stock-items fetched successfully"
            })
        }

        catch(err) {
            if(err instanceof Error){
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

    static async getItem(req: Request, res: Response) {
        const {id} = req.params;
        const stockItemId = Number(id);
        if(isNaN(stockItemId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }
        try {
            const result = await StockItemsModel.getItem(stockItemId);
            return res.status(200).json({
                success: true,
                body: result,
                message: `stock_item ${id} fetched successfully`
            })
        }

        catch(err) {
            if(err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async setItem(req: Request, res: Response) {
        const {
            product_size_id, 
            single_product,
        } = req.body;
        const allowedData = {
            product_size_id, 
            single_product,
        }

        if(Object.values(allowedData).some(
            val=> val===undefined || val===null
        ))
        try {
            // const result = await StockItemsModel.setItem(allowedData, );
            return res.status(201).json({
                success: true,
                body: {
                    // ID: result,
                    ...allowedData,
                },
                message: "Stock-item created successfully"
            })
        }

        catch(err) {
            if(err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async updateItem(req: Request, res: Response) {
        try {
            
        }

        catch(err) {
            if(err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
            res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async deleteItem(req: Request, res: Response) {
        try {

        }

        catch(err) {
            if(err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }

            res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }
}