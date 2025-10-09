import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.createTable('dimensions', table => {
        table.increments().primary();
        table
            .integer('user_id')
            .notNullable()
            .defaultTo(1)
            .unsigned()
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
            
        table.float('dimensions').notNullable();
        table.string('type');
        table.timestamps(true, true);
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('dimensions');
}

