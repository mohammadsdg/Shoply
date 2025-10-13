import type {Request, Response} from "express"
import { hexagonPrismVolume, pipeVolume, roundVolume, sheetVolume } from "../utils/generate-volume.js";
import type { TCreateProductSize } from "../types/products-size.js";
import type ProductSizeService from "../services/products-size.js";
import StockItemService from "../services/stock-items.js";

export default class ProductsSizeController {
    // define ProductSizeService and StockItemService instances
    private productsSizeService: ProductSizeService;
    private stockItemService: StockItemService;

    constructor(
        productsSizeService: ProductSizeService,
        stockItemService: StockItemService
    ) {
        this.productsSizeService = productsSizeService
        this.stockItemService = stockItemService
    }

    // Get all sizes of a product
    getAllProducts = async (req: Request, res: Response) => {
        const {shop_id} = req.query;
        const shopId = Number(shop_id);
        console.log(shopId)
        try {
            const result = await this.productsSizeService.getAllProducts(shopId);
            console.log(result)
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

    // Get size for a product
    getProduct = async (req: Request, res: Response) => {
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
            const result = await this.productsSizeService.getProductSize(productSizeId)
            res.status(200).json({
                success: true,
                body: result,
                message: `productSize ${id} fetched successfully`
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

    setProduct = async (req: Request, res: Response) => {
        const {
            shop_products_id, 
            param_one, 
            param_two, 
            param_three,
            width, 
            number, 
            weight, 
            section_id,
            price
        } = req.body;

        const productSizeData: TCreateProductSize = {
            shop_products_id,
            param_one,
            param_two,
            param_three,
            width, 
            number, 
            weight,
            price
        }

        if (param_two===undefined) {
            productSizeData.param_two = null
        }

        if (param_three===undefined) {
            productSizeData.param_three = null
        }

        if (Object.values(productSizeData).every(val=> val===undefined || val===null)) {
            return res.status(400).json({
                success: true,
                body: null,
                message: "Invalid request"
            })
        }

        let density = 0;
        let volume = 0;
        switch(section_id) {
            case 1:
                if (width && weight) {
                    volume = roundVolume(param_one, width);
                    density = weight / volume * (1e3);
                }
                break;
            case 2:
                if (width && weight) {
                    volume = sheetVolume(param_one, param_two, width)
                    density = weight / volume * (1e3)
                }
                break;
            case 3:
                if (width && weight) {
                    volume = pipeVolume(param_one, param_two, width)
                    density = weight / volume * (1e3)
                }
                break;
            case 4:
                if (width && weight) {
                    volume = sheetVolume(param_one, param_two, width)
                    density = weight / volume * (1e3)
                }
                break;
            case 5: 
                if (width && weight) {
                    volume = hexagonPrismVolume(param_one, width);
                    density = weight / volume * (1e3)
                }
                break;
        }
        productSizeData.density = density;
        try{
            const productSizeId = await this.productsSizeService.setProductSize(productSizeData)
            
            if (!productSizeId) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Failed to create product size"
                });
            }

            const stockItemData = {
                product_size_id: productSizeId,
                single_product: 1
            }
            const stockItemId = await this.stockItemService.setStockItem(
                stockItemData
            );
            // 3️⃣ Return combined response
            return res.status(201).json({
                success: true,
                body: {
                    product_size: { ID: productSizeId, ...productSizeData },
                    stock_item: { ID: stockItemId, ...stockItemData }
                },
                message: "Product size and stock created successfully"
            });
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
}