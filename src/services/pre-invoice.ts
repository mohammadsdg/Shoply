import PreInvoiceDao from "../dao/pre-invoice.js"

export default class PreInvoiceService {
    private preInvoiceDao = new PreInvoiceDao();
    getAllPending = async () => {
        return this.preInvoiceDao.getPendings();
    }

    getAllApproved = async () => {
        return this.preInvoiceDao.getApproved();
    }
}