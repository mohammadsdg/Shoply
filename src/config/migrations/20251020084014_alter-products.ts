import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('products', table=> {
        table.unique([
            'section_id', 
            'material_id', 
            'alloy_id',
            'grouping_id',
            'brand_id'
        ], {
            indexName: 'uq_products_five'
        });

        table
            .foreign('section_id')
            .references('ID')
            .inTable('sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_products_section_id')

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_products_material_id');

        table
            .foreign('alloy_id')
            .references('ID')
            .inTable('alloys')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_products_alloy_id')

        table
            .foreign('grouping_id')
            .references('ID')
            .inTable('groupings')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_products_grouping_id');

        table
            .foreign('brand_id')
            .references('ID')
            .inTable('brands')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_products_brand_id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('products', table=> {
        table.dropForeign(['brand_id'], 'fk_products_brand_id');
        table.dropForeign(['grouping_id'], 'fk_products_grouping_id');
        table.dropForeign(['alloy_id'], 'fk_products_alloy_id');
        table.dropForeign(['section_id'], 'fk_products_section_id');
        table.dropForeign(['material_id'], 'fk_products_material_id');

        table.dropUnique([
            'brand_id',
            'grouping_id',
            'alloy_id',
            'section_id',
            'material_id'
        ], 'uq_products_five')
    })
}

