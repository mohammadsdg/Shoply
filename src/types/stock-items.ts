export interface IStockItemData {
    ID: number,
    product_size_id: number,
    single_product: number,
    status: number,
    created_at: number,
    updated_at: number
}

export type TCreateStockItem = Omit<IStockItemData, 'ID' | 'status' | 'created_at' | 'updated_at'>;
export type TUpdateStockItem = Partial<TCreateStockItem>