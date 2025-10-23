import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('stock_items');

    if (!exists) {
        return knex.schema.createTable('stock_items', table=> {
            table.increments('ID').primary();
            table.integer('product_size_id').unsigned().notNullable();
            table.double('width').unsigned().notNullable();
            table.text('single_product_code');
            table.integer('parent_id').unsigned().notNullable();
    
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
            table.timestamp('sold_at').defaultTo(knex.fn.now());
        })
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('stock_items')
}

