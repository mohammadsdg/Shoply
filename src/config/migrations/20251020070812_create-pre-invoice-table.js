export async function up(knex) {
    const exists = await knex.schema.hasTable('pre_invoices');
    if (!exists) {
        await knex.schema.createTable('pre_invoices', table => {
            table.increments('ID').primary();
            table.integer('stock_item_id').unsigned().notNullable();
            table.double('weight').unsigned().notNullable();
            table.bigint('price').unsigned().notNullable();
            table.smallint('number').unsigned().notNullable();
            table.string('customer_name').nullable();
            table.enum('status', ['pending', 'approved', 'cancelled'], {
                useNative: true,
                enumName: 'deal_enum'
            }).defaultTo('pending');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
    else {
        return console.log('pre_invoices exists');
    }
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('pre_invoices');
}
//# sourceMappingURL=20251020070812_create-pre-invoice-table.js.map