import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";


export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM brands WHERE Key_name IN ('fk_brands_user_id', 'brands_name_unique');
    `);

    const existingIndex: IIndexRow[] = result[0];
    if (existingIndex.length === 0) {
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
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('brands', table=> {
        table.dropForeign(['user_id'], 'fk_brands_user_id')
    })
}

