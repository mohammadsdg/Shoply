import type { Request, Response } from "express";
import type GroupingService from "../services/groupings.ts";
export default class GroupingsController {
    private groupingService: GroupingService;
    constructor(groupingService: GroupingService) {
        this.groupingService = groupingService;
    }
    getAllGroupings = async (_: Request, res: Response) => {
        try {
            const result = await this.groupingService.getAllGroupings()
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

    getGrouping = async (req: Request, res: Response) => {
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
            const result = await this.groupingService.getGrouping(groupingId);
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

    postGrouping = async (req: Request, res: Response) => {
        const {name, section_id, material_id} = req.body;
        if (!name || !section_id || !material_id) {
            res.status(400).json({
                success: true,
                body: null,
                message: "Invalid request"
            })
        }
        const groupingData = {
            name,
            section_id,
            material_id
        };
        try {
            const result = await this.groupingService.setGrouping(groupingData);
            res.status(200).json({
                success: true,
                body: {
                    ID: result,
                    ...groupingData
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

    updateGrouping = async (req: Request, res: Response) => {
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
        const groupingData = {
            name,
            section_id,
            material_id
        };

        try {
            const result = await this.groupingService.updateGrouping(groupingId, groupingData);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        ...groupingData
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

    deleteGrouping = async (req: Request, res: Response) => {
        const {id} = req.params;
        const groupingId = Number(id);
        try {
            const result = await this.groupingService.deleteGrouping(groupingId);
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