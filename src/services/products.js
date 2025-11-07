import ProductDao from "../dao/products.js";
export default class Products {
    productDao = new ProductDao();
    async getAllProducts() {
        return this.productDao.getAll();
    }
    async getProduct(id) {
        return this.productDao.getById(id);
    }
    async setProduct(data) {
        return this.productDao.create(data);
    }
    async updateProduct(id, data) {
        return this.productDao.update(id, data);
    }
    async deleteProduct(id) {
        return this.productDao.delete(id);
    }
}
//# sourceMappingURL=products.js.map