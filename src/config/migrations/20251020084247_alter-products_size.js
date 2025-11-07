export async function up(knex) {
    const result = await knex.raw(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('products_size', table => {
            table
                .foreign('shop_products_id', 'fk_products_size_shop_product_id')
                .references('ID')
                .inTable('shop_products')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
    }
}
export async function down(knex) {
    // Getting i
    const result = await knex.raw('fk_products_size_shop_product_id');
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_products_size_shop_product_id')) {
        await knex.schema.alterTable('products_size', table => {
            table.dropForeign(['shop_products_id'], 'fk_products_size_shop_product_id');
        });
    }
}
//# sourceMappingURL=20251020084247_alter-products_size.js.map