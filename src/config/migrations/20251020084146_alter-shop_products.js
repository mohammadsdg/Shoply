export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM shop_products
        WHERE Key_name IN (
            'fk_shop_products_shop_id',
            'fk_shop_products_product_id',
            'uq_shop_product_two'
        )
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('shop_products', table => {
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
            table.unique([
                'shop_id',
                'product_id'
            ], {
                indexName: 'uq_shop_product_two'
            });
        });
    }
    else {
        if (existingIndex.find(r => r.Key_name === 'fk_shop_products_shop_id')) {
            await knex.schema.alterTable('shop_products', table => {
                table
                    .foreign('shop_id', 'fk_shop_products_shop_id')
                    .references('ID')
                    .inTable('shops')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            });
        }
        else if (existingIndex.find(r => r.Key_name === 'fk_shop_products_product_id')) {
            await knex.schema.alterTable('shop_products', table => {
                table
                    .foreign('shop_id', 'fk_shop_products_product_id')
                    .references('ID')
                    .inTable('shops')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            });
        }
        else if (existingIndex.find(r => r.Key_name === 'uq_shop_product_two')) {
            await knex.schema.alterTable('shop_products', table => {
                table
                    .foreign('shop_id', 'uq_shop_product_two')
                    .references('ID')
                    .inTable('shops')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            });
        }
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM shop_products
        WHERE Key_name IN (
            'fk_shop_products_shop_id',
            'fk_shop_products_product_id',
            'uq_shop_product_two'
        );
    `);
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_shop_products_shop_id')) {
        await knex.schema.alterTable('shop_products', table => {
            table.dropForeign(['shop_id'], 'fk_shop_products_shop_id');
        });
    }
    else if (existingIndex.find(r => r.Key_name === 'fk_shop_products_shop_id')) {
        await knex.schema.alterTable('shop_products', table => {
            table.dropForeign(['product_id'], 'fk_shop_products_product_id');
        });
    }
    else if (existingIndex.find(r => r.Key_name === 'fk_shop_products_shop_id')) {
        await knex.schema.alterTable('shop_products', table => {
            table.dropUnique(['shop_id', 'product_id'], 'uq_shop_product_two');
        });
    }
}
//# sourceMappingURL=20251020084146_alter-shop_products.js.map