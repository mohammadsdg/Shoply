import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('stock_items', table=> {
        table.increments('ID').primary();
        table.integer('product_size_id').unsigned().notNullable();
        table.string('single_product');

        table.specificType('status', 'tinyint');
        table.timestamps(true, true);
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('stock_items')
}

