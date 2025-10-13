import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('groupings', table => {
        table.increments().primary();
        table.string('name', 50);
        table.integer('section_id').notNullable().unsigned();
        table.integer('material_id').notNullable().unsigned();
        table.specificType('status', 'tinyint').defaultTo(10);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('groupings')
}

