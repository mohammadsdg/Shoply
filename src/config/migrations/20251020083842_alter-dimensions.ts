import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";


export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM dimensions WHERE Key_name IN ('fk_dimensions_user_id');
    `);
    const existingIndex: IIndexRow[] = result[0];

    if (existingIndex.length===0) {
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
}

export async function down(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM dimensions
        WHERE Key_name IN (
            'fk_dimensions_user_id'
        );
    `);
    const existingIndex: IIndexRow[] = result[0];
    if (existingIndex.find(r=> r.Key_name === 'fk_dimensions_user_id')) {
        await knex.schema.alterTable('dimensions', table=> {
            table.dropForeign(['user_id'], 'fk_dimensions_user_id');
        })
    }
}

