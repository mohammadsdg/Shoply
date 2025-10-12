import { db } from "../config/db.js";
import type { IGroupingData, TCreateGrouping, TUpdateGrouping } from "../types/groupings.js";

export default class GroupingDao {
    async getAll() {
        return db<IGroupingData>('groupings').select("*");
    }
    async getById(id: number) {
        return db<IGroupingData>('groupings').where({ ID: id }).first()
    }
    async create(data: TCreateGrouping) {
        const [insertId] = await db<IGroupingData>('groupings').insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateGrouping) {
        const affectedRows = await db<IGroupingData>('groupings').where({ ID: id }).update(data);
        return affectedRows
    }

    async delete(id: number) {
        const affectedRows = await db<IGroupingData>('groupings').where({ ID: id }).delete();
        return affectedRows;
    }
}