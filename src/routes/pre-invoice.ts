import express from "express";
import PreInvoiceController from "../controllers/pre-invoice.js";
import PreInvoiceService from "../services/pre-invoice.js";
const router = express.Router();

const preInvoiceService = new PreInvoiceService()
const preInvoiceController = new PreInvoiceController(preInvoiceService);

router.get('/pre-invoice/approved', preInvoiceController.getAllApproved);
router.get('/pre-invoice/pending', preInvoiceController.getAllPendings);

export default router