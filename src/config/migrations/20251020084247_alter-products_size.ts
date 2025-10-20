import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('products_size', table=> {
        table
            .foreign('shop_products_id', 'fk_products_size_shop_product_id')
            .references('ID')
            .inTable('shop_products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('products_size', table=> {
        table.dropForeign(['shop_products_id'], 'fk_products_size_shop_product_id');
    })
}

