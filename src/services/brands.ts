import BrandDao from "../dao/brands.ts";
import type { IGetBrandData, ISetBrandParams, TUpdateBrandParams } from "../types/brands.ts";

export default class BrandService {
    private dao = new BrandDao();

    async getAllBrands(): Promise<IGetBrandData[]> {
        return this.dao.getAll();
    }
    
    async getBrand(id: number): Promise<IGetBrandData | undefined> {
        return this.dao.getById(id);
    }

    async setBrand(data: ISetBrandParams): Promise<number> {
        return this.dao.create(data)
    }

    async updateBrand(id: number, data: TUpdateBrandParams): Promise<number> {
        return this.dao.update(id, data);
    }

    async deleteBrand(id: number): Promise<number> {
        return this.dao.delete(id);
    }
}