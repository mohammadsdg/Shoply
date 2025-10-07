export interface IDimensionData {
    ID: number,
    user_id: number,
    dimensions: number,
    type: string,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateDimensionInput = Omit<IDimensionData, 'ID' | 'type' | 'status' | 'created_at' | 'updated_at'>

export type TUpdateDimensionInput = Partial<TCreateDimensionInput>