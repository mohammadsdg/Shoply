import ShopProductDao from "../dao/shop-products.js";
export default class ShopProductService {
    shopProductDao = new ShopProductDao();
    async getAllShopProducts() {
        return this.shopProductDao.getAll();
    }
    async getShopProducts(id) {
        return this.shopProductDao.getByShopId(id);
    }
    async setShopProduct(data) {
        return this.shopProductDao.create(data);
    }
    async updateShopProduct(id, data) {
        return this.shopProductDao.update(id, data);
    }
    async deleteShopProduct(id) {
        return this.shopProductDao.delete(id);
    }
}
//# sourceMappingURL=shop-products.js.map