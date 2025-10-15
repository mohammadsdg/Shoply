import StockItemDao from "../dao/stock-items.js";
import type { TCreateStockItem, TUpdateStockItem } from "../types/stock-items.js";

export default class StockItemService {
    private stockItemDao = new StockItemDao();
    async getAllStockItems() {
        return this.stockItemDao.getAll();
    }

    async getStockItem(id: number) {
        return this.stockItemDao.getById(id);
    }

    async setMultiStockItem(data: TCreateStockItem, number: number) {
        return this.stockItemDao.createMulti(data, number);
    }

    async sellStockItem(items: TUpdateStockItem[]) {
        return this.stockItemDao.upsert(items);
    }

    async updateStockItem(id: number, data: TUpdateStockItem) {
        return this.stockItemDao.update(id, data);
    }

    async deleteStockItem(id: number) {
        return this.stockItemDao.delete(id);
    }
}