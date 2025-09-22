export interface IDimensionGetData {
    ID: number,
    user_id: number,
    dimensions: number,
    type: string,
    created_at: Date,
    updated_at: Date
}

export interface IDimensionSetParam {
    dimensions: number
}