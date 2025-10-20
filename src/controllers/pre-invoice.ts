import type { Request, Response } from "express";

import PreInvoiceService from "../services/pre-invoice.js";

export default class PreInvoiceController {
    private preInVoiceService: PreInvoiceService;
    constructor(preInVoiceService: PreInvoiceService) {
        this.preInVoiceService = preInVoiceService
    }
    // Get all the items of a stock that are pending to be approved
    getAllPendings = async (_: Request, res: Response) => {
        try {
            const pendingItems = await this.preInVoiceService.getAllPending();
            res.status(200).json({
                success: true,
                body: pendingItems,
                message: "All pending items received successfully"
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
            res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    // Get all the items of a stock that have been approved
    getAllApproved = async (_: Request, res: Response) => {
        try {
            const approvedItems = await this.preInVoiceService.getAllApproved();
            res.status(200).json({
                success: true,
                body: approvedItems,
                message: "All approved items received successfully"
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
            res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }


}