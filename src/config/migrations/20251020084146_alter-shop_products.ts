import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('shop_products', table=> {
        table.unique([
            'shop_id',
            'product_id'
        ], {
            indexName: 'uq_shop_product_two'
        });

        table
            .foreign('shop_id', 'fk_shop_products_shop_id')
            .references('ID')
            .inTable('shops')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .foreign('product_id', 'fk_shop_products_product_id')
            .references('ID')
            .inTable('products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('shop_products', table=> {
        table.dropForeign(['shop_id'], 'fk_shop_products_shop_id');
        table.dropForeign(['product_id'], 'fk_shop_products_product_id');
        table.dropUnique(['shop_id', 'product_id'], 'uq_shop_product_two');
    })
}

