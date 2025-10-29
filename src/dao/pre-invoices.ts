import { db } from "../config/db.js";
import type { 
    IPreInvoiceConditions, 
    IPreInvoiceData, 
    TCreatePreInvoiceInput, 
    TUpdatePreInvoiceInput 
} from "../types/pre-invoices.js";

import type { 
    ISellStockItemInput, 
    IStockItemData,
    TUpdateStockItem
} from "../types/stock-items.js";

export default class PreInvoiceDao {
    // Get all pre-invoice items based on ?status
    async getAll(conditions: IPreInvoiceConditions) {
        const { status, shopId } = conditions;
        try {
            let query = db<IPreInvoiceData>('pre_invoices')
                .leftJoin('stock_items', 'stock_items.ID', 'pre_invoices.stock_item_id')
                .leftJoin('products_size as ps', 'ps.ID', 'stock_items.product_size_id')
                .leftJoin('shop_products as sp', 'sp.ID', 'ps.shop_products_id')
                .leftJoin('shops', 'shops.ID', 'sp.shop_id')
                .select(
                    'stock_items.ID',
                    'stock_items.product_size_id',
                    'stock_items.width',
                    'stock_items.parent_id',
                    'stock_items.single_product_code',
                    'stock_items.status as stock_item_status',
                    'pre_invoices.ID',
                    'pre_invoices.stock_item_id',
                    'pre_invoices.status as pre_invoice_status',
                    'pre_invoices.price',
                    'pre_invoices.weight',
                    'pre_invoices.number',
                    'pre_invoices.customer_name',
                    'pre_invoices.width',
                    'sp.shop_id'
                )
                .whereRaw('pre_invoices.status = ?', [status])
            
            if (shopId) {
                query = query
                    .where({ shop_id: shopId })
            }
            const result = await query;
            const preInvoices = result.map(r=> ({
                ID: r.ID,
                stock_item_id: r.stock_item_id,
                status: r.pre_invoice_status,
                price: r.price,
                weight: r.weight,
                number: r.number,
                customer_name: r.customer_name,
                width: r.width
            }))

            const stockItems = result.map(r=> ({
                ID: r.ID,
                product_size_id: r.product_size_id,
                width: r.width,
                parent_id: r.parent_id,
                single_product_code: r.single_product_code,
                status: r.stock_item_status
            }));

            return {
                preInvoices,
                stockItems
            }
        }
        catch(err) {
            throw err;
        }
    }

    // Create pending items with status pending
    async createPending(markedItem: TCreatePreInvoiceInput) {
        // using transaction knexjs
        try {
            const [insertId] = await db<IPreInvoiceData>('pre_invoices')
                .insert(markedItem);
            return {
                ID: insertId,
                ...markedItem
            }
        }
        catch(err) {
            throw err;
        }
    }

    // Update status to approved
    async updatePending(
        pendingItems: TUpdatePreInvoiceInput[],
        soldItems: ISellStockItemInput[]
    ) {
        // using transaction knexjs
        return await db.transaction(async (trx) => {
            const updatedPreInvoiceItems: TUpdatePreInvoiceInput[] = [];
            const createdStockItems: TUpdateStockItem[] = [];
            try {
                const soldItemIds = soldItems.map(i => i.ID);
                const pendingItemIds = pendingItems.map(i => i.ID);
                
                // 1. Deactive old items first (status = 0)
                if (soldItemIds.length > 0 && pendingItemIds.length > 0) {
                    const result = await trx<TUpdatePreInvoiceInput>('pre_invoices')
                        .whereIn('ID', pendingItemIds)
                        .andWhere({ status: 'pending' })
                        .update({ status: 'approved' });

                    await trx<IStockItemData>('stock_items')
                        .whereIn('ID', soldItemIds)
                        .andWhere({ status: 10 })
                        .update({ status: 0, sold_at: new Date() });
                }

                // 2. Insert new items
                // for (let item of pendingItems) {
                //     // seperating ID because we dont want it in insert
                //     const {ID, ...newItem} = item;
                //     const [rawInsertId] = await trx<IPreInvoiceData>('pre_invoices')
                //         .insert(newItem);
                //     const insertId = Number(rawInsertId);
                //     updatedPreInvoiceItems.push({
                //         ID: insertId,
                //         ...newItem
                //     })
                // }
                for (let item of soldItems) {
                    // seperating ID because we dont want it in insert
                    const {ID, ...newItem} = item;
                    // Create new product
                    const [rawInsertId] = await trx<IStockItemData>('stock_items')
                        .insert(newItem);
                    const insertId = Number(rawInsertId);
                    createdStockItems.push({
                        ID: insertId,
                        ...newItem,
                        parent_id: item.ID ?? null
                    })
                }
                // Commit automatically by returning
                return {
                    approvedItems: updatedPreInvoiceItems,
                    createdItems: createdStockItems
                }
            }
            catch(err) {
                throw err
            }
        })
    }
}