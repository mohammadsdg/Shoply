import ProductDao from "../dao/products.ts";
import type { TCreateProduct, TUpdateProduct } from "../types/products.ts";

export default class Products {
    private productDao = new ProductDao();
    async getAllProducts() {
        return this.productDao.getAll();
    }

    async getProduct(id: number) {
        return this.productDao.getById(id);
    }

    async setProduct(data: TCreateProduct) {
        return this.productDao.create(data);
    }

    async updateProduct(id: number, data: TUpdateProduct) {
        return this.productDao.update(id, data);
    }

    async deleteProduct(id: number) {
        return this.productDao.delete(id);
    }
}