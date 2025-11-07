import DimensionsDao from "../dao/dimensions.js";
export default class DimensionService {
    dimensionDao = new DimensionsDao();
    async getAllDimensions() {
        return await this.dimensionDao.getAll();
    }
    async getDimension(id) {
        return await this.dimensionDao.getById(id);
    }
    async setDimension(data) {
        return await this.dimensionDao.create(data);
    }
    async updateDimension(id, data) {
        return await this.dimensionDao.update(id, data);
    }
    async deleteDimension(id) {
        return await this.dimensionDao.delete(id);
    }
}
//# sourceMappingURL=dimensions.js.map