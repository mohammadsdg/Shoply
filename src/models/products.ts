
import { pool } from "../config/db.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { TCreateProduct, TUpdateProduct } from "../types/products.ts";

export default class ProductsModel {
    static async getAllProducts() {
        const query = `SELECT * FROM products;`;
        const [result] = await pool.query<RowDataPacket[]>(query);
        return result;
    }

    static async getProduct(id: number) {
        const query = `SELECT * FROM products WHERE ID = ?`;
        const [result] = await pool.query<RowDataPacket[]>(query, [id]);
        return result[0];
    }

    static async setProduct(data: TCreateProduct) {
       const requiredFields = Object.values(data);
        const query = `INSERT INTO products(
            alloy_id,
            section_id,
            brand_id,
            grouping_id,
            material_id
        )
        VALUES(?, ?, ?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateProduct(data: TUpdateProduct, id: number) {
        const requiredFields = [...Object.values(data), id]
        const query = `UPDATE products SET 
            alloy_id= ?,
            section_id= ?,
            brand_id= ?,
            grouping_id= ?,
            material_id= ?
        WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteProduct(id: number) {
        const query = `DELETE FROM products WHERE ID = ?`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows;
    }
}