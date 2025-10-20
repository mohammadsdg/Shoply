import { db } from "../config/db.js";
import type { IPreInvoiceData } from "../types/pre-invoice.js";

export default class PreInvoiceDao {
    // Get all pre-invoice items
    async getPendings() {
        const result = await db<IPreInvoiceData>('pre_invoice')
            .select('*')
            .where({ status: 'pending '});
        return result;
    }

    async getApproved() {
        const result = await db<IPreInvoiceData>('pre_invoice')
            .select('*')
            .where({ status: 'approved '});
        return result;
    }
}