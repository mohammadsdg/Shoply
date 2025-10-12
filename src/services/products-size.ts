import ProductSizeDao from "../dao/products-size.js";
import type { TCreateProductSize, TUpdateProductSize } from "../types/products-size.js";

export default class ProductSizeService {
    private productSizeDao = new ProductSizeDao();
    async getAllProducts() {
        return this.productSizeDao.getAll();
    }

    async getProductSize(id: number) {
        return this.productSizeDao.getById(id);
    }

    async setProductSize(data: TCreateProductSize) {
        return this.productSizeDao.create(data);
    }

    async updateProductSize(id: number, data: TUpdateProductSize) {
        return this.productSizeDao.update(id, data)
    }

    async deleteProductSize(id: number) {
        return this.productSizeDao.delete(id);
    }
}