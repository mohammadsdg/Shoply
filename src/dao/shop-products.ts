import { db } from "../config/db.js";
import type { IShopProductData, TCreateShopProduct, TUpdateShopProduct } from "../types/shop-products.js";

export default class ShopProductDao {
    async getAll() {
        return db<IShopProductData>('shop_products')
            .select('*');
    }

    // Select all products of a shop using left join
    async getByShopId(id: number) {
        return db<IShopProductData>({ sp: 'shop_products' })
            .leftJoin({ p: 'products' }, 'sp.product_id', 'p.ID')
            .select('sp.*', 'p.section_id')
            .where("sp.shop_id", id);
    }

    async create(data: TCreateShopProduct) {
        try {
            const [insertId] = await db<IShopProductData>('shop_products')
            .insert(data);
            return insertId
        }
        catch(err) {
            throw err
        }
    }

    async update(id: number, data: TUpdateShopProduct) {
        try {

            const affectedRows = db<IShopProductData>('shop_products')
            .where({ ID: id })
            .update(data);
            return affectedRows
        }
        catch(err) {
            throw err
        }
    }

    async delete(id: number) {
        const affectedRows = db<IShopProductData>('shop_products')
            .where({ ID: id })
            .delete();
        return affectedRows
    }
}