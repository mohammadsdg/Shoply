import type { Request, Response } from "express";

import PreInvoiceService from "../services/pre-invoices.js";
import type { IPreInvoiceConditions, TCreatePreInvoiceInput } from "../types/pre-invoices.js";

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

    setPreInvoice = async(req: Request, res: Response) => {
        // Destructure Request Body
        const {
            weight,
            price,
            stock_item_id,
            customer_name
        } = req.body as TCreatePreInvoiceInput;

        const pendingData = {
            stock_item_id,
            weight,
            price,
            customer_name
        }

        const {customer_name: cName, ...required} = pendingData;

        if (Object.values(required).some(
            value=> value===null || 
            value===undefined || 
            typeof value !== 'number')
        ) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }

        try {
            const pendingItems = await this.preInVoiceService.setPending(pendingData);
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
}