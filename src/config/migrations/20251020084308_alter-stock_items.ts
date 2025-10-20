import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stock_items', table=> {
        table.unique('parent_id', {
            indexName: 'uq_stock_items_parent_id'
        })

        table
            .foreign('product_size_id', 'fk_stock_items_product_size_id')
            .references('ID')
            .inTable('products_size')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table
            .foreign('parent_id', 'fk_stock_items_parent_id')
            .references('ID')
            .inTable('stock_items')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stock_items', table=> {
        table.dropForeign(['parent_id'], 'fk_stock_items_parent_id');
        table.dropUnique(['parent_id'], 'uq_stock_items_parent_id');
        table.dropForeign(['product_size_id'], 'fk_stock_items_product_size_id');
    })
}

