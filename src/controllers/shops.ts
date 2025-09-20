import ShopsModel from "../models/shops.ts"
import type { Request, Response } from "express";

export default class ShopsController {
    static async getAllShops(_: Request, res: Response) {
        try{
            const result = await ShopsModel.getAllShops();
            res.status(200).json({
                success: true,
                body: result,
                message: "All Shops fetched successfully"
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
    
    static async getShop(req: Request, res: Response) {
        const {id} = req.params;
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await ShopsModel.getShop(id);
            console.log(result)
            if (result.length) {
                return res.status(200).json({
                    success: false,
                    body: result,
                    message: `Shop ${id} fetched successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop found."
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

    static async setShop(req: Request, res: Response) {
        const {user_id, name, phone} = req.body;
        const allowedFields = [user_id, name, phone];
        console.log()
        if(allowedFields.some(field=> field === null && field === undefined)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const data = {
            user_id,
            name,
            phone
        }
        try{
            const result = await ShopsModel.setShop(data);
            return res.status(201).json({
                success: false,
                body: {
                    ID: result,
                    ...data
                },
                message: "A shop created successfully"
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
        }
    }

    static async updateShop(req: Request, res: Response) {
        const {name, phone, firstname, lastname} = req.body;
        const {id} = req.params;
        const data = {
            name,
            phone,
            lastname,
            firstname
        }
        try{
            const result = await ShopsModel.updateShop(data, id);
            if(result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: id,
                        ...data
                    },
                    message: `shop ${id} updated successfully`
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop found."
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

    static async deleteShop(req: Request, res: Response) {
        const {id} = req.params;
        try{
            const result = await ShopsModel.deleteShop(id);
            if(result) {
                return res.status(200).json({
                    success: false,
                    body: result,
                    message: `shop ${id} deleted successfully`
                })
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No shop found."
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