import {pool} from "../config/db.ts"
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface IGetUserParams {
    user: string
}

interface ISetUserParams extends IGetUserParams {
    password: string,
    role: string
}

interface IGetUserData {
    ID?: number | null,
    user: string,
    password: string,
    role: string | null,
    shop_id: number | null
}

type TUserSafeData = Omit<IGetUserData, "password">




export default class UsersModel {
    // Get all users
    static async getAllUsers() {
        const query = `SELECT ID, user, role, shop_id FROM users`;
        const [rows] = await pool.query<(RowDataPacket & TUserSafeData)[]>(query);
        return rows;
    }
    
    // Get User 
    static async getUser(data: IGetUserParams): Promise<IGetUserData | false> {
        const requiredFields = [data.user]
        const query = `SELECT * FROM users WHERE user = ?`;
        // Getting user
        const [rows] = await pool.query<(RowDataPacket & IGetUserParams)[]>(query, requiredFields);
        // Checking if there is any user
        if(rows.length>0) {
            const data = rows[0]

            if(data) {
                return {
                    ID: data.ID,
                    user: data.user,
                    password: data.password,
                    role: data.role,
                    shop_id: data.shop_id
                }
            }
        }
        return false
    }

    // Set User
    static async setUser(data: ISetUserParams): Promise<number | false | string | undefined> {
        const requiredFields: [string, string, string] = [data.user, data.password, data.role]
        // Query for setting user
        const query = `INSERT INTO users(user, password) VALUES(?, ?)`;
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