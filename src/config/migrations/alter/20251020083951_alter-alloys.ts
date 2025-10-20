
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('alloys', table=> {

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_alloys_material_id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('alloys', table => {
        table.dropForeign(['material_id'], 'fk_alloys_material_id')
    })
}

