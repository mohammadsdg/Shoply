import SectionsModel from "../models/sections.ts"
import type { Response, Request } from "express";

interface ISetSectionData {
    name: string,
    params: number,
    param_one: number,
    param_two?: number | null,
    param_three?: number | null
}

export default class SectionsController {
    static async getAllSections(_: Request, res: Response) {
        try{
            const result = await SectionsModel.getAllSections();
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

    static async getSection(req: Request, res: Response) {
        const {id} = req.params;
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await SectionsModel.getSection(id);
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

    static async setSection(req: Request, res: Response) {
        const {name, params, param_one, param_two, param_three} = req.body;
        const allowedFields: ISetSectionData = {
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
            const result = await SectionsModel.setSection(allowedFields);
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

    static async updateSection(req: Request, res: Response) {
        const {name, params, param_one, param_two, param_three} = req.body;
        const {id} = req.params;
        const allowedFields: ISetSectionData = {
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

            const result = await SectionsModel.updateSection(allowedFields, id);
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

    static async deleteSection(req: Request, res: Response) {
        const {id} = req.params;
        try{
            const result = await SectionsModel.deleteSection(id);
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