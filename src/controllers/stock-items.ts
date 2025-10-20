import type { Request, Response } from "express";

import type StockItemService from "../services/stock-items.js";
import type { ISellStockItemInput, ISellStockRequestBody, TCreateStockItem, TUpdateStockItem } from "../types/stock-items.js";

export default class StockItemsController {
    private stockItemService: StockItemService
    constructor(stockItemService: StockItemService) {
        this.stockItemService = stockItemService
    }

    // Get all the items in stock_items
    getAllItems = async (_: Request, res: Response) => {
        try {
            const result = await this.stockItemService.getAllStockItems()
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

    // getItem = async (req: Request, res: Response) => {
    //     const {id} = req.params;
    //     const stockItemId = Number(id);
    //     if(isNaN(stockItemId)) {
    //         return res.status(400).json({
    //             success: false,
    //             body: null,
    //             message: "Invalid ID"
    //         })
    //     }
    //     try {
    //         const result = await this.stockItemService.getStockItems(stockItemId)
    //         return res.status(200).json({
    //             success: true,
    //             body: result,
    //             message: `stock_item ${id} fetched successfully`
    //         })
    //     }

    //     catch(err) {
    //         if(err instanceof Error) {
    //             res.status(500).json({
    //                 success: false,
    //                 body: null,
    //                 message: err.message
    //             })
    //         }
    //         res.status(500).json({
    //             success: false,
    //             body: null,
    //             message: "Unknown message"
    //         })
    //     }
    // }

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

        // Check if required inputs exists and are not null
        const invalidItem = soldItems.find(item=> {
            const check = [
                item.sold_width,
                item.width,
                item.product_size_id,
                item.ID
            ].some(
                value=> value === undefined || value === null
            );
            if(check) {
                return true;
            }
            // if parent_id and single_product_code are undefined return true
            return item.single_product_code === undefined ? true : 
                item.parent_id === undefined ? true : false
        });
        // Check for invalid request
        if(invalidItem) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }

        try {
            // Get the marked items for sale
            const markedItems = await this.stockItemService.getStockItems(soldItems);

            for (const soldItem of soldItems) {
                const dbItem = markedItems.find(i=> i.ID === soldItem.ID);
                // No item found
                if (!dbItem) {
                    return res.status(404).json({
                        success: false,
                        body: null,
                        message: `item with ID ${soldItem.ID} not found`
                    })
                }
                // Item found but status = 0
                if (dbItem.status === 0) {
                    return res.status(409).json({
                        success: false,
                        body: null,
                        message: `item with ID ${soldItem.ID} not found`
                    })
                }
                console.log(dbItem, soldItem)
                // Width is not the same
                if (dbItem.width !== soldItem.width ||
                    dbItem.parent_id !== soldItem.parent_id
                ) {
                    return res.status(400).json({
                        success: false,
                        body: null,
                        message: "Conflict, request fields does not match"
                    })
                }
            }

            const newItems = soldItems.map(item=> {
                const { 
                    product_size_id, 
                    ID, 
                    sold_width, 
                    width,
                    single_product_code,
                    parent_id
                } = item;
                const finalWidth = width - (sold_width ?? 0);

                let code;

                if(parent_id) {
                    // parent_id and single_product_code are null
                    if (single_product_code) {
                        code = `${single_product_code}-${parent_id}`
                    }
                    // Just single_product_code is null
                    else {
                        code = `${parent_id}`
                    }
                }
                
                if (finalWidth < 0) {
                    throw new Error(`Conflict, cannot sell ${sold_width} units; only ${width} available`)
                }

                return {
                    ID,
                    product_size_id,
                    width: finalWidth,
                    parent_id: (item.ID ?? ''),
                    single_product_code: code
                }
            })
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
        catch(err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.errno === 1452) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'No product-size found'
                })
            }
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