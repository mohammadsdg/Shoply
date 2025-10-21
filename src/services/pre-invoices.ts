import PreInvoiceDao from "../dao/pre-invoices.js"
import type { IPreInvoiceConditions, TCreatePreInvoiceInput } from "../types/pre-invoices.js";

export default class PreInvoiceService {
    private preInvoiceDao = new PreInvoiceDao();
    // Get all pending items
    getAllPreInvoices = async (conditions: IPreInvoiceConditions) => {
        return this.preInvoiceDao.getAll(conditions);
    }

    setPending = async (data: TCreatePreInvoiceInput) => {
        return this.preInvoiceDao.createPending(data);
    }
}