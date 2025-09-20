export interface IGetSectionData extends ISetSectionData {
    ID: number | null,
}

export interface ISetSectionData {
    name: string,
    params: number,
    param_one: number,
    param_two?: number | null,
    param_three?: number | null,
    created_at?: Date,
    updated_at?: Date,
    status?: number
}