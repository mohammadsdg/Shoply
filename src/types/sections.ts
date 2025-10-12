export interface ISectionData {
    ID: number,
    name: string,
    param_one: string,
    param_two?: string | null,
    param_three?: string | null,
    created_at: Date,
    updated_at: Date,
    status: number
}

export type TCreateSection = Omit<ISectionData, 'ID' | 'created_at' | 'updated_at' | 'status'>
export type TUpdateSection = Partial<TCreateSection>