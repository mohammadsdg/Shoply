import PreInvoiceDao from "../dao/pre-invoices.js"
import type { IPreInvoiceConditions, IPreInvoiceRequestBody, TCreatePreInvoiceInput, TUpdatePreInvoiceInput } from "../types/pre-invoices.js";
import type { ISellStockItemInput } from "../types/stock-items.js";

export default class PreInvoiceService {
    private preInvoiceDao = new PreInvoiceDao();
    // Get all pending items
    getAllPreInvoices = async (conditions: IPreInvoiceConditions) => {
        return this.preInvoiceDao.getAll(conditions);
    }

    setPending = async (markedItem: TCreatePreInvoiceInput) => {
        return this.preInvoiceDao.createPending(markedItem);
    }

    setApproved = async (
        pendingItems: TUpdatePreInvoiceInput[],
        soldItems: ISellStockItemInput[]
    ) => {
        return this.preInvoiceDao.updatePending(pendingItems, soldItems);
    }
}