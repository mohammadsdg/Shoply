import DimensionsDao from "../dao/dimensions.js"
import type { IDimensionData, TCreateDimensionInput, TUpdateDimensionInput } from "../types/dimensions.js";

export default class DimensionService {
    private dimensionDao = new DimensionsDao();
    async getAllDimensions(): Promise<IDimensionData[]> {
        return await this.dimensionDao.getAll();
    }

    async getDimension(id: number): Promise<IDimensionData | undefined> {
        return await this.dimensionDao.getById(id);
    }

    async setDimension(data: TCreateDimensionInput): Promise<number | undefined> {
        return await this.dimensionDao.create(data);
    }

    async updateDimension(id: number, data: TUpdateDimensionInput): Promise<number | undefined> {
        return await this.dimensionDao.update(id, data);
    }

    async deleteDimension(id: number): Promise<number | undefined> {
        return await this.dimensionDao.delete(id);
    }
}