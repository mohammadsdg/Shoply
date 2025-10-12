
import type { Response, Request } from "express";
import MaterialService from "../services/materials.js";
import type { TCreateMaterial } from "../types/materials.js";
import type { TUpdateAlloyInput } from "../types/alloys.js";

export default class MaterialController {
    private materialService: MaterialService
    constructor(materialService: MaterialService) {
        this.materialService = materialService
    }
    getAllMaterials = async (_: Request, res: Response) => {
        try{
            const result = await this.materialService.getAllMaterials();
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

    getMaterial = async (req: Request, res: Response) => {
        const {id} = req.params;
        const materialId = Number(id);
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: 'Invalid request'
            })
        }
        try{
            const result = await this.materialService.getMaterial(materialId);
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

    setMaterial = async (req: Request, res: Response) => {
        const {name} = req.body;
        if(!name) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const materialData: TCreateMaterial = {
            name
        }
        try{
            const result = await this.materialService.setMaterial(materialData);
            res.status(201).json({
                success: true,
                body: {
                    ID: result,
                    ...materialData
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

    updateMaterial = async (req: Request, res: Response) => {
        const {id} = req.params;
        const materialId = Number(id);
        const {name} = req.body;

        if(!req.body.name && !req.params.id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const materialData: TUpdateAlloyInput = {
            name
        }
        try{
            const result = await this.materialService.updateMaterial(materialId, materialData);
            if(result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: materialId,
                        ...materialData
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

    deleteMaterial = async (req: Request, res: Response) => {
        const {id} = req.params;
        const materialId = Number(id);
        try{
            if(await this.materialService.deleteMaterial(materialId)) {
                res.status(200).json({
                    success: true,
                    body: req.params.id,
                    message: `Material ${req.params.id} removed successfully`
                })
            } else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Material found."
                })
            }
        }
        catch(err) {
            if(err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Internal server error"
                })
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown message"
            })
        }
    }
}