import { db } from "../config/db.js";
export default class GroupingDao {
    async getAll() {
        return db('groupings').select("*");
    }
    async getById(id) {
        return db('groupings').where({ ID: id }).first();
    }
    async create(data) {
        const [insertId] = await db('groupings').insert(data);
        return insertId;
    }
    async update(id, data) {
        const affectedRows = await db('groupings').where({ ID: id }).update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('groupings').where({ ID: id }).delete();
        return affectedRows;
    }
}
//# sourceMappingURL=groupings.js.map