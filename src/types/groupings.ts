export interface IGroupingData {
    ID: number,
    name: string,
    section_id: number,
    material_id: number,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateGrouping = Omit<IGroupingData, 'ID' | 'status' | 'created_at' | 'updated_at'>
export type TUpdateGrouping = Partial<TCreateGrouping>