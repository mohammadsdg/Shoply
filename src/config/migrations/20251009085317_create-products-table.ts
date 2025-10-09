import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', table => {
        table.increments('ID').primary();
        table
            .integer('section_id')
            .notNullable()
            .unsigned();
        table
            .foreign('section_id')
            .references('ID')
            .inTable('sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        
        table
            .integer('material_id')
            .notNullable()
            .unsigned();
        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        table
            .integer('alloy_id')
            .notNullable()
            .unsigned();
        table
            .foreign('alloy_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        table
            .integer('grouping_id')
            .notNullable()
            .unsigned()
        table
            .foreign('grouping_id')
            .references('ID')
            .inTable('groupings')
            .onDelete('CASCADE').
            onUpdate('CASCADE')

        table
            .integer('brand_id')
            .notNullable()
            .unsigned()
        table
            .foreign('brand_id')
            .references('ID')
            .inTable('brand_id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        table.specificType('status', 'tinyint').defaultTo(10);
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('products')
}

