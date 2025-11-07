import { db } from "../config/db.js";
export default class AlloysDao {
    // Get All Alloys
    async getAll() {
        return db("alloys").select("*");
    }
    async getById(id) {
        if (!id)
            return undefined; // handle undefined case
        return db("alloys")
            .where({ ID: id })
            .first(); // returns the first row or undefined
    }
    async create(data) {
        const [insertId] = await db("alloys").insert(data);
        if (insertId) {
            return insertId;
        }
        else {
            return null;
        }
    }
    async update(id, data) {
        const affectedRows = await db("alloys")
            .where({ ID: id })
            .update(data);
        return affectedRows; // number of rows updated
    }
    async delete(id) {
        const affectedRows = await db("alloys")
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=alloys.js.map