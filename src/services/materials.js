import MaterialDao from "../dao/materials.js";
export default class MaterialService {
    dao = new MaterialDao();
    async getAllMaterials() {
        return this.dao.getAll();
    }
    async getMaterial(id) {
        return this.dao.getById(id);
    }
    async setMaterial(data) {
        return this.dao.create(data);
    }
    async updateMaterial(id, data) {
        return this.dao.update(id, data);
    }
    async deleteMaterial(id) {
        return this.dao.delete(id);
    }
}
//# sourceMappingURL=materials.js.map