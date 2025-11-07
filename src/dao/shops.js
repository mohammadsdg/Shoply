import { db } from "../config/db.js";
export default class ShopDao {
    async getAll() {
        return db('shops').select("*");
    }
    async getById(id) {
        return db('shops')
            .where({ ID: id })
            .first();
    }
    async create(data) {
        try {
            const [insertId] = await db('shops')
                .insert(data);
            return insertId;
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, data) {
        const affectedRows = await db('shops')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('shops')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=shops.js.map