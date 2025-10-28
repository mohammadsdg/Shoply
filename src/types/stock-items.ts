export interface IStockItemData {
    ID?: number,
    product_size_id: number,
    width: number,
    single_product_code: string | null | undefined,
    parent_id?: number | null | undefined,
    status: number,
    created_at: number,
    updated_at: number,
    sold_at?: Date
}

export interface ISellStockItemInput {
    ID: number,
    product_size_id: number,
    width: number,
    sold_width: number,
    parent_id: number,
    single_product_code: string | null
}

export interface ISellStockRequestBody {
    soldItems: ISellStockItemInput[];
}

export type TCreateStockItem = Omit<IStockItemData, 'status' | 'created_at' | 'updated_at'> & {
    soldWidth?: number
};
export type TUpdateStockItem = Partial<TCreateStockItem>

export interface getAllStockConditions {
    shopId: number;
    productSizeId: number;
}