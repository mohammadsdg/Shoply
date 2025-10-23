import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('products_size');
    
    if (!exists) {
        return knex.schema.createTable('products_size', table=> {
            table.increments('ID').primary();
    
            table
                .integer('shop_products_id')
                .unsigned()
                .notNullable();
    
            table.float('width').defaultTo(null);
            table.float('param_one').defaultTo(null);
            table.float('param_two').defaultTo(null);
            table.float('param_three').defaultTo(null);
    
            table.double('weight').defaultTo(null);
            table.float('density').defaultTo(null);
            table.bigint('price').defaultTo(null);
            table.integer('number');
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        })
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('products_size');
}

