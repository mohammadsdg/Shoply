import { db } from "../config/db.js";
export default class ProductDao {
    async getAll() {
        const rows = await db('products')
            .select('products.ID', 'sections.name as sectionName', 'materials.name as materialName', 'groupings.name as groupingName', 'brands.name as brandName', 'alloys.name as alloyName', 'alloys.code as alloyCode')
            .innerJoin('materials', 'materials.ID', 'products.material_id')
            .innerJoin('sections', 'sections.ID', 'products.section_id')
            .innerJoin('groupings', 'groupings.ID', 'products.grouping_id')
            .innerJoin('brands', 'brands.ID', 'products.brand_id')
            .innerJoin('alloys', 'alloys.ID', 'products.alloy_id');
        return rows.length ? rows : null;
    }
    async getById(id) {
        const rows = await db('products')
            .where({ ID: id })
            .first();
        return rows;
    }
    async create(data) {
        try {
            const [insertId] = await db('products')
                .insert(data);
            return insertId;
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, data) {
        const affectedRows = await db('products')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }
    async delete(id) {
        const affectedRows = await db('products')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}
//# sourceMappingURL=products.js.map