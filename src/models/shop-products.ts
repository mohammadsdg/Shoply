import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { IShopProductsSetParams } from "../types/shop-products.ts";

export default class ShopProductsModel {
    static async getAllShopProduct() {
        const query = `SELECT * FROM shop_products`;
        const [result] = await pool.query<RowDataPacket[]>(query);
        return result;
    }

    static async getShopProduct(id: number) {
        const query = `SELECT * FROM shop_products WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0];
    }

    static async setShopProduct(data: IShopProductsSetParams) {
        const requiredFields = Object.values(data);
        const query = `INSERT INTO shoply_db.shop_products(shop_id, product_id) VALUES(?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result ? result.insertId : 0;
    }

    static async updateShopProduct(data: IShopProductsSetParams, id: number) {
        const requiredFields = [...Object.values(data), id];
        const query = `UPDATE shop_products SET 
            shop_id = ?,
            product_id = ?
        WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteShopProduct(id: number) {
        const query = `DELETE FROM shop_products WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}