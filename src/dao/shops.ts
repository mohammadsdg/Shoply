import { db } from "../config/db.js";
import type { IShopData, TCreateShop, TUpdateShop } from "../types/shops.js";

export default class ShopDao {
    async getAll(): Promise<IShopData[] | undefined> {
        return db<IShopData>('shops').select("*");
    }

    async getById(id: number): Promise<IShopData | undefined> {
        return db<IShopData>('shops')
            .where({ ID: id })
            .first();
        
    }

    async create(data: TCreateShop): Promise<number | undefined> {
        const [insertId] = await db<IShopData>('shops')
            .insert(data);
        return insertId;
    }

    async update(id: number, data: TUpdateShop): Promise<number | undefined> {
        const affectedRows = await db<IShopData>('shops')
            .where({ ID: id })
            .update(data)
        return affectedRows;
    }

    async delete(id: number): Promise<number | undefined> {
        const affectedRows = await db<IShopData>('shops')
            .where({ ID: id })
            .delete();
        return affectedRows;
    }
}