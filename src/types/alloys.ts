export interface IAlloyData {
    ID: number
    material_id: number,
    name: string,
    code: string,
    cutting_speed: string,
    created_at: Date,
    updated_at: Date
}

// Data needed for create an alloy
export type TCreateAlloyInput = Omit<IAlloyData, "ID" | "created_at" | "updated_at">
// Data for updating (all fields optional except id)
export type TUpdateAlloyInput = Partial<TCreateAlloyInput>