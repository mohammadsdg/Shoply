import { db } from "../config/db.ts";
import type { ISectionData, TCreateSection, TUpdateSection } from "../types/sections.ts";

export default class SectionDao {
    async getAll() {
        return db<ISectionData>('sections').select('*');
    }

    async getById(id: number) {
        return db<ISectionData>('sections')
            .where({ ID: id })
            .first();
        
    }

    async create(data: TCreateSection) {
        const [insertId] = await db<ISectionData>('sections')
            .insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateSection) {
        const affectedRows = await db<ISectionData>('sections')
            .where({ ID: id })
            .update(data);
        return affectedRows
    }

    async delete(id: number) {
        const affectedRows = await db<ISectionData>('sections')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}