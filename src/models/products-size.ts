import type { RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";

export default class ProductsSizeModel {
    static async getAllProductsSize() {
        const query = `SELECT 
            ps.ID, 
            ps.shop_products_id,
            ps.param_one, 
            ps.param_two, 
            ps.param_three,
            ps.weight,
            ps.price,
            ps.number,
            ps.width,
            ps.status, 
            p.section_id, 
            s.params,
            s.name
        FROM products_size AS ps
        LEFT JOIN shop_products AS sp
            ON sp.ID = ps.shop_products_id
        LEFT JOIN products AS p 
            ON p.ID = sp.product_id
        LEFT JOIN sections AS s 
            ON s.ID = p.section_id;`;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows;
    }

    static async getProductSize(id: number) {
        const query = `SELECT 
            ps.ID,
            ps.shop_products_id,
            ps.param_one, 
            ps.param_two, 
            ps.param_three,
            ps.width,
            ps.status, 
            p.section_id,
            s.param_one AS param_one_name,
            s.param_two AS param_two_name,
            s.param_three AS param_three_name,
            s.params,
            s.name AS section_name
        FROM products_size AS ps
        LEFT JOIN shop_products AS sp
            ON sp.ID = ps.shop_products_id
        LEFT JOIN products AS p 
            ON p.ID = sp.product_id
        LEFT JOIN sections AS s 
            ON s.ID = p.section_id WHERE ps.ID = ?;`
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
        return rows[0];
    }

    // static async setProductSize(data: ) {
    //     const inserts = Object.keys(data);
    //     const valueParameter = Object.values(data).map(val=> "?")
    //     const values = Object.values(data);
    //     const query = `INSERT INTO shoply_db.products_size(${inserts.join(", ")})
    //     VALUES(${valueParameter.join(", ")})`
    // }
}