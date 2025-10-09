import StockItemsModel from "../models/stock-items.ts";
import type { Request, Response } from "express";
import type StockItemService from "../services/stock-items.ts";

export default class StockItemsController {
    private stockItemService: StockItemService
    constructor(stockItemService: StockItemService) {
        this.stockItemService = stockItemService
    }
    getAllItems = async (_: Request, res: Response) => {
        try {
            const result = this.stockItemService.getAllStockItems()
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

    getItem = async (req: Request, res: Response) => {
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
            const result = await this.stockItemService.getStockItem(stockItemId)
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

    setItem = async (req: Request, res: Response) => {
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
            // const result = 
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

    updateItem = async (req: Request, res: Response) => {
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

    deleteItem = async (req: Request, res: Response) => {
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