import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";

export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM groupings 
        WHERE Key_name IN (
            'fk_groupings_section_id',
            'fk_groupings_material_id'
        );
    `);
    const existingIndex: IIndexRow[] = result[0];

    if (existingIndex.length === 0) {
        await knex.schema.alterTable('groupings', table=> {
            table
                .foreign('section_id')
                .references('ID')
                .inTable('sections')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_groupings_section_id');

            table
                .foreign('material_id')
                .references('ID')
                .inTable('materials')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_groupings_material_id')
        })
    }
    else {
        if (!(existingIndex.find((r) => r.Key_name === 'fk_groupings_section_id'))) {
            await knex.schema.alterTable('groupings', table=> {
                table
                    .foreign('section_id')
                    .references('ID')
                    .inTable('sections')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_groupings_section_id');
            })
        }
        if (!(existingIndex.find((r) => r.Key_name === 'fk_groupings_material_id'))) {
            await knex.schema.alterTable('groupings', table => {
                table
                    .foreign('material_id')
                    .references('ID')
                    .inTable('materials')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_groupings_material_id')
            })
        }
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('groupings', table=> {
        table.dropForeign(['section_id'], 'fk_groupings_section_id');
        table.dropForeign(['material_id'], 'fk_groupings_material_id');
    })
}

