import type { Request, Response } from "express";
import GroupingsModel from "../models/groupings.ts";
export default class GroupingsController {
    static async getAllGroupings(_: Request, res: Response) {
        try {
            const result = await GroupingsModel.getAllGroupings();
            res.status(200).json({
                success: true,
                body: result,
                message: "All groupings fetched successfully"
            })
        }
        catch (err) {
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
                message: "Error unknown"
            })
        }
    }

    static async getGrouping(req: Request, res: Response) {
        const {id} = req.params;
        const groupingId = Number(id);
        if (isNaN(groupingId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invlaid ID"
            })
        }

        try {
            const result = await GroupingsModel.getGrouping(groupingId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `grouping ${groupingId} fetched successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No grouping found."
                })
            }
        }
        catch (err) {
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
                message: "Error unknown"
            })
        }
    }

    static async postGrouping(req: Request, res: Response) {
        const {name, section_id, material_id} = req.body;
        if (!name || !section_id || !material_id) {
            res.status(400).json({
                success: true,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            name,
            section_id,
            material_id
        };
        try {
            const result = await GroupingsModel.setGrouping(allowedFields);
            res.status(200).json({
                success: true,
                body: {
                    ID: result,
                    ...allowedFields
                },
                message: "grouping created successfully"
            })
        }
        catch (err) {
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
                message: "Error unknown"
            })
        }
    }

    static async updateGrouping(req: Request, res: Response) {
        const {name, section_id, material_id} = req.body;
        const {id} = req.params;
        const groupingId = Number(id);
        if (!name || !section_id || !material_id) {
            res.status(400).json({
                success: true,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            name,
            section_id,
            material_id
        };

        try {
            const result = await GroupingsModel.updateGrouping(allowedFields, groupingId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFields
                    },
                    message: `grouping ${groupingId} updated successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No grouping found to update with this ID"
                })
            }
        }
        catch (err) {
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
                message: "Error unknown"
            })
        }
    }

    static async deleteGrouping(req: Request, res: Response) {
        const {id} = req.params;
        const groupingId = Number(id);
        try {
            const result = await GroupingsModel.deleteGrouping(groupingId);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: groupingId,
                    message: `grouping ${groupingId} deleted successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: `No grouping found.`
                })
            }
        }
        catch (err) {
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
                message: "Error unknown"
            })
        }
    }
}