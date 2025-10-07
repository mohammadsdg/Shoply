import type { ResultSetHeader, RowDataPacket } from "mysql2";
// import { pool } from "../config/db.ts";
import type { IAlloyData, TCreateAlloyInput, TUpdateAlloyInput } from "../types/alloys.ts";
import { db } from "../config/db.ts";

export default class AlloysDao {
    // Get All Alloys
    async getAll(): Promise<IAlloyData[]> {
        return db<IAlloyData>("alloys").select("*");
    }

    async getById(id: number): Promise<IAlloyData | undefined> {
        if(!id) return undefined // handle undefined case

        return db<IAlloyData>("alloys")
            .where({ ID: id })
            .first(); // returns the first row or undefined
    }

    async create(data: TCreateAlloyInput): Promise<number | undefined> {
        const [insertId] = await db<IAlloyData>("alloys").insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateAlloyInput): Promise<number> {
        const affectedRows = await db<IAlloyData>("alloys")
            .where({ ID: id })
            .update(data);
        return affectedRows; // number of rows updated
    }

    async delete(id: number): Promise<number> {
        const affectedRows = await db<IAlloyData>("alloys")
            .where({ ID: id })
            .delete();

        return affectedRows;
    }
}