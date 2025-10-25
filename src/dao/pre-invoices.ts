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
    // Create pending items
    async createPending(markedItems: TCreatePreInvoiceInput[]) {
        try {
            const [insertId] = await db<IPreInvoiceData>('pre_invoices')
                .insert(markedItems);
            return insertId
        }
        catch(err) {
            throw err;
        }
    }
}