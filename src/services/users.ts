import UserDao from "../dao/users.ts"
import type { IUserInput } from "../types/users.ts";

export default class UserService {
    private userDao = new UserDao();
    async getAllUsers() {
        return this.userDao.getAllUsers();
    }

    async getUser(data: IUserInput) {
        return this.userDao.getUser(data)
    }

    async setUser(data: IUserInput) {
        return this.userDao.setUser(data);
    }
}