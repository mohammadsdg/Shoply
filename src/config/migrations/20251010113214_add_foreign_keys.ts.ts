import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // @SHOPS_TABLE
    await knex.schema.alterTable('shops', table=> {
        table.unique(['user_id']);
        
        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @BRANDS_TABLE
    await knex.schema.alterTable('brands', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @SECTIONS_TABLE
    await knex.schema.alterTable('sections', table=> {

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @DIMENSIONS_TABLE
    await knex.schema.alterTable('dimensions', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @GROUPING_TABLE
    await knex.schema.alterTable('groupings', table=> {

        table
            .foreign('section_id')
            .references('ID')
            .inTable('sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @ALLOY_TABLE
    await knex.schema.alterTable('alloys', table=> {

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })

    // @PRODUCTS_TABLE
    await knex.schema.alterTable('products', table=> {
        table.unique([
            'section_id', 
            'material_id', 
            'alloy_id',
            'grouping_id',
             'brand_id'
        ], 'uq_products_idx');

        table
            .foreign('section_id')
            .references('ID')
            .inTable('sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table
            .foreign('alloy_id')
            .references('ID')
            .inTable('alloys')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table
            .foreign('grouping_id')
            .references('ID')
            .inTable('groupings')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table
            .foreign('brand_id')
            .references('ID')
            .inTable('brands')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })

    // @SHOP_PRODUCTS_TABLE
    await knex.schema.alterTable('shop_products', table=> {
        table.unique([
            'shop_id',
            'product_id'
        ], 'uq_shop_product_idx');

        table
            .foreign('shop_id', 'fk_shop_products_shop_id')
            .references('ID')
            .inTable('shops')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .foreign('product_id', 'fk_shop_products_product_id')
            .references('ID')
            .inTable('products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })

    // @PRODUCTS_SIZE_TABLE
    await knex.schema.alterTable('products_size', table=> {
        table.unique(['shop_products_id'], 'uq_products_size_idx');

        table
            .foreign('shop_products_id', 'fk_shop_product_id')
            .references('ID')
            .inTable('shop_products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })

    // @STOCK_ITEMS_TABLE
    await knex.schema.alterTable('stock_items', table=> {

        table
            .foreign('product_size_id', 'fk_product_size')
            .references('ID')
            .inTable('products_size')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table
            .foreign('parent_id', 'fk_parent_id')
            .references('ID')
            .inTable('stock_items')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}

export async function down(knex: Knex): Promise<void> {
    
    // @DROP STOCK_ITEMS
    await knex.schema.alterTable('stock_items', table=> {
        table.dropForeign(['product_size_id']);
    })

    // @DROP PRODUCTS_SIZE
    await knex.schema.alterTable('products_size', table=> {
        table.dropForeign(['shop_products_id']);
    })

    // @DROP SHOP_PRODUCTS
    await knex.schema.alterTable('shop_products', table=> {
        table.dropForeign(['shop_id']);
        table.dropForeign(['product_id']);
    })
    
    // @DROP PRODUCTS
    await knex.schema.alterTable('products', table=> {
        table.dropForeign(['brand_id']);
        table.dropForeign(['grouping_id']);
        table.dropForeign(['alloy_id']);
        table.dropForeign(['section_id']);
        table.dropForeign(['material_id']);
    })

    // @DROP BRANDS
    await knex.schema.alterTable('brands', table=> {
        table.dropForeign(['user_id'])
    })

    // @DROP SECTIONS
    await knex.schema.alterTable('sections', table=> {
        table.dropForeign(['material_id'])
    })

    // @DROP DIMENSIONS
    await knex.schema.alterTable('dimensions', table=> {
        table.dropForeign(['user_id'])
    })

    // @DROP GROUPINGS
    await knex.schema.alterTable('groupings', table=> {
        table.dropForeign(['section_id']);
        table.dropForeign(['material_id']);
    })
    
    // @DROP SHOPS
    await knex.schema.alterTable('shops', table=> {
        table.dropForeign(['user_id'])
    })
    

}
