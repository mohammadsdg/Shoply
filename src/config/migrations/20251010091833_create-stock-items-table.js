export async function up(knex) {
    const exists = await knex.schema.hasTable('stock_items');
    if (!exists) {
        return knex.schema.createTable('stock_items', table => {
            table.increments('ID').primary();
            table.integer('product_size_id').unsigned().notNullable();
            table.double('width').unsigned().notNullable();
            table.text('single_product_code');
            table.integer('parent_id').unsigned();
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('sold_at').defaultTo(knex.fn.now());
        });
    }
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('stock_items');
}
//# sourceMappingURL=20251010091833_create-stock-items-table.js.map