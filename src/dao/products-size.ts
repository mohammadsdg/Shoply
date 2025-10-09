import { db } from "../config/db.ts";
import type { IProductSizeData, TCreateProductSize, TUpdateProductSize } from "../types/products-size.ts";

export default class  ProductSizeDao {
    async getAll() {
        return db<IProductSizeData>('products-size')
            .select('*');
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