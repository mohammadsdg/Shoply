import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('dimensions', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_dimensions_user_id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('dimensions', table=> {
        table.dropForeign(['user_id'], 'fk_dimensions_user_id')
    })
}

