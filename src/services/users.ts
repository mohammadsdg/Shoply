import UserDao from "../dao/users.js"
import type { IUserInput } from "../types/users.js";

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