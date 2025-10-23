import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";


export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM sections WHERE Key_name IN ('fk_sections_material_id')        
    `);
    const existingIndex: IIndexRow[] = result[0];

    if (!existingIndex) {
        await knex.schema.alterTable('sections', table=> {
            table
                .foreign('material_id')
                .references('ID')
                .inTable('materials')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_sections_material_id')
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('sections', table=> {
        table.dropForeign(['material_id'], 'fk_sections_material_id')
    })
}

