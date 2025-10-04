import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { ISetAlloyParams } from "../types/alloys.ts";

export default class AlloysDao {
    async getAll(): Promise<RowDataPacket[]> {
        const query = `SELECT * FROM alloys`;
        const [result] = await pool.query<RowDataPacket[]>(query);
        return result;
    }

    async getById(id: number | undefined): Promise<RowDataPacket | undefined> {
        const query = `SELECT * FROM alloys WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0];
    }

    async create(data: ISetAlloyParams): Promise<number> {
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

    async update(id: number, data: ISetAlloyParams): Promise<number> {
        const requiredFields = Object.values(data);
        const query = `UPDATE alloys SET material_id= ?, name= ?, code= ?, cutting_speed= ?
            WHERE ID = ${id}`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    async delete(id: number | undefined): Promise<number> {
        const query = `DELETE FROM alloys WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}