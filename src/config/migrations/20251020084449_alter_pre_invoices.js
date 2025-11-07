export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM pre_invoices
        WHERE Key_name IN (
            'fk_pre_invoices_stock_item_id',
            'uq_pre_invoices_stock_item_id'
        );
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('pre_invoices', table => {
            table
                .foreign('stock_item_id')
                .references('ID')
                .inTable('stock_items')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_pre_invoices_stock_item_id');
            table.unique(['stock_item_id'], 'uq_pre_invoices_stock_item_id');
        });
    }
    else {
        console.warn("Table 'pre_invoices' does not exist. Skipping foreign key creation.");
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM pre_invoices
        WHERE Key_name IN (
            'fk_pre_invoices_stock_item_id',
            'uq_pre_invoices_stock_item_id'
        );
    `);
    const existingIndex = result[0];
    // Getting all the constraint names from pre_invoices
    const resultFK = await knex.raw(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE_USAGE
        WHERE TABLE_NAME = 'pre_invoices'
            AND CONSTRAINT_NAME IN ('fk_pre_invoices_stock_item_id')
    `);
    const existingFK = resultFK[0];
    if (existingFK.find(r => r.CONSTRAINT_NAME === 'fk_pre_invoices_stock_item_id')) {
        await knex.schema.alterTable('pre_invoices', table => {
            table.dropForeign(['stock_item_id'], 'fk_pre_invoices_stock_item_id');
        });
    }
    else if (existingIndex.find(r => r.Key_name === 'uq_pre_invoices_stock_item_id')) {
        await knex.schema.alterTable('pre_invoices', table => {
            table.dropUnique(['stock_item_id'], 'uq_pre_invoices_stock_item_id');
        });
    }
    return;
}
//# sourceMappingURL=20251020084449_alter_pre_invoices.js.map