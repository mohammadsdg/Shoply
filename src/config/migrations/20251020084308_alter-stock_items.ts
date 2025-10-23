import type { Knex } from "knex";
import type { IIndexRow } from "../../types/knex.js";

export async function up(knex: Knex): Promise<void> {
    const result = await knex.raw(`
        SHOW INDEX FROM stock_items
        WHERE Key_name IN (
            'fk_stock_items_product_size_id',
            'fk_stock_items_parent_id',
            'uq_stock_items_parent_id'
        );
    `)
    const existingIndex: IIndexRow[] = result[0];
    // There is no index
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('stock_items', table=> {
            table
                .foreign('product_size_id')
                .references('ID')
                .inTable('products_size')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_stock_items_product_size_id')
            
            table
                .foreign('parent_id')
                .references('ID')
                .inTable('stock_items')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_stock_items_parent_id')
                
    
            table.unique(['parent_id'], {
                indexName: 'uq_stock_items_parent_id'
            })
        })
    }
    // There is an index
    else {
        if (existingIndex.find(r=> r.Key_name === 'fk_stock_items_product_size_id')) {
            await knex.schema.alterTable('stock_items', table=> {
                table
                .foreign('product_size_id')
                .references('ID')
                .inTable('products_size')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_stock_items_product_size_id')
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_stock_items_product_size_id')) {
            await knex.schema.alterTable('stock_items', table=> {
                table
                    .foreign('parent_id')
                    .references('ID')
                    .inTable('stock_items')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('fk_stock_items_parent_id')
            })
        }
        else if (existingIndex.find(r=> r.Key_name === 'fk_stock_items_product_size_id')) {
            await knex.schema.alterTable('stock_items', table=> {
                table.unique(['parent_id'], {
                    indexName: 'uq_stock_items_parent_id'
                })
            })
        }
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stock_items', table=> {
        table.dropForeign(['parent_id'], 'fk_stock_items_parent_id');
        table.dropUnique(['parent_id'], 'uq_stock_items_parent_id');
        table.dropForeign(['product_size_id'], 'fk_stock_items_product_size_id');
    })
}

