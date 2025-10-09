import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('groupings', table => {
        table.increments().primary();
        table.string('name', 50);
        table.integer('section_id').notNullable();
        table.integer('material_id').notNullable();
        table.specificType('status', 'tinyint').defaultTo(10);
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('groupings')
}

