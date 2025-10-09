import StockItemDao from "../dao/stock-items.ts";
import type { TCreateStockItem, TUpdateStockItem } from "../types/stock-items.ts";

export default class StockItemService {
    private stockItemDao = new StockItemDao();
    async getAllStockItems() {
        return this.stockItemDao.getAll();
    }

    async getStockItem(id: number) {
        return this.stockItemDao.getById(id);
    }

    async setStockItem(data: TCreateStockItem) {
        return this.stockItemDao.create(data);
    }

    async updateStockItem(id: number, data: TUpdateStockItem) {
        return this.stockItemDao.update(id, data);
    }

    async deleteStockItem(id: number) {
        return this.stockItemDao.delete(id);
    }
}