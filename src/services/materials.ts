import { pool } from "../config/db.ts";
import MaterialDao from "../dao/materials.ts";

export default class MaterialService {
    private dao = new MaterialDao();
    async getAllMaterials() {
        return this.dao.getAll();
    }

    async getMaterial(id: number) {
        return this.dao.getById(id);
    }

    async setMaterial(name: string) {
        return this.dao.create(name);
    }

    async updateMaterial(id: number, name: string) {
        return this.dao.update(id, name);
    }

    async deleteMaterial(id: number) {
        return this.dao.delete(id);
    }
}