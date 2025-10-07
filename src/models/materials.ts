import { pool } from "../config/db.ts";
import type { TCreateMaterial } from "../types/materials.ts";

export default class MaterialsModel {
    static async getAllMaterials() {
        const query = `SELECT * FROM materials;`;
        const [rows] = await pool.query(query);
        return rows;
    }

    static async getMaterial(id: string | undefined) {
        const query: string = `SELECT * FROM materials WHERE ID = ?`
        const [rows] = await pool.query(query, [id]);
        return rows;
    }

    static async setMaterial(data: TCreateMaterial) {
        const query: string = `INSERT INTO materials(name) VALUES(?)`;
        const [rows] = await pool.query(query, data);
    }

    // static async updateMaterial(data, id: number) {

    // }

    // static async deleteMaterial(id: number) {
    //     const query = `DELETE FROM shoply_db.materials WHERE ID = ?`
    //     const [result] = await pool.query(query, [id]);
    //     return result.affectedRows ? result.affectedRows : false;
    // }
}