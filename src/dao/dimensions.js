import { db } from "../config/db.js";
export default class DimensionsDao {
    async getAll() {
        return db('dimensions').select('*');
    }
    async getById(id) {
        return db('dimensions').where({ ID: id }).first();
    }
    async create(data) {
        const [insertId] = await db('dimensions').insert(data);
        return insertId;
    }
    async update(id, data) {
        const affectedRows = await db('dimensions').where({ ID: id }).update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('dimensions').where({ ID: id }).delete();
        return affectedRows;
    }
}
//# sourceMappingURL=dimensions.js.map