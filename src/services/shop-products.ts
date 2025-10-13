import ShopProductDao from "../dao/shop-products.js";
import type { TCreateShopProduct, TUpdateShopProduct } from "../types/shop-products.js";

export default class ShopProductService {
    private shopProductDao = new ShopProductDao();

    async getAllShopProducts() {
        return this.shopProductDao.getAll();
    }

    async getShopProducts(id: number) {
        return this.shopProductDao.getByShopId(id);
    }

    async setShopProduct(data: TCreateShopProduct) {
        return this.shopProductDao.create(data);
    }

    async updateShopProduct(id: number, data: TUpdateShopProduct) {
        return this.shopProductDao.update(id, data);
    }

    async deleteShopProduct(id: number) {
        return this.shopProductDao.delete(id);
    }
}