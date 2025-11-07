import { db } from "../config/db.js";
export default class BrandDao {
    async getAll() {
        return db("brands").select("*");
    }
    async getById(id) {
        return db("brands").where({ ID: id }).first();
    }
    async create(data) {
        const [insertId] = await db("brands").insert(data);
        return insertId;
    }
    async update(id, data) {
        const affectedRows = await db("brands")
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db("brands").where({ ID: id }).delete();
        return affectedRows;
    }
}
//# sourceMappingURL=brands.js.map