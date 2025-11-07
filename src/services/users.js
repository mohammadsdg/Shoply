import UserDao from "../dao/users.js";
export default class UserService {
    userDao = new UserDao();
    async getAllUsers() {
        return this.userDao.getAllUsers();
    }
    async getUser(data) {
        return this.userDao.getUser(data);
    }
    async setUser(data) {
        return this.userDao.setUser(data);
    }
    async setRole(data) {
        return this.userDao.setRole(data);
    }
}
//# sourceMappingURL=users.js.map