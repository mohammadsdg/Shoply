import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('dimensions', table => {
        table.increments().primary();
        table
            .integer('user_id')
            .notNullable()
            .defaultTo(1)
            .unsigned()
            
        table.float('dimensions').notNullable();
        table.text('type');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('dimensions');
}

