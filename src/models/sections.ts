import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.ts";
import type { IGetSectionData, ISetSectionData } from "../types/sections.ts";



export default class SectionsModel {
    // Get all the sections from sections table
    static async getAllSections() {
        const query: string = `SELECT * FROM sections`;
        const [rows] = await pool.query<(IGetSectionData & RowDataPacket)[]>(query);
        return rows;
    }

    // Get one section through id
    static async getSection(id: string | undefined) {
        const query: string = `SELECT * FROM sections WHERE ID = ?`;
        const [rows] = await pool.query<(IGetSectionData & RowDataPacket)[]>(query, [id]);
        return rows[0] ?? null;
    }

    // Post a section to sections table
    static async setSection(data: ISetSectionData) {
        console.log(data);
        const requiredFields = Object.values(data);
        const query = `INSERT INTO shoply_db.sections(
            name,
            params,
            param_one,
            param_two,
            param_three
        )
        VALUES(?, ?, ?, ?, ?)`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.insertId;
    }

    static async updateSection(data: ISetSectionData, id: string | undefined) {
        const requiredFields = Object.values(data);
        requiredFields.push(id);
        const query: string = `UPDATE sections SET 
            name = ?,
            params = ?,
            param_one =?,
            param_two =?,
            param_three =?
        WHERE ID = ?;`;
        const [result] = await pool.query<ResultSetHeader>(query, requiredFields);
        return result.affectedRows;
    }

    static async deleteSection(id: string | undefined) {
        const query: string = `DELETE FROM sections WHERE ID = ?;`;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows
    }
}
