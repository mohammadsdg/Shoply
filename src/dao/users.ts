import { db } from "../config/db.ts";
import type { IUserData, IUserInput } from "../types/users.ts";

export default class UserDao {
    async getAllUsers() {
        return db<IUserData>('users').select("*");
    }

    async getUser(data: IUserInput) {
        return db<IUserData>('users')
            .where({ username: data.username })
            .first()
    }

    async setUser(data: IUserInput) {
        const [insertId] = await db<IUserData>('users')
            .insert(data);
        return insertId
    }
}