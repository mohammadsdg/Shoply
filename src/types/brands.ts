export interface ISetBrandParams {
    user_id: number,
    name: string,
    info: string,
    status: number,
}

export interface IGetBrandData extends ISetBrandParams {
    created_at: Date,
    updated_at: Date
}

export type TUpdateBrandDataParams = Omit<ISetBrandParams, "user_id">

