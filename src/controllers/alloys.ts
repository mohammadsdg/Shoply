import type { Request, Response } from "express";
import AlloyService from "../services/alloys.ts";

export default class AlloysController {
    private alloyService: AlloyService
    constructor(alloyService: AlloyService) {
        this.alloyService = alloyService
    }
    getAllAlloys = async (_:Request, res:Response) =>  {
        try{
            const result = await this.alloyService.getAllAlloys();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All alloys fetched successfully"
            })
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
                message: "Unknown message"
            })
        }
    }

    getAlloy = async (req:Request, res:Response) => {
        const {id} = req.params;
        const alloyId = Number(id);
        if(!id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Internal server"
            })
        }
        try{
            const result = await this.alloyService.getAlloy(alloyId);
            if(result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Alloy ${id} fetched successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Alloy found"
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
        }
    }

    setAlloy = async (req:Request, res:Response) => {
        const {material_id, name, code, cutting_speed} = req.body;
        if(!material_id || !name || !code || !cutting_speed) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFileds = {
            material_id,
            name,
            code,
            cutting_speed
        }
        try{
            const result = await this.alloyService.setAlloy(allowedFileds);
            if (result) {
                return res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFileds
                    },
                    message: "Alloy created successfully"
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
        }
    }

    updateAlloy = async (req:Request, res:Response) => {
        const {material_id, name, code, cutting_speed} = req.body;
        const {id} = req.params;
        const alloyId = Number(id);
        if(!material_id || !name || !code || !cutting_speed || !alloyId) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFileds = {
            material_id,
            name,
            code,
            cutting_speed
        }
        try{
            const result = await this.alloyService.updateAlloy(alloyId, allowedFileds);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: alloyId,
                        ...allowedFileds
                    },
                    message: `Alloy ${alloyId} updated successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: `No Alloy found`
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
        }
    }

    deleteAlloy = async (req:Request, res:Response) => {
        const {id} = req.params;
        const alloyId = Number(id);
        try{
            const result = await this.alloyService.deleteAlloy(alloyId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Alloy ${id} deleted successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No alloy found."
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
        }
    }
}