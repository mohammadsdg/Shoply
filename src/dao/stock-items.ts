import { db } from "../config/db.js";
import type { IStockItemData, TCreateStockItem, TUpdateStockItem } from "../types/stock-items.js";

export default class StockItemDao {
    async getAll() {
        return db<IStockItemData>('stock_items')
            .select('*');
    }

    async getById(id: number) {
        return db<IStockItemData>('stock_items')
            .where({ ID: id })
            .first()
    }

    async create(data: TCreateStockItem) {
        return db<IStockItemData>('stock_items')
            .insert(data);
    }

    async update(id: number, data: TUpdateStockItem) {
        return db<IStockItemData>('stock_items')
            .where({ ID: id })
            .update(data)
    }

    async delete(id: number) {
        return db<IStockItemData>('stock_items')
            .where({ ID: id })
            .delete()
    }
}