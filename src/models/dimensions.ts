import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { IDimensionGetData, IDimensionSetParam } from "../types/dimensions.ts";

export default class DimensionsModel {
    static async getAllDimensions() {
        const query: string = `SELECT * FROM dimensions`;
        const [result] = await pool.query<(RowDataPacket & IDimensionGetData)[]>(query);
        return result;
    }

    static async getDimension(id: number) {
        const query: string = `SELECT * FROM dimensions WHERE ID = ?`;
        const [result] = await pool.query<(RowDataPacket & IDimensionGetData)[]>(query, [id]);
        return result[0] || null;
    }

    static async setDimension(data: IDimensionSetParam) {
        const requiredFields = Object.values(data);
        console.log(requiredFields)
        const query: string = `INSERT INTO dimensions(\`dimensions\`) VALUES(?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateDimension(data: IDimensionSetParam, id: number) {
        const requiredFields = [...Object.values(data), id]
        console.log(requiredFields)
        const query: string = `UPDATE dimensions SET 
            \`dimensions\` = ?
        WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteDimension(id: number) {
        const query: string = `DELETE FROM dimensions WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}