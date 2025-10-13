import type { Request, Response } from "express";
import type ShopService from "../services/shops.js";

export default class ShopsController {
    private shopService: ShopService;
    constructor(shopService: ShopService) {
        this.shopService = shopService
    }
    // Get all the shops
    getAllShops = async (_: Request, res: Response) => {
        try{
            const result = await this.shopService.getAllShops();
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
    
    // Get shop by id
    getShop = async (req: Request, res: Response) => {
        const {id} = req.params;
        const shopId = Number(id);
        if(!id) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        try{
            const result = await this.shopService.getShop(shopId)
            if (result) {
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

    // Create shop by user_id, name, phone
    setShop = async (req: Request, res: Response) => {
        const {user_id, name, phone} = req.body;
        const allowedFields = [user_id, name, phone];
        if(allowedFields.some(field=> field === null && field === undefined)) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const shopData = {
            user_id,
            name,
            phone
        }
        try{
            const createdShopId = await this.shopService.setShop(shopData);

            return res.status(201).json({
                success: true,
                body: {
                    ID: createdShopId,
                    ...shopData
                },
                message: "A shop created successfully"
            })
        }
        catch(err: any) {
            // MySql duplicate key error
            if(err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "کاربر فقط یک فروشگاه میتواند داشته باشد"
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: err.message || "Internal server error"
            })
        }
    }

    updateShop = async (req: Request, res: Response) => {
        const {name, phone, firstname, lastname} = req.body;
        const {id} = req.params;
        const shopId = Number(id);
        const shopData = {
            name,
            phone,
            lastname,
            firstname
        }
        try{
            const result = await this.shopService.updateShop(shopId, shopData)
            if(result) {
                res.status(200).json({
                    success: true,
                    body: {
                        ID: id,
                        ...shopData
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

    deleteShop = async (req: Request, res: Response) => {
        const {id} = req.params;
        const shopId = Number(id);
        try{
            const result = await this.shopService.deleteShop(shopId);
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