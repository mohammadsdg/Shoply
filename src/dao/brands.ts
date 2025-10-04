import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { IGetBrandData, ISetBrandParams, TUpdateBrandParams } from "../types/brands.ts";

export default class BrandDao {
    async getAll(): Promise<IGetBrandData[]> {
        const query = `SELECT * FROM brands`;
        const [result] = await pool.query<(RowDataPacket & IGetBrandData)[]>(query);
        return result;
    }

    async getById(id: number): Promise<IGetBrandData | undefined> {
        const query = `SELECT * FROM brands WHERE ID = ?`;
        const [result] = await pool.query<(RowDataPacket & IGetBrandData)[]>(query, [id]);
        return result[0]
    }

    async create(data: ISetBrandParams): Promise<number> {
        const requiredFields = Object.values(data);
        const query = `INSERT INTO brands(
            user_id,
            name,
            info
        ) VALUES(?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader & number>(query, requiredFields);
        return result.insertId;
    }

    async update(id: number, data: TUpdateBrandParams) {
        const requiredFields = [...Object.values(data), id]
        const query = `UPDATE brands SET
            name= ?,
            info= ?,
            status= ?
        WHERE ID = ?`
        const [result] = await pool.query<ResultSetHeader & number>(query, requiredFields);
        return result.affectedRows
    }

    async delete(id: number) {
        const query: string = `DELETE FROM brands WHERE ID = ?;`;
        const [result] = await pool.query<ResultSetHeader & number>(query, [id]);
        return result.affectedRows
    }
}