
export interface IApiResopnse<T> {
    success: boolean,
    body: null | T,
    message: string
}