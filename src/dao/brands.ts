import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import type { IBrandData, TCreateBrandInput, TUpdateBrandParams } from "../types/brands.js";

export default class BrandDao {
    async getAll(): Promise<IBrandData[]> {
        return db<IBrandData>("brands").select("*");
    }

    async getById(id: number): Promise<IBrandData | undefined> {
        return db<IBrandData>("brands").where({ ID: id }).first();
    }

    async create(data: TCreateBrandInput): Promise<number | undefined> {
        const [insertId] = await db<IBrandData>("brands").insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateBrandParams): Promise<number | undefined> {
        const affectedRows = await db<IBrandData>("brands")
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }

    async delete(id: number) {
        const affectedRows = await db<IBrandData>("brands").where({ ID: id }).delete();
        return affectedRows;
    }
}