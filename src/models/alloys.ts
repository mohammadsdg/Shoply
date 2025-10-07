import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { TCreateAlloyInput } from "../types/alloys.ts";

export default class AlloysModel {
    static async getAllAlloys() {
        const query = `SELECT * FROM alloys`;
        const [result] = await pool.query<RowDataPacket[]>(query);
        return result;
    }

    static async getAlloy(id: string | undefined) {
        const query = `SELECT * FROM alloys WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0];
    }

    static async setAlloy(data: TCreateAlloyInput) {
        const requiredFields = Object.values(data);
        const query = `INSERT INTO alloys(
            material_id, 
            name, 
            code, 
            cutting_speed
        ) VALUES(?, ?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateAlloy(data: TCreateAlloyInput, id: number) {
        const requiredFields = Object.values(data);
        const query = `UPDATE alloys SET material_id= ?, name= ?, code= ?, cutting_speed= ?
            WHERE ID = ${id}`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteAlloy(id: string | undefined) {
        const query = `DELETE FROM alloys WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}