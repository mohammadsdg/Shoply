export interface IUserData {
    ID: number,
    username: string,
    password: string,
    role: string,
    shop_id?: number,
    created_at?: Date,
    updated_at?: Date,
    status?: number
}

export interface IUserInput {
    ID?: number,
    username: string,
    password?: string,
    role?: string
}
