import { db } from "../config/db.js";
export default class UserDao {
    // Get all users
    async getAllUsers() {
        return db('users').select("*");
    }
    // Get user by username
    async getUser(data) {
        return db('users')
            .where(data)
            .first();
    }
    // Create user by user
    async setUser(data) {
        const [insertId] = await db('users')
            .insert(data);
        if (insertId) {
            return {
                ID: insertId,
                ...data
            };
        }
        else {
            return null;
        }
    }
    // Create user by super-admin
    async setRole(data) {
        const [insertId] = await db('users')
            .insert(data);
        if (insertId) {
            return {
                ID: insertId,
                ...data
            };
        }
        else {
            return null;
        }
    }
    async updateUser(data) {
        const [insertId] = await db('users')
            .insert(data);
        if (insertId) {
            return {
                ...data
            };
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=users.js.map