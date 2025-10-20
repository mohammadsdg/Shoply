import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('pre_invoice', table => {
        table
            .foreign('stock_item_id')
            .references('ID')
            .inTable('stock_items')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_pre_invoice_stock_item_id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('pre_invoice', table=> {
        table.dropForeign(['stock_item_id'], 'fk_pre_invoice_stock_item_id')
    })
}

