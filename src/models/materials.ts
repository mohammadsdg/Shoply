import { pool } from "../config/db.ts";

interface IMaterialData {
    name?: string
}

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

    static async setMaterial(data: IMaterialData) {
        const query: string = `INSERT INTO materials(name) VALUES(?)`;
        const [rows] = await pool.query(query, data);
    }

    // static async updateMaterial(data, id) {

    // }

    // static async deleteMaterial(id) {

    // }
}