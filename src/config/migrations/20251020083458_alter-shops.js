export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM shops WHERE Key_name = 'uq_shops_user_id';
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('shops', table => {
            table
                .foreign('user_id')
                .references('ID')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_shops_user_id');
            table.unique('user_id', {
                indexName: 'uq_shops_user_id'
            });
        });
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM shops
        WHERE Key_name IN (
            'fk_shops_user_id',
            'uq_shops_user_id'
        )
    `);
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_shops_user_id')) {
        await knex.schema.alterTable('shops', table => {
            table.dropUnique(['user_id'], 'uq_shops_user_id');
        });
    }
    else if (existingIndex.find(r => r.Key_name === 'uq_shops_user_id')) {
        await knex.schema.alterTable('shops', table => {
            table.dropForeign(['user_id'], 'fk_shops_user_id');
        });
    }
}
//# sourceMappingURL=20251020083458_alter-shops.js.map