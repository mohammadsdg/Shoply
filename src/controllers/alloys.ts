import type { Request, Response } from "express";
import AlloysModel from "../models/alloys.ts"

export default class AlloysController {
    static async getAllAlloys(req:Request, res:Response) {
        try{
            const result = await AlloysModel.getAllAlloys();
            res.status(200).json({
                success: true,
                body: result,
                message: "All alloys fetched successfully"
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

    static async getAlloy(req:Request, res:Response) {
        const {id} = req.params;
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Internal server"
            })
        }
        try{
            const result = await AlloysModel.getAlloy(id);
            if(result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Alloy ${id} fetched successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Alloy found"
                })
            }
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

    static async setAlloy(req:Request, res:Response) {
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
            const result = await AlloysModel.setAlloy(allowedFileds);
            if (result) {
                res.status(201).json({
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
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
        }
    }

    static async updateAlloy(req:Request, res:Response) {
        const {material_id, name, code, cutting_speed} = req.body;
        const {id} = req.params;
        const alloyId = Number(id);
        if(!material_id || !name || !code || !cutting_speed || !alloyId) {
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
            const result = await AlloysModel.updateAlloy(allowedFileds, alloyId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: alloyId,
                        ...allowedFileds
                    },
                    message: `Alloy ${alloyId} updated successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: `No Alloy found`
                })
            }
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

    static async deleteAlloy(req:Request, res:Response) {
        const {id} = req.params;
        
        try{
            const result = await AlloysModel.deleteAlloy(id);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Alloy ${id} deleted successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No alloy found."
                })
            }
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
}