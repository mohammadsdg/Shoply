import type {Request, Response} from "express"
import ProductsSizeModel from "../models/products-size.ts"

export default class ProductsSizeController {
    static async getAllProducts(_: Request, res: Response) {
        try {
            const result = await ProductsSizeModel.getAllProductsSize();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All products-size fetched successfully"
            })
        }
        catch(err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    status: false,
                    body: null,
                    message: err.message
                })
            }
            res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async getProduct(req: Request, res: Response) {
        const {id} = req.params;
        const productSizeId: number = Number(id);
        if(isNaN(productSizeId)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid ID"
            })
        }
        try{
            const result = await ProductsSizeModel.getProductSize(productSizeId);
            res.status(200).json({
                success: true,
                body: result,
                message: `productSize ${id} fetched successfully`
            })
        }
        catch(err) {
            res.status(500).json({
                status: false,
                body: null,
                message: "Unknown message"
            })
        }
    }

    static async setProduct(req: Request, res: Response) {
        
    }
}