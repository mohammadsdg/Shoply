import type { Response, Request } from "express";
import SectionService from "../services/sections.ts";
import type { TCreateSection, TUpdateSection } from "../types/sections.ts";

export default class SectionsController {
    private sectionService: SectionService;
    constructor(sectionService: SectionService) {
        this.sectionService = sectionService
    }
    getAllSections = async (_: Request, res: Response) => {
        console.log('sssss')
        try{
            const result = await this.sectionService.getAllSection()
            res.status(200).json({
                success: true,
                body: result,
                message: "All sections fetched successfully"
            })
        }
        catch(error) {
            if(error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                })
            }
            else if (error && typeof error === 'object' && 'message' in error) {
                return {
                    success: false,
                    body: null,
                    message: error.message
                }
            }
        }
    }

    getSection = async (req: Request, res: Response) => {
        const {id} = req.params;
        const sectionId = Number(id);
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await this.sectionService.getSection(sectionId);
            if(result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Section ${id} fetched successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: `No section found with this ID`
                })
            }
        }
        catch(error) {
            if(error instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                })
            }
        }
    }

    setSection = async (req: Request, res: Response) => {
        const {name, params, param_one, param_two, param_three} = req.body;
        const allowedFields: TCreateSection = {
            name,
            params,
            param_one,
            param_two: null,
            param_three: null
        }
        if (!name || !params || !param_one) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        if (params===2) {
            if(!param_two) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
                })
            } else {
                allowedFields.param_two = param_two
            }
        }
        if(params===3 && !param_three) {
            if(!param_three) {
                allowedFields.param_three = param_three
            } 
            else {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
                })
            }
        }
        try{
            const result = await this.sectionService.setSection(allowedFields)
            if (result) {
                res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFields
                    },
                    message: "Section created successfully"
                })
            }
        }
        catch(error) {
            if(error instanceof Error)
            res.status(500).json({
                success: false,
                body: null,
                message: error.message
            })
        }
    }

    updateSection = async (req: Request, res: Response) => {
        const {name, params, param_one, param_two, param_three} = req.body;
        const {id} = req.params;
        const sectionId = Number(id);
        const allowedFields: TUpdateSection = {
            name,
            params,
            param_one,
            param_two: null,
            param_three: null
        }
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        if (params===1) {
            if(!param_one) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
                })
            } else {
                allowedFields.param_one = param_one
            }
        }
        if (params===2) {
            if(!param_two) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
                })
            } else {
                allowedFields.param_two = param_two
            }
        }
        if(params===3) {
            if(!param_three) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Invalid request"
                })
            } 
            else {
                allowedFields.param_three = param_three
            }
        }
        try{

            const result = await this.sectionService.updateSection(sectionId, allowedFields)
            if(result){ 
                res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFields
                    },
                    message: `section ${result} updated successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Section found"
                })
            }
        }
        catch(error) {
            if(error instanceof Error)
            res.status(500).json({
                success: false,
                body: null,
                message: error.message
            })
        }
    }

    deleteSection = async (req: Request, res: Response) => {
        const {id} = req.params;
        const sectionId = Number(id);
        try{
            const result = await this.sectionService.deleteSection(sectionId);
            if(result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Section ${id} deleted`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No section found"
                })
            }
        }
        catch(err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
    }
}