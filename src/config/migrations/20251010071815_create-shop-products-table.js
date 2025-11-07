export async function up(knex) {
    const exists = await knex.schema.hasTable('shop_products');
    if (!exists) {
        return knex.schema.createTable('shop_products', table => {
            table.increments('ID').primary();
            table.integer('shop_id').unsigned().notNullable();
            table.integer('product_id').unsigned().notNullable();
            table.specificType('status', 'tinyint');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('shop_products');
}
//# sourceMappingURL=20251010071815_create-shop-products-table.js.map