export interface IShopData {
    ID: number,
    user_id: number,
    name: string,
    phone: string,
    lastname?: string,
    firstname?: string,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateShop = Omit<IShopData, 'ID' | 'status' | 'created_at' | 'updated_at'>
export type TUpdateShop = Partial<TCreateShop>