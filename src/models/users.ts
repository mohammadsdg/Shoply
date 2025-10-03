import {pool} from "../config/db.ts"
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { IGetUserData, IGetUserParams, ISetUserParams, TUserSafeData } from "../types/users.ts";



export default class UsersModel {
    // Get all users
    static async getAllUsers() {
        const query = `SELECT ID, username, role, shop_id FROM users`;
        const [rows] = await pool.query<(RowDataPacket & TUserSafeData)[]>(query);
        return rows;
    }
    
    // Get User 
    static async getUser(data: IGetUserParams): Promise<(RowDataPacket & IGetUserData) | false> {
        const requiredFields = [data.user]
        const query = `SELECT * FROM users WHERE username = ?`;
        // Getting user
        const [rows] = await pool.query<(RowDataPacket & IGetUserData)[]>(query, requiredFields);
        // Checking if there is any user
        if(rows.length>0) {
            const data = rows[0]
            if (data) return data
        }
        return false
    }

    // Set User
    static async setUser(data: ISetUserParams): Promise<number | false | string | undefined> {
        const requiredFields: [string, string, string] = [data.user, data.password, data.role]
        // Query for setting user
        const query = `INSERT INTO users(username, password) VALUES(?, ?)`;
        // Setting user
        try{
            const [result] = await pool.query<(ResultSetHeader)>(query, requiredFields);
            // Checking if the user is created
            if(result.insertId) {
                return result.insertId
            }
            return false
        }
        catch(err) {
            if(err instanceof Error) {
                return err.message
            }
        }
    }
    
}