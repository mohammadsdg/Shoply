export interface IPreInvoiceData {
    ID: number,
    stock_item_id: number,
    weight: number,
    price: number,
    number: number,
    customer_name: string,
    status: string,
    created_at: Date,
    updated_at: Date
}

export type TCreatePreInvoiceInput = Omit<
    IPreInvoiceData, 
    'ID' | 'status' | 'created_at' | 'updated_at'
>

export interface IPreInvoiceRequestBody {
    marked_items: TCreatePreInvoiceInput[]
}

export interface IPreInvoiceConditions {
    status: 'pending' | 'approved'
}