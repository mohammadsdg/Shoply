import { db } from "../config/db.ts";
import type { IShopProductData, TCreateShopProduct, TUpdateShopProduct } from "../types/shop-products.ts";

export default class ShopProductDao {
    async getAll() {
        return db<IShopProductData>('shop_products')
            .select('*');
    }

    async getById(id: number) {
        return db<IShopProductData>('shop_products')
            .where({ ID: id })
            .first()
    }

    async create(data: TCreateShopProduct) {
        const [insertId] = await db<IShopProductData>('shop_products')
            .insert(data);
        return insertId
    }

    async update(id: number, data: TUpdateShopProduct) {
        const affectedRows = db<IShopProductData>('shop_products')
            .where({ ID: id })
            .update(data);
        return affectedRows
    }

    async delete(id: number) {
        const affectedRows = db<IShopProductData>('shop_products')
            .where({ ID: id })
            .delete();
        return affectedRows
    }
}