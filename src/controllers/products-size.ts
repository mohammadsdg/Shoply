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

    // Get all sizes of a product (shop_id is conditional)
    getAllProducts = async (req: Request, res: Response) => {
        const {shop_id} = req.query;
        const shopId = Number(shop_id);
        try {
            const result = await this.productsSizeService.getAllProducts(shopId);
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

    // Create products_size and stock_items together
    setProduct = async (req: Request, res: Response) => {
        // Destructuring datas from Request.params
        let {
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
        number = Number(number);
        width = Number(width);

        // define product_size input
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
        // Getting all the necessary inputs
        const { param_two: two, param_three: three, ...required } = productSizeData;
        // Check if required input are not null or undefined
        if (Object.values(required).some(
            value=> value===undefined || value===null) ||
            section_id===undefined || section_id===null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        // Check params
        if (!param_two) {
            productSizeData.param_two = null
        }
        if (!param_three) {
            productSizeData.param_three = null
        }

        let density = 0;
        let volume = 0;
        section_id = Number(section_id);
        // Calculating density based on section_id
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
        // setting density
        productSizeData.density = density;
        try {
            const productSizeId = await this.productsSizeService.setProductSize(productSizeData);
            // if productSize not created return error
            if (!productSizeId) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Failed to create product size"
                });
            }
            // Get millisecond for part of the single_product_code
            const timeInMilliSecond = new Date().getTime();
            // define stock_items input
            const stockItemData = {
                product_size_id: productSizeId,
                single_product_code: `${productSizeId}-${width}-${timeInMilliSecond}`,
                width
            }

            const stockItemArray = await this.stockItemService.setMultiStockItem(
                stockItemData,
                number
            );
            // 3️⃣ Return combined response
            return res.status(201).json({
                success: true,
                body: {
                    product_size: { ID: productSizeId, ...productSizeData },
                    stock_item: stockItemArray
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