import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type IGroupingParams from "../types/groupings.ts";

export default class GroupingsModel {
    static async getAllGroupings() {
        const query = `SELECT * FROM groupings`;
        const [result] = await pool.query<RowDataPacket[]>(query);
        return result;
    }

    static async getGrouping(id: number) {
        const query = `SELECT * FROM groupings WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0];
    }

    static async setGrouping(data: IGroupingParams) {
        const requiredFields = Object.values(data);
        console.log(requiredFields)
        const query = `INSERT INTO groupings(
            name,
            section_id,
            material_id
        ) 
        VALUES(?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateGrouping(data: IGroupingParams, id: number) {
        const requiredFields = [...Object.values(data), id];
        const query = `UPDATE groupings SET
            name= ?,
            section_id= ?,
            material_id= ?
        WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteGrouping(id: number) {
        const query = `DELETE FROM groupings WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}