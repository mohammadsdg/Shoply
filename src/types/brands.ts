export interface IBrandData {
    ID: number,
    user_id: number,
    name: string,
    info?: string,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateBrandInput = Omit<IBrandData, "ID" | "status" | "created_at" | "updated_at">

export type TUpdateBrandParams = Partial<TCreateBrandInput>

