import type { Request, Response } from "express";
import DimensionService from "../services/dimensions.js";

export default class DimensionsController {
    private dimensionService: DimensionService;
    constructor(dimensionService: DimensionService) {
        this.dimensionService = dimensionService
    }
    getAllDimensions = async (_: Request, res: Response) => {
        try{
            const result = await this.dimensionService.getAllDimensions();
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

    getDimension = async (req: Request, res: Response) => {
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
            const result = await this.dimensionService.getDimension(dimensionId);
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
    
    setDimension = async (req: Request, res: Response) => {
        const { user_id, dimensions } = req.body;
        if (user_id === undefined || dimensions === undefined || dimensions === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const dimensionData = {
            user_id,
            dimensions
        }
        try {   
            const result = await this.dimensionService.setDimension(dimensionData);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...dimensionData
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

    updateDimension = async (req: Request, res: Response) => {
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
        const dimensionData = {
            dimensions
        }
        try{
            const result = await this.dimensionService.updateDimension(dimensionId, dimensionData);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        dimensions
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

    deleteDimension = async (req: Request, res: Response) => {
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
            const result = await this.dimensionService.deleteDimension(dimensionId);
            if(result) {
                res.status(200).json({
                    success: false,
                    body: dimensionId,
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