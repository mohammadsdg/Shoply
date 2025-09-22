import type { Request, Response } from "express";
import DimensionsModel from "../models/dimensions.ts";

export default class DimensionsController {
    static async getAllDimensions(_: Request, res: Response) {
        try{
            const result = await DimensionsModel.getAllDimensions();
            res.status(200).json({
                success: true,
                body: result,
                message: "Fetched all dimensions successfully"
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
        }
    }

    static async getDimension(req: Request, res: Response) {
        const {id} = req.params;
        const dimensionId = Number(id);
        if(isNaN(dimensionId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }

        try{
            const result = await DimensionsModel.getDimension(dimensionId);
            if(result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Dimension ${dimensionId} fetched successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No dimension found."
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
    
    static async setDimension(req: Request, res: Response) {
        const { dimensions } = req.body;
        if (dimensions === undefined || dimensions === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFileds = {
            dimensions
        }
        try {
            const result = await DimensionsModel.setDimension(allowedFileds);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...allowedFileds
                },
                message: "dimension created successfully"
            })
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    messsage: err.message
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            })
        }
    }

    static async updateDimension(req: Request, res: Response) {
        const {dimensions} = req.body;
        const {id} = req.params;
        const dimensionId = Number(id);
        if(isNaN(dimensionId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFileds = {
            dimensions
        }
        try{
            const result = await DimensionsModel.updateDimension(allowedFileds, dimensionId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFileds
                    },
                    message: `dimensions ${dimensionId} updated successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No dimension found."
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

    static async deleteDimension(req: Request, res: Response) {
        const {id} = req.params;
        const dimensionId = Number(id);

        if(isNaN(dimensionId)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }

        try {
            const result = await DimensionsModel.deleteDimension(dimensionId);
            if(result) {
                res.status(200).json({
                    success: false,
                    body: result,
                    message: `dimension ${dimensionId} deleted successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Dimension found"
                })
            }
        }
        catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
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