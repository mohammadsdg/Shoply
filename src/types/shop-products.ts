export interface IShopProductData {
    ID: number,
    shop_id: number,
    product_id: number,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateShopProduct = Omit<
    IShopProductData, 'ID' | 'status' | 'created_at' | 'updated_at'
>

export type TUpdateShopProduct = Partial<TCreateShopProduct>