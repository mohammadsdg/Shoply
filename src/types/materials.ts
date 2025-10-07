export interface IMaterialData {
    ID: number,
    name: string,
    status: number,
    created_at: Date,
    updated_at: Date
}

export type TCreateMaterial = Omit<IMaterialData, 'ID' | 'status' | 'created_at' | 'updated_at'>
export type TUpdateMaterial = Partial<TCreateMaterial>