import { db } from "../config/db.js";
export default class SectionDao {
    async getAll() {
        return db('sections').select('*');
    }
    async getById(id) {
        return db('sections')
            .where({ ID: id })
            .first();
    }
    async create(data) {
        const [insertId] = await db('sections')
            .insert(data);
        return insertId;
    }
    async update(id, data) {
        const affectedRows = await db('sections')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('sections')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=sections.js.map