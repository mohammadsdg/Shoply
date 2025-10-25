import type { Request, Response } from "express";

import PreInvoiceService from "../services/pre-invoices.js";
import type { 
    IPreInvoiceApprovedRequest, 
    IPreInvoiceConditions, 
    IPreInvoiceRequestBody, 
    TCreatePreInvoiceInput, 
    TUpdatePreInvoiceInput 
} from "../types/pre-invoices.js";

export default class PreInvoiceController {
    // Create a private PreInvoiceService instance
    private preInVoiceService: PreInvoiceService;
    constructor(preInVoiceService: PreInvoiceService) {
        this.preInVoiceService = preInVoiceService
    }

    // Get all the items of a stock that are pending to be approved
    getAllPreInvoices = async (req: Request, res: Response) => {
        
        const { status } = req.query;

        if (status !== 'pending' && status !== 'approved') {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        
        const conditions: IPreInvoiceConditions = {
            status: status
        }

        try {
            const pendingItems = await this.preInVoiceService.getAllPreInvoices(conditions);
            return res.status(200).json({
                success: true,
                body: pendingItems,
                message: `All ${status} items received successfully`
            })
        }
        catch(err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    status: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    // Create pending item
    setPreInvoice = async(req: Request, res: Response) => {
        // Destructuring datas from Request.body
        const {
            customer_name,
            number,
            price,
            stock_item_id,
            weight
        } = req.body as TCreatePreInvoiceInput
        // Check if request is valid
        if (
            !customer_name ||
            !number ||
            !price ||
            !stock_item_id ||
            !weight
        ) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }

        const preInvoicePendingInput = {
            customer_name,
            number,
            price,
            stock_item_id,
            weight
        }
        // Sending request to mysql and return a response
        try {

            const pendingItems = await this.preInVoiceService.setPending(preInvoicePendingInput);
            return res.status(201).json({
                success: false,
                body: pendingItems,
                message: 'item is successfully pending to be approved'
            })
            
        }
        catch(err) {
            console.log(err);
            // handle Mysql-specifig errors safely
            if (typeof err === 'object' && err !== null) {
                const anyErr = err as any
                if(anyErr.code === 'ER_NO_REFERENCED_ROW_2' && anyErr.errno === 1452) {
                    return res.status(400).json({
                        status: false,
                        body: null,
                        message: 'Foreign key constraint failed',
                    });
                }
            }
            if (err instanceof Error) {
                return res.status(500).json({
                    status: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    // Update multiple pre_invoice.status from pending to approved
    updatePreInvoice = async(req: Request, res: Response) => {
        // Destructure datas from Request.body
        const {
            pending_items: pendingItems,
            sold_items: soldItems
        } = req.body as IPreInvoiceApprovedRequest;


        if (!Array.isArray(pendingItems) || !Array.isArray(soldItems)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }

        // Check if required sold inputs exists and are not null
        const invalidSoldItem = soldItems.find(item=> {
            const checkExists = [
                item.sold_width,
                item.width,
                item.product_size_id,
                item.ID
            ].some(
                value=> value === undefined || value === null
            );
            if(checkExists) {
                return true;
            }
            // if parent_id and single_product_code are undefined return true
            return item.single_product_code === undefined ? true : 
                item.parent_id === undefined ? true : false
        });
        // Check if required approved inputs exists and are not null
        const invalidMarkedItem = pendingItems.find(item=> {
            const checkExists = [
                item.ID,
                item.customer_name,
                item.number,
                item.price,
                item.status,
                item.stock_item_id,
                item.weight,
            ].some(value=> value === undefined || value === null);
            if (checkExists) {
                return true;
            }
        })
        // Check if request is valid
        if (invalidMarkedItem || invalidSoldItem) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        // Sending a request to approve pendingItems and create new items
        try {
            const result = await this.preInVoiceService.setApproved(pendingItems, soldItems);
            return res.status(200).json({
                success: true,
                body: result,
                message: "pre-invoice updated successfully"
            })
        }
        catch(err) {
            console.log(err);
            // handle Mysql-specifig errors safely
            if (typeof err === 'object' && err !== null) {
                const anyErr = err as any
                if(anyErr.code === 'ER_NO_REFERENCED_ROW_2' && anyErr.errno === 1452) {
                    return res.status(400).json({
                        status: false,
                        body: null,
                        message: 'Foreign key constraint failed',
                    });
                }
            }
            if (err instanceof Error) {
                return res.status(500).json({
                    status: false,
                    body: null,
                    message: err.message
                })
            }
            return res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }
}