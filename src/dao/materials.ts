import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";

export default class MaterialDao {
    async getAll(): Promise<RowDataPacket[] | undefined> {
        const query = `SELECT * FROM shoply_db.materials`;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows
    }

    async getById(id: number) {
        const query = `SELECT * FROM shoply_db.materials WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result ? result : false;
    }
    
    async create(name: string) {
        const query = `INSERT INTO shoply_db.materials(name) VALUES(?)`;
        const [result] = await pool.query<ResultSetHeader>(query, [name]);
        return result.insertId ? result.insertId : false;
    }

    async update(id: number, name: string,) {
        const query = `UPDATE shoply_db.materials SET name = ? WHERE (ID = ?);`;
        const [result] = await pool.query<ResultSetHeader>(query, [name, id]);
        return result.affectedRows ? result.affectedRows : false;
    }

    async delete(id: number) {
        const query = `DELETE FROM shoply_db.materials WHERE ID = ?`
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows ? result.affectedRows : false;
    }
}