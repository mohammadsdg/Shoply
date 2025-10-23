import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('products');

    if (!exists) {
        return knex.schema.createTable('products', table => {
            table.increments('ID').primary();
            table
                .integer('section_id')
                .notNullable()
                .unsigned();
            
            table
                .integer('material_id')
                .notNullable()
                .unsigned();
    
            table
                .integer('alloy_id')
                .notNullable()
                .unsigned();
    
            table
                .integer('grouping_id')
                .notNullable()
                .unsigned();
    
            table
                .integer('brand_id')
                .notNullable()
                .unsigned();
    
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('products')
}

