import BrandDao from "../dao/brands.js";
export default class BrandService {
    dao = new BrandDao();
    async getAllBrands() {
        return this.dao.getAll();
    }
    async getBrand(id) {
        return this.dao.getById(id);
    }
    async setBrand(data) {
        return this.dao.create(data);
    }
    async updateBrand(id, data) {
        return this.dao.update(id, data);
    }
    async deleteBrand(id) {
        return this.dao.delete(id);
    }
}
//# sourceMappingURL=brands.js.map