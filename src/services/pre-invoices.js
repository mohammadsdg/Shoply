import PreInvoiceDao from "../dao/pre-invoices.js";
export default class PreInvoiceService {
    preInvoiceDao = new PreInvoiceDao();
    // Get all pending items
    getAllPreInvoices = async (conditions) => {
        return this.preInvoiceDao.getAll(conditions);
    };
    setPending = async (markedItem) => {
        return this.preInvoiceDao.createPending(markedItem);
    };
    setApproved = async (pendingItems, soldItems) => {
        return this.preInvoiceDao.updatePending(pendingItems, soldItems);
    };
}
//# sourceMappingURL=pre-invoices.js.map