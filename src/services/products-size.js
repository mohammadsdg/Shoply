import ProductSizeDao from "../dao/products-size.js";
export default class ProductSizeService {
    productSizeDao = new ProductSizeDao();
    async getAllProducts(shop_id) {
        return this.productSizeDao.getAll(shop_id);
    }
    async getProductSize(id) {
        return this.productSizeDao.getById(id);
    }
    async setProductSize(data) {
        return this.productSizeDao.create(data);
    }
    async updateProductSize(id, data) {
        return this.productSizeDao.update(id, data);
    }
    async deleteProductSize(id) {
        return this.productSizeDao.delete(id);
    }
}
//# sourceMappingURL=products-size.js.map