import MaterialsModel from "../models/materials.ts"
import type { Response, Request } from "express";
import MaterialService from "../services/materials.ts";

const materialService = new MaterialService();

export default class MaterialController {
    static async getAllMaterials(_: Request, res: Response) {
        try{
            const result = await materialService.getAllMaterials();
            res.status(200).json({
                success: true,
                body: result,
                message: "All materials fetched successfully"
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
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async getMaterial(req: Request, res: Response) {
        const {id} = req.params;
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: 'Invalid request'
            })
        }
        try{
            const result = await MaterialsModel.getMaterial(id);
            res.status(200).json({
                success: true,
                body: result,
                message: `Material ${id} fetched successfully`
            })
        }
        catch(err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async setMaterial(req: Request, res: Response) {
        const {name} = req.body;
        if(!name) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await MaterialsModel.setMaterial(name);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...req.body
                },
                message: "Material created successfully"
            })
        }
        catch(err: any) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async updateMaterial(req: Request, res: Response) {
        if(!req.body.name && !req.params.id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await materiser.updateMaterial(req.body.name, req.params.id);
            console.log(result)
            if(result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        name: req.body.name,
                        ID: result
                    },
                    message: `Material ${req.params.id} updated`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Material found."
                })
            }
        }
        catch(err: any) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: 'Internal server error'
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async deleteMaterial(req: Request, res: Response) {

    }
}