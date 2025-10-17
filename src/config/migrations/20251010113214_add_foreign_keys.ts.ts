import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // @SHOPS_TABLE
    await knex.schema.alterTable('shops', table=> {
        table.unique('user_id', {
            indexName: 'uq_shops_user_id'
        });
        
        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_shops_user_id')
    })

    // @BRANDS_TABLE
    await knex.schema.alterTable('brands', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_brands_user_id')
    })

    // @SECTIONS_TABLE
    await knex.schema.alterTable('sections', table=> {

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_sections_material_id')
    })

    // @DIMENSIONS_TABLE
    await knex.schema.alterTable('dimensions', table=> {

        table
            .foreign('user_id')
            .references('ID')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_dimensions_user_id')
    })

    // @GROUPING_TABLE
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

    // @ALLOY_TABLE
    await knex.schema.alterTable('alloys', table=> {

        table
            .foreign('material_id')
            .references('ID')
            .inTable('materials')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .withKeyName('fk_alloys_material_id')
    })

    // @PRODUCTS_TABLE
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

    // @SHOP_PRODUCTS_TABLE
    await knex.schema.alterTable('shop_products', table=> {
        table.unique([
            'shop_id',
            'product_id'
        ], {
            indexName: 'uq_shop_product_two'
        });

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
        table.unique(['shop_products_id'], {
            indexName: 'uq_products_size_shop_product_id'
        });

        table
            .foreign('shop_products_id', 'fk_products_size_shop_product_id')
            .references('ID')
            .inTable('shop_products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })

    // @STOCK_ITEMS_TABLE
    await knex.schema.alterTable('stock_items', table=> {
        table.unique('parent_id', {
            indexName: 'uq_stock_items_parent_id'
        })

        table
            .foreign('product_size_id', 'fk_stock_items_product_size_id')
            .references('ID')
            .inTable('products_size')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table
            .foreign('parent_id', 'fk_stock_items_parent_id')
            .references('ID')
            .inTable('stock_items')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}

export async function down(knex: Knex): Promise<void> {
    
    // @DROP STOCK_ITEMS
    await knex.schema.alterTable('stock_items', table=> {
        table.dropForeign(['parent_id'], 'fk_stock_items_parent_id');
        table.dropUnique(['parent_id'], 'uq_stock_items_parent_id');
        table.dropForeign(['product_size_id'], 'fk_stock_items_product_size_id');
    })

    // @DROP PRODUCTS_SIZE
    await knex.schema.alterTable('products_size', table=> {
        table.dropForeign(['shop_products_id'], 'fk_products_size_shop_product_id');
        table.dropUnique(['shop_products_id'], 'uq_products_size_shop_product_id')
    })

    // @DROP SHOP_PRODUCTS
    await knex.schema.alterTable('shop_products', table=> {
        table.dropForeign(['shop_id'], 'fk_shop_products_shop_id');
        table.dropForeign(['product_id'], 'fk_shop_products_product_id');
        table.dropUnique(['shop_id', 'product_id'], 'uq_shop_product_two');
    })
    
    // @DROP PRODUCTS
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

    // @DROP BRANDS
    await knex.schema.alterTable('brands', table=> {
        table.dropForeign(['user_id'], 'fk_brands_user_id')
    })

    // @DROP SECTIONS
    await knex.schema.alterTable('sections', table=> {
        table.dropForeign(['material_id'], 'fk_sections_material_id')
    })

    // @DROP DIMENSIONS
    await knex.schema.alterTable('dimensions', table=> {
        table.dropForeign(['user_id'], 'fk_dimensions_user_id')
    })

    // @DROP GROUPINGS
    await knex.schema.alterTable('groupings', table=> {
        table.dropForeign(['section_id'], 'fk_groupings_section_id');
        table.dropForeign(['material_id'], 'fk_groupings_material_id');
    })
    
    // @DROP SHOPS
    await knex.schema.alterTable('shops', table=> {
        table.dropForeign(['user_id'], 'fk_shops_user_id');
        table.dropUnique(['user_id'], 'uq_shops_user_id');
    })
    

}
