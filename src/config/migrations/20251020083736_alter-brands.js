export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM brands WHERE Key_name IN ('fk_brands_user_id', 'brands_name_unique');
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('brands', table => {
            table
                .foreign('user_id')
                .references('ID')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_brands_user_id');
        });
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM brands
        WHERE Key_name IN (
            'fk_brands_user_id'
        )
    `);
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_brands_user_id')) {
        await knex.schema.alterTable('brands', table => {
            table.dropForeign(['user_id'], 'fk_brands_user_id');
        });
    }
}
//# sourceMappingURL=20251020083736_alter-brands.js.map