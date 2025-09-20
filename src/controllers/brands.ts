import type {Request, Response} from "express";
import BrandsModel from "../models/brands.ts";
import type { RowDataPacket } from "mysql2";

export default class BrandsController {
    static async getAllBrands(_: Request, res: Response) {
        try{
            const result = await BrandsModel.getAllBrands();
            res.status(200).json({
                success: true,
                body: result,
                message: "All brands fetched successfully"
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

    static async getBrand(req: Request, res: Response) {
        const {id} = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await BrandsModel.getBrand(id);
            if (result) {
                res.status(200).json({
                    success: true,
                    body: result,
                    message: `Brand ${id} fetched successfully`
                })
            }
        }
        catch(err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
        }
    }

    static async setBrand(req: Request, res: Response) {
        const {name, info, status} = req.body;
        if(!name || !info || !status) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            res.status(201).json({
                success: true,

            })
        }
        catch(err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
        }
    }

    static async updateBrand(req: Request, res: Response) {
        const {id} = req.params;
        const {name, info, status} = req.body;
        if(!name || !info || !status || !id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const data = {
            name,
            info,
            status
        }
        try{
            const result = await BrandsModel.updateBrand(data, id);
            return res.status(200).json({
                success: true,
                body: {
                    ID: result,
                    ...data
                },
                message: `Brand ${id} updated successfully`
            })
        }
        catch(err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
        }
    }

    static async deleteBrand(req: Request, res: Response) {
        const {id} = req.params;
        try{
            const result = await BrandsModel.deleteBrand(id);
            if(result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Brand ${id} deleted`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No brand found."
                })
            }
        }
        catch(err) {
            if (err instanceof Error) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                })
            }
        }
    }
}