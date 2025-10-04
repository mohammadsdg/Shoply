export interface ISetBrandParams {
    user_id: number,
    name: string,
    info: string,
}

export interface IGetBrandData extends ISetBrandParams {
    ID: number,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TUpdateBrandParams = Omit<ISetBrandParams, "user_id">

