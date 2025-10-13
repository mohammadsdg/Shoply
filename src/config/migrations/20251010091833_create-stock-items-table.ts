import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('stock_items', table=> {
        table.increments('ID').primary();
        table.integer('product_size_id').unsigned().notNullable();
        table.string('single_product');

        table.specificType('status', 'tinyint');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('stock_items')
}

