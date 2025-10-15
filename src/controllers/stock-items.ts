import type { Request, Response } from "express";
import type StockItemService from "../services/stock-items.js";
import type { ISellStockItemInput, ISellStockRequestBody, TCreateStockItem, TUpdateStockItem } from "../types/stock-items.js";

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

    sellItem = async (req: Request, res: Response) => {
        // Destructuring datas from Request.params
        let { soldItems }
        = req.body as ISellStockRequestBody;

        if(!Array.isArray(soldItems)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "soldItems must be an array"
            })
        }

        console.log(soldItems);
        // Check if required inputs exists and are not null
        const invalidItem = soldItems.find(item=> 
            [item.sold_width, item.width, item.product_size_id, item.ID].some(
                value=> value === undefined || value === null
            )
        );
        if(invalidItem) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }

        const newItems = soldItems.map(item=> {
            const { product_size_id, width, ID, sold_width } = item;
            const finalWidth = width - (sold_width ?? 0);
            const timeInMilliSecond = new Date().getTime();
            return {
                ID,
                product_size_id,
                width: finalWidth,
                parent_id: (item.ID ?? null),
                single_product_code: `${item.ID}-${finalWidth}-${timeInMilliSecond}`
            }
        })
        try {
            const stockItemData = await this.stockItemService.sellStockItem(newItems);
            if(stockItemData) {
                return res.status(201).json({
                    success: true,
                    body: stockItemData,
                    message: "Purchase items successfully"
                })
            }
        }
        // Error
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

    // delete item from stock-item by id
    // deleteItem = async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     // deleteStockItem uses number not string
    //     const itemId = Number(id);

    //     try {
    //         // If found delete item
    //         if (await this.stockItemService.deleteStockItem(itemId)) {
    //             return res.status(200).json({
    //                 success: true,
    //                 body: itemId,
    //                 message: `item ${id} deleted successfully from stock_items`
    //             })
    //         }
    //         // If not found
    //         else {
    //             return res.status(404).json({
    //                 success: false,
    //                 body: null,
    //                 message: 'No item found with this id'
    //             })
    //         }
    //     }
    //     // Error
    //     catch(err) {
    //         if(err instanceof Error) {
    //             return res.status(500).json({
    //                 success: false,
    //                 body: null,
    //                 message: err.message
    //             })
    //         }
    //         return res.status(500).json({
    //             success: false,
    //             body: null,
    //             message: "Unknown Error"
    //         })
    //     }
    // }
}