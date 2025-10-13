import { db } from "../config/db.js";
import type { IProductSizeData, TCreateProductSize, TUpdateProductSize } from "../types/products-size.js";

export default class  ProductSizeDao {
    async getAll(shop_id: number) {
        const query = db<IProductSizeData>({ ps: 'products_size' })
            .leftJoin({ sp: 'shop_products' }, 'sp.ID', 'ps.shop_products_id')
            .leftJoin({ p: 'products' }, 'p.ID', 'ps.product_id')
            .leftJoin({ s: 'sections' }, 's.ID', 'p.section_id')
            .select(
                "ps.ID",
                "ps.shop_products_id",
                "ps.param_one",
                "ps.param_two",
                "ps.param_three",
                "ps.weight",
                "ps.price",
                "ps.number",
                "ps.width",
                "ps.status",
                "p.section_id",
                "s.name",
                "sp.shop_id"
            )
        // Optional WHERE condition
        if (shop_id) {
        query.where("sp.shop_id", shop_id);
        }

        const rows = await query;
        return rows;
            
    }

    async getById(id: number) {
        return db<IProductSizeData>('products_size')
            .where({ ID: id })
            .first();
    }

    async create(data: TCreateProductSize) {
        const [insertId] = await db<IProductSizeData>('products_size')
            .insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateProductSize) {
        const affectedRows = await db<IProductSizeData>('products_size')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }

    async delete(id: number) {
        const affectedRows = await db<IProductSizeData>('products_size')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}