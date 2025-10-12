import { db } from "../config/db.js";
import type { IUserData, IUserInput } from "../types/users.js";

type IUserReturn = IUserInput | null;

export default class UserDao {
    // Get all users
    async getAllUsers() {
        return db<IUserData>('users').select("*");
    }

    // Get user by username
    async getUser(data: IUserInput) {
        return db<IUserData>('users')
            .where({ username: data.username })
            .first()
    }

    // Create user by user
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

    // Create user by super-admin
    async setRole(data: IUserInput): Promise<IUserReturn> {
        const [insertId] = await db<IUserData>('users')
            .insert(data);
        if (insertId) {
            return {
                ID: insertId,
                ...data
            }
        }
        else {
            return null
        }
    }

    async updateUser(data: IUserData): Promise<IUserReturn> {
        const [insertId] = await db<IUserData>('users')
            .insert(data);
        if (insertId) {
            return {
                ...data
            }
        }
        else {
            return null
        }
    }
}