import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('alloys', table => {
        table.increments('ID').primary();
        table.integer('material_id').notNullable();
        table.string('name', 20).defaultTo(null);
        table.string('code', 20).defaultTo(null);
        table.specificType('status', 'tinyint');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('alloys');
    
}

