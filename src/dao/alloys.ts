import type { ResultSetHeader, RowDataPacket } from "mysql2";
// import { pool } from "../config/db.js";
import type { IAlloyData, TCreateAlloyInput, TUpdateAlloyInput } from "../types/alloys.js";
import { db } from "../config/db.js";

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

    async create(data: TCreateAlloyInput): Promise<number | null> {
        const [insertId] = await db<IAlloyData>("alloys").insert(data);
        if(insertId) {
            return insertId
        }
        else {
            return null
        }
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