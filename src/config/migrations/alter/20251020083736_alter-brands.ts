import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('brands', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_brands_user_id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('brands', table=> {
        table.dropForeign(['user_id'], 'fk_brands_user_id')
    })
}

