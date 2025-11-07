import StockItemDao from "../dao/stock-items.js";
export default class StockItemService {
    stockItemDao = new StockItemDao();
    async getAllStockItems(conditions) {
        return this.stockItemDao.getAll(conditions);
    }
    async getStockItems(ids) {
        return this.stockItemDao.getByIds(ids);
    }
    // initialize new items 
    async setMultiStockItem(data, number) {
        return this.stockItemDao.createMulti(data, number);
    }
    async setStockItem(items) {
        return this.stockItemDao.upsert(items);
    }
    async updateStockItem(id, data) {
        return this.stockItemDao.update(id, data);
    }
    async deleteStockItem(id) {
        return this.stockItemDao.delete(id);
    }
}
//# sourceMappingURL=stock-items.js.map