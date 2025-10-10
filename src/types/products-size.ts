export interface IProductSizeData {
    ID: number,
    shop_products_id: number, 
    width: number, 
    param_one: number, 
    param_two?: number | null, 
    param_three?: number | null,
    weight: number,
    density?: number,
    price: number
    number: number,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateProductSize = Omit<
    IProductSizeData, 
    'ID' | 'status' | 'created_at' | 'updated_at'
>

export type TUpdateProductSize = Partial<TCreateProductSize>