import ShopDao from "../dao/shops.ts"
import type { TCreateShop, TUpdateShop } from "../types/shops.ts";

export default class ShopService {
    private shopDao = new ShopDao();
    async getAllShops() {
        return this.shopDao.getAll();
    }

    async getShop(id: number) {
        return this.shopDao.getById(id);
    }

    async setShop(data: TCreateShop) {
        return this.shopDao.create(data);
    }

    async updateShop(id: number, data: TUpdateShop) {
        return this.shopDao.update(id, data);
    }

    async deleteShop(id: number) {
        return this.shopDao.delete(id)
    }
}