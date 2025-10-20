import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('shops', table=> {
        table.unique('user_id', {
            indexName: 'uq_shops_user_id'
        });
        
        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_shops_user_id')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('shops', table=> {
        table.dropForeign(['user_id'], 'fk_shops_user_id');
        table.dropUnique(['user_id'], 'uq_shops_user_id');
    })
}

