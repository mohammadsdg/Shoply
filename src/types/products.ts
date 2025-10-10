export interface IProductView {
    ID: number,
    section_name: string,
    material_name: string,
    grouping_name: string,
    brand_name: string,
    alloy_name: string,
    alloy_code: string
}

export interface IProductData {
    ID: number,
    section_id: number,
    material_id: number,
    alloy_id: number,
    grouping_id: number,
    brand_id: number,
    status: number,
    created_at: Date,
    updated_at: Date,
}

export type TCreateProduct = Omit<IProductData, 'ID' | 'status' | 'created_at' | 'updated_at'>
export type TUpdateProduct = Partial<TCreateProduct>