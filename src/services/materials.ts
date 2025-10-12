import MaterialDao from "../dao/materials.js";
import type { TCreateMaterial, TUpdateMaterial } from "../types/materials.js";

export default class MaterialService {
    private dao = new MaterialDao();
    async getAllMaterials() {
        return this.dao.getAll();
    }

    async getMaterial(id: number) {
        return this.dao.getById(id);
    }

    async setMaterial(data: TCreateMaterial) {
        return this.dao.create(data);
    }

    async updateMaterial(id: number, data: TUpdateMaterial) {
        return this.dao.update(id, data);
    }

    async deleteMaterial(id: number) {
        return this.dao.delete(id);
    }
}