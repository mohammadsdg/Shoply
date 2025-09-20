export interface IGetUserParams {
    user: string
}

export interface ISetUserParams extends IGetUserParams {
    password: string,
    role: string
}

export interface IGetUserData {
    ID?: number | null,
    user: string,
    password: string,
    role: string | null,
    shop_id: number | null
}

export type TUserSafeData = Omit<IGetUserData, "password">