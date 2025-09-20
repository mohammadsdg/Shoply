import { pool } from "../config/db.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { IGetShopData, ISetShopParams, IUpdateShopData } from "../types/index.ts";


export default class ShopsModel {
    static async getAllShops() {
        const query = `SELECT * FROM shops`;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows
    }

    static async getShop(id: string | undefined) {
        const query = `SELECT * FROM shops where ID = ?`;
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
        return rows;
    }

    static async setShop(data: ISetShopParams) {
        const requiredFields = Object.values(data);
        const query = `INSERT INTO shops(user_id, name, phone) VALUES(?, ?, ?)`;
        const [result] = await pool.query<(ResultSetHeader & IGetShopData)>(query, requiredFields);
        return result.insertId;
    }

    static async updateShop(data: IUpdateShopData, id: string | undefined) {
        const requiredFields = Object.values(data);
        requiredFields.push(id);
        const query = `UPDATE shops SET
            name= ?,
            phone= ?,
            lastname= ?,
            firstname= ?
        WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteShop(id: string | undefined) {
        const query = `DELETE FROM shops WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader & number>(query, [id]);
        return result.affectedRows;
    }
}