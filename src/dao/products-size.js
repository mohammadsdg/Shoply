import { db } from "../config/db.js";
export default class ProductSizeDao {
    async getAll(shop_id) {
        const query = db({ ps: 'products_size' })
            .leftJoin({ sp: 'shop_products' }, 'sp.ID', 'ps.shop_products_id')
            .leftJoin({ p: 'products' }, 'p.ID', 'sp.product_id')
            .leftJoin({ s: 'sections' }, 's.ID', 'p.section_id')
            .select("ps.ID", "ps.shop_products_id", "ps.param_one", "ps.param_two", "ps.param_three", "ps.weight", "ps.price", "ps.number", "ps.width", "ps.status", "p.section_id", "s.name as section_name", "sp.shop_id");
        // Optional WHERE condition
        if (shop_id) {
            query.where("sp.shop_id", shop_id);
        }
        const rows = await query;
        return rows;
    }
    async getById(id) {
        return db('products_size')
            .where({ ID: id })
            .first();
    }
    async create(data) {
        try {
            const [insertId] = await db('products_size')
                .insert(data);
            return insertId;
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, data) {
        const affectedRows = await db('products_size')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('products_size')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=products-size.js.map