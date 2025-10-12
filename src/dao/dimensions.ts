import type { ResultSetHeader } from "mysql2";
import { db } from "../config/db.js";
import type { IDimensionData, TCreateDimensionInput, TUpdateDimensionInput } from "../types/dimensions.js";

export default class DimensionsDao {
    async getAll() {
        return db<IDimensionData>('dimensions').select('*');
    }

    async getById(id: number) {
        return db<IDimensionData>('dimensions').where({ ID: id }).first()
    }

    async create(data: TCreateDimensionInput) {
        const [insertId] = await db<IDimensionData>('dimensions').insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateDimensionInput) {
        const affectedRows = await db<IDimensionData>('dimensions').where({ ID: id }).update(data);
        return affectedRows;
    }

    async delete(id: number) {
        const affectedRows = await db<IDimensionData>('dimensions').where({ ID: id }).delete();
        return affectedRows;
    }
}