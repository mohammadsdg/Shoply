export interface IPreInvoiceData {
    ID: number,
    stock_item_id: number,
    weight: number,
    price: number,
    customer_name: string,
    status: string,
    created_at: Date,
    updated_at: Date
}

export type TPreInvoiceInput = Omit<
    IPreInvoiceData, 
    'ID' | 'customer_name' | 'status' | 'created_at' | 'updated_at'
>
