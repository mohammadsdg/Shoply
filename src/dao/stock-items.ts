import { db } from "../config/db.js";
import type { IStockItemData, TCreateStockItem, TUpdateStockItem } from "../types/stock-items.js";

export default class StockItemDao {
    
    // Get all the stock_items and the datas for creating pre-invoice
    async getAll(shop_id: number) {

        const query = db<IStockItemData>({ si: 'stock_items' })
            .leftJoin({ ps: 'products_size' }, 'ps.ID', 'si.product_size_id' )
            .leftJoin({ shp: 'shop_products' }, 'shp.ID', 'ps.shop_products_id')
            .leftJoin({ p: 'products' }, 'p.ID', 'shp.product_id')
            .leftJoin({ s: 'sections' }, 's.ID', 'p.section_id')
            .select(
                'si.ID',
                'si.product_size_id',
                'si.width',
                'si.single_product_code',
                'si.parent_id',
                'si.status',
                'ps.param_one',
                'ps.param_two',
                'ps.param_three',
                'ps.density',
                'ps.price',
                's.name as section_name',
                'shp.ID as shop_product_id'
            )
        if (shop_id) {
            query.where("shp.shop_id", shop_id);
        }
        const rows = await query;
        return rows;
    }

    async getByIds(itemIds: { ID: number }[]): Promise<IStockItemData[]> {
        const ids = itemIds.map(item=> item.ID);
        const result = await db<IStockItemData>('stock_items')
            .whereIn('ID', ids)
            .andWhere({ status: 10 });
        if (result.length === 0) {
            throw new Error("No stock item found")
        }

        return result;
    }

    // Initialize first items without single_product_code or parent_id
    async createMulti(data: TCreateStockItem, number: number) {
        let createdData: TCreateStockItem[] = [];
        for(let i = 0; i<number; i++) {
            const [rawInsertId] = await db<IStockItemData>('stock_items')
                .insert(data);
            let insertId = Number(rawInsertId);
            createdData.push({
                ID: insertId,
                ...data
            })
        }
        return createdData
    }

    // create new products and soft delete sold products (status = 0)
    async upsert(items: TUpdateStockItem[]): Promise<TUpdateStockItem[]> {
        // using transaction knexjs
        return await db.transaction(async (trx) => {
            const createdItems: TUpdateStockItem[] = [];
            try {
                // 1. Deactive old items first (status = 0)
                const itemIds = items.map(i => i.ID);

                if (itemIds.length > 0) {
                    await trx<IStockItemData>('stock_items')
                        .whereIn('ID', itemIds)
                        .andWhere({ status: 10 })
                        .update({ status: 0, sold_at: new Date() })
                }

                // 2. Insert new items
                for (let item of items) {
                    // seperating ID because we dont want it in insert
                    const {ID, ...newItem} = item;
                    // Create new product
                    const [rawInsertId] = await trx<IStockItemData>('stock_items')
                        .insert(newItem);
                    const insertId = Number(rawInsertId);
                    createdItems.push({
                        ID: insertId,
                        ...newItem,
                        parent_id: item.ID ?? null
                    })
                }
                // Commit automatically by returning
                return createdItems
            }
            catch(err) {
                throw err
            }
        })
    }

    async update(id: number, data: TUpdateStockItem) {
        return db<IStockItemData>('stock_items')
            .where({ ID: id })
            .update(data)
    }

    // Update the status to 0 (dont show status=0)
    async delete(id: number) {
        return db<IStockItemData>('stock_items')
            .where({ ID: id, status: 10 })
            .update({ status: 0, sold_at: new Date() })
    }
}