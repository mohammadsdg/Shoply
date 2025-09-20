export interface ISetShopParams {
    user_id: number,
    name: string,
    phone: string
}

export interface IGetShopData extends ISetShopParams {
    ID: number,
    firstname: string,
    lastname: string
}

export interface IUpdateShopData {
    name: string,
    firstname: string,
    lastname: string,
    phone: string
}