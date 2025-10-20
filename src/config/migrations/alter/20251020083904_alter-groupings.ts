import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('groupings', table=> {
        table
            .foreign('section_id')
            .references('ID')
            .inTable('sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_groupings_section_id')

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_groupings_material_id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('groupings', table=> {
        table.dropForeign(['section_id'], 'fk_groupings_section_id');
        table.dropForeign(['material_id'], 'fk_groupings_material_id');
    })
}

