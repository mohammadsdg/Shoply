import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";

export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN
    `);
    const existingIndex: IIndexRow[] = result[0];

    if (existingIndex.length===0) {
        await knex.schema.alterTable('products_size', table=> {
            table
                .foreign('shop_products_id', 'fk_products_size_shop_product_id')
                .references('ID')
                .inTable('shop_products')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        })
    }
}

export async function down(knex: Knex): Promise<void> {
    // Getting i
    const result = await knex.raw(
        'fk_products_size_shop_product_id'
    );
    const existingIndex: IIndexRow[] = result[0];
    if (existingIndex.find(r=> r.Key_name === 'fk_products_size_shop_product_id')) {
        await knex.schema.alterTable('products_size', table=> {
            table.dropForeign(['shop_products_id'], 'fk_products_size_shop_product_id');
        })
    }
}

