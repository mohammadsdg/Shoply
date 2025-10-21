import express from "express";
import PreInvoiceController from "../controllers/pre-invoices.js";
import PreInvoiceService from "../services/pre-invoices.js";
const router = express.Router();

const preInvoiceService = new PreInvoiceService()
const preInvoiceController = new PreInvoiceController(preInvoiceService);

// Get all pre-invoices (optional query ?status=pending or ?status=approved)
router.get('/pre-invoices', preInvoiceController.getAllPreInvoices);
router.post('/pre-invoices', preInvoiceController.setPreInvoice);

export default router