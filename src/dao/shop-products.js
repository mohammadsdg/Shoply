import { db } from "../config/db.js";
export default class ShopProductDao {
    async getAll() {
        return db('shop_products')
            .select('*');
    }
    // Select all products of a shop using left join
    async getByShopId(id) {
        return db({ sp: 'shop_products' })
            .leftJoin({ p: 'products' }, 'sp.product_id', 'p.ID')
            .select('sp.*', 'p.section_id')
            .where("sp.shop_id", id);
    }
    async create(data) {
        try {
            const [insertId] = await db('shop_products')
                .insert(data);
            return insertId;
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, data) {
        try {
            const affectedRows = db('shop_products')
                .where({ ID: id })
                .update(data);
            return affectedRows;
        }
        catch (err) {
            throw err;
        }
    }
    async delete(id) {
        const affectedRows = db('shop_products')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=shop-products.js.map