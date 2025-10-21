import { db } from "../config/db.js";
import type { IPreInvoiceConditions, IPreInvoiceData, TCreatePreInvoiceInput } from "../types/pre-invoices.js";

export default class PreInvoiceDao {
    // Get all pre-invoice items based on ?status
    async getAll(conditions: IPreInvoiceConditions) {
        const { status } = conditions;
        try {
            const result = await db<IPreInvoiceData>('pre_invoices')
                .select('*')
                .where({ status });
            return result;
        }
        catch(err) {
            throw err;
        }
    }

    async createPending(data: TCreatePreInvoiceInput) {
        try {
            const [insertId] = await db<TCreatePreInvoiceInput>('pre_invoices')
                .insert(data);
            return insertId
        }
        catch(err) {
            throw err;
        }
    }


}