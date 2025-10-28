import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";

export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM products
        WHERE Key_name IN (
            'fk_products_section_id',
            'fk_products_material_id',
            'fk_products_alloy_id',
            'fk_products_grouping_id',
            'fk_products_brand_id',
            'uq_products_five'
        )
    `);
    const existingIndex: IIndexRow[] = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('products', table=> {
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
    
            table.unique([
                'section_id', 
                'material_id', 
                'alloy_id',
                'grouping_id',
                'brand_id'
            ], 'uq_products_five');
        })
    }
    else {
        if (existingIndex.find(r=> r.Key_name === 'fk_products_section_id')) {
            await knex.schema.alterTable('products', table=> {
                table
                    .foreign('section_id')
                    .references('ID')
                    .inTable('sections')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_products_section_id')
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_products_section_id')) {
            await knex.schema.alterTable('products', table=> {
                table
                    .foreign('material_id')
                    .references('ID')
                    .inTable('materials')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_products_material_id');
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_products_alloy_id')) {
            await knex.schema.alterTable('products', table=> {
                table
                    .foreign('alloy_id')
                    .references('ID')
                    .inTable('alloys')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_products_alloy_id');
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_products_grouping_id')) {
            await knex.schema.alterTable('products', table=> {
            table
                .foreign('grouping_id')
                .references('ID')
                .inTable('groupings')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_products_grouping_id');
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_products_brand_id')) {
            await knex.schema.alterTable('products', table=> {
                table
                    .foreign('brand_id')
                    .references('ID')
                    .inTable('brands')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_products_brand_id');
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_products_alloy_id')) {
            await knex.schema.alterTable('products', table=> {
                table.unique([
                    'section_id', 
                    'material_id', 
                    'alloy_id',
                    'grouping_id',
                    'brand_id'
                ], 'uq_products_five');
            })
        }
    }
}


export async function down(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM products
        WHERE Key_name IN (
            'fk_products_brand_id',
            'fk_products_grouping_id',
            'fk_products_alloy_id',
            'fk_products_section_id',
            'fk_products_material_id',
            'uq_products_five'
        )
    `)
    const existingIndex: IIndexRow[] = result[0];
    
    if (existingIndex.find(r=> r.Key_name === 'fk_products_brand_id')) {
        await knex.schema.alterTable('products', table=> {
            table.dropForeign(['brand_id'], 'fk_products_brand_id');
        })
    }
    else if (existingIndex.find(r=> r.Key_name === 'fk_products_grouping_id')) {
        await knex.schema.alterTable('products', table=> {
            table.dropForeign(['grouping_id'], 'fk_products_grouping_id');
        })
    }
    else if (existingIndex.find(r=> r.Key_name === 'fk_products_alloy_id')) {
        await knex.schema.alterTable('products', table=> {
            table.dropForeign(['alloy_id'], 'fk_products_alloy_id');
        })
    }
    else if (existingIndex.find(r=> r.Key_name === 'fk_products_section_id')) {
        await knex.schema.alterTable('products', table=> {
            table.dropForeign(['section_id'], 'fk_products_section_id');
        })
    }
    else if (existingIndex.find(r=> r.Key_name === 'fk_products_material_id')) {
        await knex.schema.alterTable('products', table=> {
            table.dropForeign(['section_id'], 'fk_products_material_id');
        })
    }
    else if (existingIndex.find(r=> r.Key_name === 'uq_products_five')) {
        await knex.schema.alterTable('products', table=> {
            table.dropUnique([
                'brand_id',
                'grouping_id',
                'alloy_id',
                'section_id',
                'material_id'
            ], 'uq_products_five')
        })
    }
}

