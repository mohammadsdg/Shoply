import ShopDao from "../dao/shops.js";
export default class ShopService {
    shopDao = new ShopDao();
    async getAllShops() {
        return this.shopDao.getAll();
    }
    async getShop(id) {
        return this.shopDao.getById(id);
    }
    async setShop(data) {
        return this.shopDao.create(data);
    }
    async updateShop(id, data) {
        return this.shopDao.update(id, data);
    }
    async deleteShop(id) {
        return this.shopDao.delete(id);
    }
}
//# sourceMappingURL=shops.js.map