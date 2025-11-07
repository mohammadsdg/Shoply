import { db, } from "../config/db.js";
export default class MaterialDao {
    async getAll() {
        return db('materials').select("*");
    }
    async getById(id) {
        return db('materials').where({ ID: id }).first();
    }
    async create(data) {
        const [insertId] = await db('materials').insert(data);
        return insertId;
    }
    async update(id, data) {
        const affectedRows = await db('materials')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('materials')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=materials.js.map