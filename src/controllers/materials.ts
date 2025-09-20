import MaterialsModel from "../models/materials.ts"
import type { Response, Request } from "express";

export default class MaterialsController {
    static async getAllMaterials(req: Request, res: Response) {
        try{
            const result = await MaterialsModel.getAllMaterials();
            res.status(200).json({
                success: true,
                body: result,
                message: "All materials fetched successfully"
            })
        }
        catch(err: any) {
            res.status(500).json({
                success: false,
                body: null,
                message: err.message
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
            res.status(500).json({
                success: false,
                body: null,
                message: 'Internal server error'
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
            res.status(500).json({
                success: false,
                body: null,
                message: err.message
            })
        }
    }

    static async updateMaterial(req: Request, res: Response) {

    }

    static async deleteMaterial(req: Request, res: Response) {

    }
}