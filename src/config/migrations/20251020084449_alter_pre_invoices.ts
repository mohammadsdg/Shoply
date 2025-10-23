import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('pre_invoices');
    if (!exists) {
        await knex.schema.alterTable('pre_invoices', table => {
            table
                .foreign('stock_item_id')
                .references('ID')
                .inTable('stock_items')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_pre_invoices_stock_item_id');
            
            table.unique(['stock_item_id'], 'uq_pre_invoices_stock_item_id')
        })
    } else {
        console.warn("Table 'pre_invoices' does not exist. Skipping foreign key creation.");
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('pre_invoices', table=> {
        table.dropForeign(['stock_item_id'], 'fk_pre_invoices_stock_item_id')
    })
}

