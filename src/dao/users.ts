import { db } from "../config/db.js";
import type { IUserData, IUserInput } from "../types/users.js";

type IUserReturn = { ID: number; username: string; password?: string; role?: string } | null;

export default class UserDao {
    async getAllUsers() {
        return db<IUserData>('users').select("*");
    }

    async getUser(data: IUserInput) {
        return db<IUserData>('users')
            .where({ username: data.username })
            .first()
    }

    async setUser(data: IUserInput): Promise<IUserReturn> {
        const [insertId] = await db<IUserData>('users')
            .insert(data);
        if (insertId) {
            return {
                ID: insertId,
                ...data
            }
        } else {
            return null
        }
    }
}