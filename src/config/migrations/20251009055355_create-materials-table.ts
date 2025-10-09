import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('materials', table => {
        table.increments('ID').primary();
        table.string('name', 100).notNullable();
        table.specificType('status', 'tinyint').defaultTo(10);
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('materials')
}

