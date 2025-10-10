import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('shop_products', table=>{ 
        table.increments('ID').primary();

        table.integer('shop_id').unsigned().notNullable();
        table.integer('product_id').unsigned().notNullable();

        table.specificType('status', 'tinyint');
        table.timestamps(true, true);
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('shop_products');
}

