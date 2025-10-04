import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { IStockItemsParams } from "../types/stock-items.ts";

export default class StockItemsModel {
    static async getAllItems() {
        const query = `SELECT * FROM shoply_db.stock_items`;
        const [result] = await pool.query(query);
        return result;
    }

    static async getItem(id: number) {
        const query = `SELECT * FROM shoply_db.stock_items WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0] ?? {};
    }

    static async setItem(data: IStockItemsParams, number: number) {
        let insertids = []
        for (let i = 0; i<number; i++) {
            const requiredField = Object.values(data);
            const query = `INSERT INTO shoply_db.stock_items(
                product_size_id,
                single_product
            ) VALUES(?, ?)`;
            
            const [result] = await pool.query<ResultSetHeader>(query, requiredField);
            console.log(result);
            insertids.push(result.insertId)
        }
        return insertids;
    }
}
