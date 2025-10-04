import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { ISetBrandParams, TUpdateBrandParams } from "../types/brands.ts";

export default class BrandsModel {
    static async getAllBrands() {
        const query = `SELECT * FROM brands`;
        const [result] = await pool.query(query);
        return result;
    }

    static async getBrand(id: string | undefined) {
        const query = `SELECT * FROM brands WHERE ID = ?`;
        const [result] = await pool.query<(RowDataPacket)[]>(query, [id]);
        return result[0]
    }

    static async setBrand(data: ISetBrandParams) {
        const requiredFields = Object.values(data);
        const query = `INSERT INTO brands(
            user_id,
            name,
            info
        ) VALUES(?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateBrand(data: TUpdateBrandParams, id: string) {
        const requiredFields = [...Object.values(data), id]
        const query = `UPDATE brands SET
            name= ?,
            info= ?,
            status= ?
        WHERE ID = ?`
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows
    }

    static async deleteBrand(id: string | undefined) {
        const query: string = `DELETE FROM brands WHERE ID = ?;`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows
    }
}