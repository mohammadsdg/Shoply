import BrandDao from "../dao/brands.js";
import type { IBrandData, TCreateBrandInput, TUpdateBrandParams } from "../types/brands.js";

export default class BrandService {
    private dao = new BrandDao();

    async getAllBrands(): Promise<TCreateBrandInput[]> {
        return this.dao.getAll();
    }
    
    async getBrand(id: number): Promise<IBrandData | undefined> {
        return this.dao.getById(id);
    }

    async setBrand(data: TCreateBrandInput): Promise<number | undefined> {
        return this.dao.create(data)
    }

    async updateBrand(id: number, data: TUpdateBrandParams): Promise<number | undefined> {
        return this.dao.update(id, data);
    }

    async deleteBrand(id: number): Promise<number> {
        return this.dao.delete(id);
    }
}