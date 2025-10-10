import { db } from "../config/db.ts";
import type { IProductData, TCreateProduct, TUpdateProduct } from "../types/products.ts";

export default class ProductDao {
    async getAll() {
        const rows = await db<IProductData>('products')
            .select(
                'products.ID',
                'sections.name as sectionName',
                'materials.name as materialName',
                'groupings.name as groupingName',
                'brands.name as brandName',
                'alloys.name as alloyName',
                'alloys.code as alloyCode'
            )
            .innerJoin('materials', 'materials.ID', 'products.material_id')
            .innerJoin('sections', 'sections.ID', 'products.section_id')
            .innerJoin('groupings', 'groupings.ID', 'products.grouping_id')
            .innerJoin('brands', 'brands.ID', 'products.brand_id')
            .innerJoin('alloys', 'alloys.ID', 'products.alloy_id');
        return rows.length ? rows : false;
    }
    
    async getById(id: number) {
        const rows = await db<IProductData>('products')
            .where({ ID: id })
            .first();
        return rows;
    }

    async create(data: TCreateProduct) {
        const [insertId] = await db<IProductData>('products')
            .insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateProduct) {
        const affectedRows = await db<IProductData>('products')
            .where({ ID: id })
            .update(data);
        return affectedRows;
    }

    async delete(id: number) {
        const affectedRows = await db<IProductData>('products')
            .where({ ID: id })
            .delete();
        return affectedRows
    }
}