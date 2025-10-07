import { db, } from "../config/db.ts";
import type { IMaterialData, TCreateMaterial, TUpdateMaterial } from "../types/materials.ts";

export default class MaterialDao {
    async getAll(): Promise<IMaterialData[]> {
        return db<IMaterialData>('materials').select("*");
    }

    async getById(id: number) {
        return db<IMaterialData>('materials').where({ ID: id }).first()
    }
    
    async create(data: TCreateMaterial) {
        const [insertId] = await db<IMaterialData>('materials').insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateMaterial,) {
        const affectedRows = await db<IMaterialData>('materials')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }

    async delete(id: number) {
        const affectedRows = await db<IMaterialData>('materials')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}